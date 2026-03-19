import { asc, eq } from "drizzle-orm";
import { entries, entryTeams, gameResults, getDb, teams } from "@/lib/db";
import { TOURNAMENT_CONFIG } from "@/lib/pick10/config";
import { getLiveGameMap, type LiveGameState } from "@/lib/pick10/espn";

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
  displayRank: number;
  teams: TeamBreakdown[];
};

export type LeaderboardSnapshot = {
  entries: EntryLeaderboardRow[];
  completedGames: number;
  lastSyncedAt: Date | null;
  teamsSeeded: number;
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
  const liveGameMap = await getLiveGameMap();
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
      liveGame: liveGameMap.get(row.teamId) ?? null,
    });

    currentEntry.totalPoints += points;
    currentEntry.projectedMax += projectedMax;
    currentEntry.aliveTeamCount += isAlive ? 1 : 0;
  }

  const rankedEntries = [...groupedEntries.values()]
    .map((entry) => ({
      ...entry,
      teams: entry.teams.sort((left, right) => left.position - right.position),
    }))
    .sort((left, right) => {
      if (right.totalPoints !== left.totalPoints) {
        return right.totalPoints - left.totalPoints;
      }

      if (right.projectedMax !== left.projectedMax) {
        return right.projectedMax - left.projectedMax;
      }

      return left.name.localeCompare(right.name);
    });

  for (const [index, entry] of rankedEntries.entries()) {
    const previous = rankedEntries[index - 1];
    entry.displayRank =
      previous && previous.totalPoints === entry.totalPoints ? previous.displayRank : index + 1;
  }

  return {
    entries: rankedEntries,
    completedGames: results.length,
    lastSyncedAt:
      results.length > 0
        ? results.reduce<Date>(
            (latest, result) => (result.fetchedAt > latest ? result.fetchedAt : latest),
            results[0].fetchedAt,
          )
        : null,
    teamsSeeded: teamRows.length,
  };
}

export async function getEntryDetail(entryId: string) {
  const snapshot = await getLeaderboardSnapshot();
  return snapshot.entries.find((entry) => entry.id === entryId) ?? null;
}
