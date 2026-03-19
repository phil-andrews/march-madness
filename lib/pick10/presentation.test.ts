import { describe, expect, it } from "vitest";
import {
  getCompactTeamLabel,
  getCompactTeamStateToken,
  getTeamAssistiveLabel,
} from "./presentation";

describe("getCompactTeamLabel", () => {
  it("formats assigned number and team name", () => {
    expect(getCompactTeamLabel({ assignedNumber: 4, name: "Duke" })).toBe("#4 Duke");
  });
});

describe("getCompactTeamStateToken", () => {
  it("prefers live state for in-progress teams", () => {
    expect(
      getCompactTeamStateToken({
        wins: 2,
        isAlive: true,
        isChampion: false,
        isRunnerUp: false,
        liveGame: {
          gameId: "401",
          state: "in_progress",
          opponentName: "UNC",
          detail: "12:04 2H",
          teamScore: 42,
          opponentScore: 38,
        },
      }),
    ).toBe("LIVE");
  });
});

describe("getTeamAssistiveLabel", () => {
  it("includes live opponent and score context", () => {
    expect(
      getTeamAssistiveLabel({
        assignedNumber: 4,
        name: "Duke",
        seed: 1,
        wins: 2,
        isAlive: true,
        isChampion: false,
        isRunnerUp: false,
        liveGame: {
          gameId: "401",
          state: "in_progress",
          opponentName: "UNC",
          detail: "12:04 2H",
          teamScore: 42,
          opponentScore: 38,
        },
      }),
    ).toContain("Live vs UNC. 42-38 · 12:04 2H.");
  });
});
