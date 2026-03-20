import { describe, expect, it } from "vitest";
import { normalizeAssignedNumbers } from "./import";

describe("normalizeAssignedNumbers", () => {
  it("sorts picks into official Pick-10 order", () => {
    expect(normalizeAssignedNumbers([24, 2, 43, 19, 1, 25, 10, 17, 9, 4])).toEqual([
      1, 2, 4, 9, 10, 17, 19, 24, 25, 43,
    ]);
  });

  it("rejects duplicate picks", () => {
    expect(() => normalizeAssignedNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 9])).toThrow(
      "Each entry must contain 10 distinct picks.",
    );
  });
});
