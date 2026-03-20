import { asc, eq } from "drizzle-orm";
import { entries, entryTeams, gameResults, getDb, syncStatus, teams } from "@/lib/db";
import { TOURNAMENT_CONFIG } from "@/lib/pick10/config";
import {
  getLiveGameData,
  type LiveGameState,
  type LiveGameStatus,
} from "@/lib/pick10/espn";

export type TeamBreakdown = {
  assignedNumber: number;
  position: number;
  name: string;
  slotLabel: string;
  seed: number;
  espnTeamId: string | null;
  wins: number;
  points: number;
  projectedMax: number;
  remainingPossibleWins: number;
  isChampion: boolean;
  isRunnerUp: boolean;
  isAlive: boolean;
  liveGame: LiveGameState | null;
};

export type EntryLeaderboardRow = {
  id: string;
  name: string;
  notes: string | null;
  totalPoints: number;
  projectedMax: number;
  aliveTeamCount: number;
  hasLiveGame: boolean;
  displayRank: number;
  teams: TeamBreakdown[];
};

export type LiveGameEntryImpact = {
  id: string;
  name: string;
  displayRank: number;
};

export type LiveGameSummary = {
  gameId: string;
  trackedTeamName: string;
  opponentName: string;
  teamScore: number | null;
  opponentScore: number | null;
  detail: string | null;
  impactedEntries: LiveGameEntryImpact[];
};

export type EntryDetailView = EntryLeaderboardRow & {
  totalEntries: number;
  tiedEntryCount: number;
  lastSyncedAt: Date | null;
  liveDataStatus: LiveGameStatus;
  liveTeamCount: number;
  eliminatedTeamCount: number;
  upcomingTeamCount: number;
  liveTeams: TeamBreakdown[];
  aliveTeams: TeamBreakdown[];
  eliminatedTeams: TeamBreakdown[];
};

export type LeaderboardSnapshot = {
  entries: EntryLeaderboardRow[];
  completedGames: number;
  lastSyncedAt: Date | null;
  teamsSeeded: number;
  liveGames: LiveGameSummary[];
  liveDataStatus: LiveGameStatus;
};

export function calcScore(
  seed: number,
  wins: number,
  isChampion: boolean,
  isRunnerUp: boolean,
) {
  return seed * wins + (isChampion ? 20 : 0) + (isRunnerUp ? 10 : 0);
}

export function getRemainingPossibleWins(wins: number, isAlive: boolean) {
  if (!isAlive) {
    return 0;
  }

  return Math.max(0, TOURNAMENT_CONFIG.maxTournamentWins - wins);
}

export function matchesResolvedTeam(teamId: string | null, resolvedTeamId: string | null) {
  return teamId !== null && resolvedTeamId !== null && teamId === resolvedTeamId;
}

export function getSnapshotLastSyncedAt(
  lastSuccessfulSyncAt: Date | null,
  results: Array<Pick<typeof gameResults.$inferSelect, "fetchedAt">>,
) {
  if (lastSuccessfulSyncAt) {
    return lastSuccessfulSyncAt;
  }

  if (results.length === 0) {
    return null;
  }

  return results.reduce<Date>(
    (latest, result) => (result.fetchedAt > latest ? result.fetchedAt : latest),
    results[0].fetchedAt,
  );
}

export function compareLeaderboardEntries(
  left: Pick<EntryLeaderboardRow, "name" | "totalPoints" | "projectedMax">,
  right: Pick<EntryLeaderboardRow, "name" | "totalPoints" | "projectedMax">,
) {
  if (right.totalPoints !== left.totalPoints) {
    return right.totalPoints - left.totalPoints;
  }

  if (right.projectedMax !== left.projectedMax) {
    return right.projectedMax - left.projectedMax;
  }

  return left.name.localeCompare(right.name);
}

export function assignDisplayRanks<T extends Pick<EntryLeaderboardRow, "totalPoints" | "displayRank">>(
  entries: T[],
) {
  let previousPoints: number | null = null;
  let previousRank = 0;

  return entries.map((entry, index) => {
    const displayRank = previousPoints === entry.totalPoints ? previousRank : index + 1;

    previousPoints = entry.totalPoints;
    previousRank = displayRank;

    return {
      ...entry,
      displayRank,
    };
  });
}

function buildResultMaps(results: Array<typeof gameResults.$inferSelect>) {
  const winsByTeamId = new Map<string, number>();
  const losers = new Set<string>();
  let championTeamId: string | null = null;
  let runnerUpTeamId: string | null = null;

  for (const result of results) {
    winsByTeamId.set(
      result.winnerEspnTeamId,
      (winsByTeamId.get(result.winnerEspnTeamId) ?? 0) + 1,
    );
    losers.add(result.loserEspnTeamId);

    if (result.isChampionship) {
      championTeamId = result.winnerEspnTeamId;
      runnerUpTeamId = result.loserEspnTeamId;
    }
  }

  return {
    winsByTeamId,
    losers,
    championTeamId,
    runnerUpTeamId,
  };
}

function buildLiveGames(entries: EntryLeaderboardRow[]) {
  const liveGames = new Map<string, LiveGameSummary>();

  for (const entry of entries) {
    for (const team of entry.teams) {
      if (team.liveGame?.state !== "in_progress") {
        continue;
      }

      let game = liveGames.get(team.liveGame.gameId);

      if (!game) {
        game = {
          gameId: team.liveGame.gameId,
          trackedTeamName: team.name,
          opponentName: team.liveGame.opponentName,
          teamScore: team.liveGame.teamScore,
          opponentScore: team.liveGame.opponentScore,
          detail: team.liveGame.detail,
          impactedEntries: [],
        };
        liveGames.set(team.liveGame.gameId, game);
      }

      if (!game.impactedEntries.some((currentImpact) => currentImpact.id === entry.id)) {
        game.impactedEntries.push({
          id: entry.id,
          name: entry.name,
          displayRank: entry.displayRank,
        });
      }
    }
  }

  return [...liveGames.values()].sort((left, right) => {
    const leftRank = left.impactedEntries[0]?.displayRank ?? Number.MAX_SAFE_INTEGER;
    const rightRank = right.impactedEntries[0]?.displayRank ?? Number.MAX_SAFE_INTEGER;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return left.trackedTeamName.localeCompare(right.trackedTeamName);
  });
}

export function buildEntryDetailView(
  entryId: string,
  snapshot: LeaderboardSnapshot,
): EntryDetailView | null {
  const entry = snapshot.entries.find((currentEntry) => currentEntry.id === entryId);

  if (!entry) {
    return null;
  }

  const liveTeams = entry.teams.filter((team) => team.liveGame?.state === "in_progress");
  const aliveTeams = entry.teams.filter(
    (team) => team.isAlive && team.liveGame?.state !== "in_progress",
  );
  const eliminatedTeams = entry.teams.filter((team) => !team.isAlive);
  const tiedEntryCount = snapshot.entries.filter(
    (currentEntry) => currentEntry.totalPoints === entry.totalPoints,
  ).length;

  return {
    ...entry,
    totalEntries: snapshot.entries.length,
    tiedEntryCount,
    lastSyncedAt: snapshot.lastSyncedAt,
    liveDataStatus: snapshot.liveDataStatus,
    liveTeamCount: liveTeams.length,
    eliminatedTeamCount: eliminatedTeams.length,
    upcomingTeamCount: entry.teams.filter((team) => team.liveGame?.state === "scheduled").length,
    liveTeams,
    aliveTeams,
    eliminatedTeams,
  };
}

export async function getLeaderboardSnapshot(): Promise<LeaderboardSnapshot> {
  const db = getDb();

  const teamRows = await db
    .select({
      id: teams.id,
      assignedNumber: teams.assignedNumber,
    })
    .from(teams)
    .orderBy(asc(teams.assignedNumber));

  const entryRows = await db
    .select({
      entryId: entries.id,
      entryName: entries.name,
      entryNotes: entries.notes,
      position: entryTeams.position,
      teamId: teams.id,
      assignedNumber: teams.assignedNumber,
      teamName: teams.name,
      slotLabel: teams.slotLabel,
      seed: teams.seed,
      espnTeamId: teams.espnTeamId,
    })
    .from(entries)
    .leftJoin(entryTeams, eq(entries.id, entryTeams.entryId))
    .leftJoin(teams, eq(entryTeams.teamId, teams.id))
    .orderBy(asc(entries.createdAt), asc(entries.name), asc(entryTeams.position));

  const results = await db.select().from(gameResults).orderBy(asc(gameResults.playedAt));
  const [syncStatusRow] = await db
    .select({
      lastSuccessfulSyncAt: syncStatus.lastSuccessfulSyncAt,
    })
    .from(syncStatus)
    .where(eq(syncStatus.key, TOURNAMENT_CONFIG.syncStatusKey))
    .limit(1);
  const liveGameData = await getLiveGameData();
  const resultMaps = buildResultMaps(results);
  const groupedEntries = new Map<string, EntryLeaderboardRow>();

  for (const row of entryRows) {
    let currentEntry = groupedEntries.get(row.entryId);

    if (!currentEntry) {
      currentEntry = {
        id: row.entryId,
        name: row.entryName,
        notes: row.entryNotes,
        totalPoints: 0,
        projectedMax: 0,
        aliveTeamCount: 0,
        hasLiveGame: false,
        displayRank: 0,
        teams: [],
      };
      groupedEntries.set(row.entryId, currentEntry);
    }

    if (!row.teamId || !row.assignedNumber || !row.teamName || !row.seed || !row.position) {
      continue;
    }

    const wins = row.espnTeamId ? resultMaps.winsByTeamId.get(row.espnTeamId) ?? 0 : 0;
    const isChampion = matchesResolvedTeam(row.espnTeamId, resultMaps.championTeamId);
    const isRunnerUp = matchesResolvedTeam(row.espnTeamId, resultMaps.runnerUpTeamId);
    const isAlive = row.espnTeamId ? !resultMaps.losers.has(row.espnTeamId) : true;
    const points = calcScore(row.seed, wins, isChampion, isRunnerUp);
    const remainingPossibleWins = getRemainingPossibleWins(wins, isAlive);
    const projectedMax = points + row.seed * remainingPossibleWins;
    const liveGame = liveGameData.map.get(row.teamId) ?? null;

    currentEntry.teams.push({
      assignedNumber: row.assignedNumber,
      position: row.position,
      name: row.teamName,
      slotLabel: row.slotLabel ?? row.teamName,
      seed: row.seed,
      espnTeamId: row.espnTeamId,
      wins,
      points,
      projectedMax,
      remainingPossibleWins,
      isChampion,
      isRunnerUp,
      isAlive,
      liveGame,
    });

    currentEntry.totalPoints += points;
    currentEntry.projectedMax += projectedMax;
    currentEntry.aliveTeamCount += isAlive ? 1 : 0;
    currentEntry.hasLiveGame ||= liveGame?.state === "in_progress";
  }

  const sortedEntries = [...groupedEntries.values()]
    .map((entry) => ({
      ...entry,
      teams: entry.teams.sort((left, right) => left.position - right.position),
    }))
    .sort(compareLeaderboardEntries);

  const rankedEntries = assignDisplayRanks(sortedEntries);
  const liveGames = buildLiveGames(rankedEntries);

  return {
    entries: rankedEntries,
    completedGames: results.length,
    lastSyncedAt: getSnapshotLastSyncedAt(syncStatusRow?.lastSuccessfulSyncAt ?? null, results),
    teamsSeeded: teamRows.length,
    liveGames,
    liveDataStatus: liveGameData.status,
  };
}

export async function getEntryDetail(entryId: string) {
  const snapshot = await getLeaderboardSnapshot();
  return snapshot.entries.find((entry) => entry.id === entryId) ?? null;
}

export async function getEntryDetailView(entryId: string) {
  const snapshot = await getLeaderboardSnapshot();
  return buildEntryDetailView(entryId, snapshot);
}
