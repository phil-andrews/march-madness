import { describe, expect, it } from "vitest";
import { parseRoundFromHeadline } from "./espn";
import {
  assignDisplayRanks,
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
