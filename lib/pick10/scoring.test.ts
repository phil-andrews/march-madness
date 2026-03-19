import { describe, expect, it } from "vitest";
import { parseRoundFromHeadline } from "./espn";
import {
  assignDisplayRanks,
  buildEntryDetailView,
  calcScore,
  compareLeaderboardEntries,
  getRemainingPossibleWins,
  matchesResolvedTeam,
} from "./scoring";

describe("calcScore", () => {
  it("calculates base score plus champion bonus", () => {
    expect(calcScore(12, 3, true, false)).toBe(56);
  });

  it("calculates runner-up bonus without champion bonus", () => {
    expect(calcScore(5, 4, false, true)).toBe(30);
  });
});

describe("getRemainingPossibleWins", () => {
  it("returns zero for eliminated teams", () => {
    expect(getRemainingPossibleWins(2, false)).toBe(0);
  });

  it("caps the remaining wins at the tournament maximum", () => {
    expect(getRemainingPossibleWins(2, true)).toBe(4);
  });
});

describe("matchesResolvedTeam", () => {
  it("does not treat missing ids as a match", () => {
    expect(matchesResolvedTeam(null, null)).toBe(false);
  });

  it("matches when both ids are present and equal", () => {
    expect(matchesResolvedTeam("158", "158")).toBe(true);
  });
});

describe("compareLeaderboardEntries", () => {
  it("orders by points before projected max", () => {
    expect(
      compareLeaderboardEntries(
        { name: "Alpha", totalPoints: 100, projectedMax: 150 },
        { name: "Beta", totalPoints: 90, projectedMax: 500 },
      ),
    ).toBeLessThan(0);
  });

  it("orders equal-point entries by projected max", () => {
    expect(
      compareLeaderboardEntries(
        { name: "Alpha", totalPoints: 100, projectedMax: 150 },
        { name: "Beta", totalPoints: 100, projectedMax: 200 },
      ),
    ).toBeGreaterThan(0);
  });
});

describe("assignDisplayRanks", () => {
  it("shares display rank when total points match", () => {
    expect(
      assignDisplayRanks([
        { name: "Alpha", totalPoints: 120, projectedMax: 180, displayRank: 0 },
        { name: "Beta", totalPoints: 120, projectedMax: 170, displayRank: 0 },
        { name: "Gamma", totalPoints: 118, projectedMax: 160, displayRank: 0 },
      ]).map((entry) => entry.displayRank),
    ).toEqual([1, 1, 3]);
  });
});

describe("buildEntryDetailView", () => {
  it("groups teams, preserves section order, and exposes summary metadata", () => {
    const lastSyncedAt = new Date("2026-03-19T18:45:00.000Z");
    const snapshot = {
      completedGames: 12,
      lastSyncedAt,
      teamsSeeded: 64,
      liveGames: [],
      liveDataStatus: "available" as const,
      entries: [
        {
          id: "alpha",
          name: "Alpha",
          notes: "Phil",
          totalPoints: 84,
          projectedMax: 132,
          aliveTeamCount: 3,
          hasLiveGame: true,
          displayRank: 1,
          teams: [
            {
              assignedNumber: 11,
              position: 1,
              name: "Marquette",
              slotLabel: "Marquette",
              seed: 4,
              espnTeamId: "11",
              wins: 2,
              points: 8,
              projectedMax: 24,
              remainingPossibleWins: 4,
              isChampion: false,
              isRunnerUp: false,
              isAlive: true,
              liveGame: {
                gameId: "game-1",
                state: "in_progress" as const,
                opponentName: "Duke",
                detail: "2nd half - 08:11",
                teamScore: 61,
                opponentScore: 59,
              },
            },
            {
              assignedNumber: 27,
              position: 2,
              name: "Kentucky",
              slotLabel: "Kentucky",
              seed: 3,
              espnTeamId: "27",
              wins: 1,
              points: 3,
              projectedMax: 18,
              remainingPossibleWins: 5,
              isChampion: false,
              isRunnerUp: false,
              isAlive: true,
              liveGame: {
                gameId: "game-2",
                state: "scheduled" as const,
                opponentName: "Houston",
                detail: "Fri 7:10 PM",
                teamScore: null,
                opponentScore: null,
              },
            },
            {
              assignedNumber: 35,
              position: 3,
              name: "Kansas",
              slotLabel: "Kansas",
              seed: 1,
              espnTeamId: "35",
              wins: 6,
              points: 26,
              projectedMax: 26,
              remainingPossibleWins: 0,
              isChampion: true,
              isRunnerUp: false,
              isAlive: true,
              liveGame: null,
            },
            {
              assignedNumber: 52,
              position: 4,
              name: "Xavier",
              slotLabel: "Xavier",
              seed: 9,
              espnTeamId: "52",
              wins: 1,
              points: 9,
              projectedMax: 9,
              remainingPossibleWins: 0,
              isChampion: false,
              isRunnerUp: false,
              isAlive: false,
              liveGame: null,
            },
          ],
        },
        {
          id: "beta",
          name: "Beta",
          notes: null,
          totalPoints: 84,
          projectedMax: 120,
          aliveTeamCount: 2,
          hasLiveGame: false,
          displayRank: 1,
          teams: [],
        },
      ],
    };

    const detail = buildEntryDetailView("alpha", snapshot);

    expect(detail).not.toBeNull();
    expect(detail).toMatchObject({
      totalEntries: 2,
      tiedEntryCount: 2,
      lastSyncedAt,
      liveDataStatus: "available",
      liveTeamCount: 1,
      eliminatedTeamCount: 1,
      upcomingTeamCount: 1,
    });
    expect(detail?.liveTeams.map((team) => team.position)).toEqual([1]);
    expect(detail?.aliveTeams.map((team) => team.position)).toEqual([2, 3]);
    expect(detail?.eliminatedTeams.map((team) => team.position)).toEqual([4]);
  });

  it("returns null for an unknown entry id", () => {
    expect(
      buildEntryDetailView("missing", {
        completedGames: 0,
        lastSyncedAt: null,
        teamsSeeded: 0,
        liveGames: [],
        liveDataStatus: "unavailable",
        entries: [],
      }),
    ).toBeNull();
  });
});

describe("parseRoundFromHeadline", () => {
  it("parses first round", () => {
    expect(
      parseRoundFromHeadline("Men's Basketball Championship - Midwest Region - 1st Round"),
    ).toBe(1);
  });

  it("parses first four", () => {
    expect(
      parseRoundFromHeadline("Men's Basketball Championship - South Region - First Four"),
    ).toBe(0);
  });

  it("parses championship", () => {
    expect(parseRoundFromHeadline("Men's Basketball Championship - National Championship")).toBe(
      6,
    );
  });
});
