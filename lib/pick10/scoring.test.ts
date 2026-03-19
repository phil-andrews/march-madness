import { describe, expect, it } from "vitest";
import { parseRoundFromHeadline } from "./espn";
import { calcScore, getRemainingPossibleWins, matchesResolvedTeam } from "./scoring";

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
