import { describe, expect, it } from "vitest";
import { normalizeTeamName, resolveSeedRecord } from "./team-aliases";

describe("normalizeTeamName", () => {
  it("normalizes punctuation and spacing", () => {
    expect(normalizeTeamName("St. John's")).toBe("st johns");
    expect(normalizeTeamName("Texas A&M")).toBe("texas am");
  });
});

describe("resolveSeedRecord", () => {
  it("resolves first four slot aliases", () => {
    expect(resolveSeedRecord("SMU / Miami (OH)")?.assignedNumber).toBe(44);
  });

  it("resolves common school aliases", () => {
    expect(resolveSeedRecord("North Dakota State")?.assignedNumber).toBe(54);
    expect(resolveSeedRecord("Saint Mary's")?.assignedNumber).toBe(28);
  });
});
