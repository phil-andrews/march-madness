import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { gameResults, getDb, getNeonSql, teams } from "@/lib/db";
import { TOURNAMENT_CONFIG, type SyncMode } from "@/lib/pick10/config";
import { getAliasesForAssignedNumber, normalizeTeamName } from "@/lib/pick10/team-aliases";

const SCOREBOARD_ENDPOINT =
  "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard";
const SYNC_LOCK_ID = 2026031901;

type EspnTeam = {
  id: string;
  location?: string;
  displayName?: string;
  shortDisplayName?: string;
};

type EspnCompetitor = {
  winner?: boolean;
  score?: string;
  homeAway?: string;
  team: EspnTeam;
};

type EspnCompetition = {
  date: string;
  notes?: Array<{ headline?: string }>;
  competitors: EspnCompetitor[];
  status?: {
    type?: {
      completed?: boolean;
      state?: string;
      detail?: string;
      shortDetail?: string;
    };
  };
};

type EspnEvent = {
  id: string;
  competitions?: EspnCompetition[];
};

type TeamLookupRecord = {
  id: number;
  assignedNumber: number;
  name: string;
  slotLabel: string;
  espnTeamId: string | null;
};

function formatDateKey(value: Date) {
  const year = value.getUTCFullYear();
  const month = `${value.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${value.getUTCDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

function addDays(value: Date, days: number) {
  const copy = new Date(value);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function buildDateRange(startKey: string, endKey: string) {
  const start = new Date(
    Date.UTC(Number(startKey.slice(0, 4)), Number(startKey.slice(4, 6)) - 1, Number(startKey.slice(6, 8))),
  );
  const end = new Date(
    Date.UTC(Number(endKey.slice(0, 4)), Number(endKey.slice(4, 6)) - 1, Number(endKey.slice(6, 8))),
  );
  const values: string[] = [];

  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    values.push(formatDateKey(cursor));
  }

  return values;
}

export function parseRoundFromHeadline(headline: string) {
  const normalized = headline.toLowerCase();

  if (normalized.includes("first four")) {
    return 0;
  }
  if (normalized.includes("1st round") || normalized.includes("first round")) {
    return 1;
  }
  if (normalized.includes("2nd round") || normalized.includes("second round")) {
    return 2;
  }
  if (normalized.includes("sweet 16") || normalized.includes("regional semifinal")) {
    return 3;
  }
  if (normalized.includes("elite eight") || normalized.includes("regional final")) {
    return 4;
  }
  if (normalized.includes("final four") || normalized.includes("national semifinal")) {
    return 5;
  }
  if (normalized.includes("championship")) {
    return 6;
  }

  return null;
}

export type LiveGameState = {
  gameId: string;
  state: "in_progress" | "scheduled";
  opponentName: string;
  detail: string | null;
  teamScore: number | null;
  opponentScore: number | null;
};

export type LiveGameStatus = "available" | "unavailable";

export type LiveGameLookup = {
  status: LiveGameStatus;
  map: Map<number, LiveGameState>;
};

function buildLookupRecords(teamRows: TeamLookupRecord[]) {
  const byEspnId = new Map<string, TeamLookupRecord>();
  const byNormalizedName = new Map<string, TeamLookupRecord>();

  for (const teamRow of teamRows) {
    if (teamRow.espnTeamId) {
      byEspnId.set(teamRow.espnTeamId, teamRow);
    }

    for (const candidate of [
      teamRow.name,
      teamRow.slotLabel,
      ...getAliasesForAssignedNumber(teamRow.assignedNumber),
    ]) {
      byNormalizedName.set(normalizeTeamName(candidate), teamRow);
    }
  }

  return {
    byEspnId,
    byNormalizedName,
  };
}

function getEspnNameCandidates(team: EspnTeam) {
  return [team.shortDisplayName, team.location, team.displayName]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
}

async function resolveEspnTeam(team: EspnTeam, teamRows: TeamLookupRecord[]) {
  const db = getDb();
  const lookup = buildLookupRecords(teamRows);

  if (lookup.byEspnId.has(team.id)) {
    return lookup.byEspnId.get(team.id)!;
  }

  for (const candidate of getEspnNameCandidates(team)) {
    const matched = lookup.byNormalizedName.get(normalizeTeamName(candidate));
    if (!matched) {
      continue;
    }

    if (matched.espnTeamId !== team.id) {
      await db
        .update(teams)
        .set({
          espnTeamId: team.id,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, matched.id));

      matched.espnTeamId = team.id;
    }

    return matched;
  }

  throw new Error(
    `Could not resolve ESPN team ${JSON.stringify(getEspnNameCandidates(team))} (id ${team.id}).`,
  );
}

async function tryResolveEspnTeam(team: EspnTeam, teamRows: TeamLookupRecord[]) {
  try {
    return await resolveEspnTeam(team, teamRows);
  } catch {
    return null;
  }
}

function parseScoreValue(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function fetchTournamentGames(dateKey?: string) {
  const url = new URL(SCOREBOARD_ENDPOINT);
  url.searchParams.set("groups", "100");

  if (dateKey) {
    url.searchParams.set("dates", dateKey);
  }

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`ESPN scoreboard request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as { events?: EspnEvent[] };
  return payload.events ?? [];
}

export async function getLiveGameData(): Promise<LiveGameLookup> {
  const db = getDb();
  const teamRows = await db
    .select({
      id: teams.id,
      assignedNumber: teams.assignedNumber,
      name: teams.name,
      slotLabel: teams.slotLabel,
      espnTeamId: teams.espnTeamId,
    })
    .from(teams);

  const liveMap = new Map<number, LiveGameState>();

  try {
    for (const dateKey of getDatesForSync("incremental")) {
      const events = await fetchTournamentGames(dateKey);

      for (const event of events) {
        const competition = event.competitions?.[0];
        const state = competition?.status?.type?.state;

        if (!competition || (state !== "in" && state !== "pre")) {
          continue;
        }

        const [leftCompetitor, rightCompetitor] = competition.competitors ?? [];
        if (!leftCompetitor || !rightCompetitor) {
          continue;
        }

        const leftTeam = await tryResolveEspnTeam(leftCompetitor.team, teamRows);
        const rightTeam = await tryResolveEspnTeam(rightCompetitor.team, teamRows);

        if (!leftTeam || !rightTeam) {
          continue;
        }

        const gameState = state === "in" ? "in_progress" : "scheduled";
        const detail =
          competition.status?.type?.shortDetail?.trim() ||
          competition.status?.type?.detail?.trim() ||
          null;

        liveMap.set(leftTeam.id, {
          gameId: event.id,
          state: gameState,
          opponentName: rightTeam.name,
          detail,
          teamScore: parseScoreValue(leftCompetitor.score),
          opponentScore: parseScoreValue(rightCompetitor.score),
        });

        liveMap.set(rightTeam.id, {
          gameId: event.id,
          state: gameState,
          opponentName: leftTeam.name,
          detail,
          teamScore: parseScoreValue(rightCompetitor.score),
          opponentScore: parseScoreValue(leftCompetitor.score),
        });
      }
    }
  } catch (error) {
    console.error("Could not fetch live game state from ESPN.", error);
    return {
      status: "unavailable",
      map: new Map<number, LiveGameState>(),
    };
  }

  return {
    status: "available",
    map: liveMap,
  };
}

function getDatesForSync(mode: SyncMode, now = new Date()) {
  if (mode === "backfill") {
    return buildDateRange(
      TOURNAMENT_CONFIG.syncStartDate,
      TOURNAMENT_CONFIG.syncEndDate,
    );
  }

  const dates = new Set<string>();
  for (
    let offset = -TOURNAMENT_CONFIG.syncLookbackDays;
    offset <= TOURNAMENT_CONFIG.syncLookaheadDays;
    offset += 1
  ) {
    dates.add(formatDateKey(addDays(now, offset)));
  }

  return [...dates].sort();
}

export async function runTournamentSync(
  mode: SyncMode = "incremental",
  options: { revalidate?: boolean } = {},
) {
  const db = getDb();
  const sql = getNeonSql();
  const lockRows = (await sql`
    select pg_try_advisory_lock(${SYNC_LOCK_ID}) as locked
  `) as Array<{ locked: boolean }>;
  const locked = Boolean(lockRows[0]?.locked);

  if (!locked) {
    return {
      mode,
      dates: [] as string[],
      gamesSeen: 0,
      completedGames: 0,
      insertedGames: 0,
      skipped: "A sync run is already in progress.",
    };
  }

  try {
    const teamRows = await db
      .select({
        id: teams.id,
        assignedNumber: teams.assignedNumber,
        name: teams.name,
        slotLabel: teams.slotLabel,
        espnTeamId: teams.espnTeamId,
      })
      .from(teams);

    const dates = getDatesForSync(mode);
    let gamesSeen = 0;
    let completedGames = 0;
    let insertedGames = 0;

    for (const dateKey of dates) {
      const events = await fetchTournamentGames(dateKey);
      gamesSeen += events.length;

      for (const event of events) {
        const competition = event.competitions?.[0];
        if (!competition?.status?.type?.completed) {
          continue;
        }

        completedGames += 1;

        const roundHeadline = competition.notes?.[0]?.headline ?? "";
        const round = parseRoundFromHeadline(roundHeadline);
        if (round === null || round === 0) {
          continue;
        }

        const winner = competition.competitors.find((competitor) => competitor.winner);
        const loser = competition.competitors.find((competitor) => !competitor.winner);

        if (!winner || !loser) {
          continue;
        }

        const winnerRecord = await resolveEspnTeam(winner.team, teamRows);
        const loserRecord = await resolveEspnTeam(loser.team, teamRows);

        const inserted = await db
          .insert(gameResults)
          .values({
            espnGameId: event.id,
            round,
            winnerEspnTeamId: winner.team.id,
            loserEspnTeamId: loser.team.id,
            winnerTeamName: winnerRecord.name,
            loserTeamName: loserRecord.name,
            isChampionship: round === 6,
            playedAt: new Date(competition.date),
            fetchedAt: new Date(),
          })
          .onConflictDoNothing()
          .returning({ id: gameResults.id });

        insertedGames += inserted.length;
      }
    }

    if (options.revalidate !== false) {
      revalidatePath("/");
      revalidatePath("/admin");
    }

    return {
      mode,
      dates,
      gamesSeen,
      completedGames,
      insertedGames,
    };
  } finally {
    await sql`select pg_advisory_unlock(${SYNC_LOCK_ID})`;
  }
}
