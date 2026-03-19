import {
  TEAMS_2026,
  TEAMS_2026_BY_ASSIGNED_NUMBER,
  type TeamSeedRecord,
} from "@/lib/pick10/teams-2026";

export function normalizeTeamName(value: string) {
  return value
    .toLowerCase()
    .replace(/\ba\s*&\s*m\b/g, "am")
    .replace(/&/g, " ")
    .replace(/saint/g, "st")
    .replace(/['’.]/g, "")
    .replace(/[()/,-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getAliasesForAssignedNumber(assignedNumber: number) {
  return TEAMS_2026_BY_ASSIGNED_NUMBER.get(assignedNumber)?.aliases ?? [];
}

export function getCandidateNames(seedRecord: TeamSeedRecord) {
  return [seedRecord.name, seedRecord.slotLabel ?? seedRecord.name, ...(seedRecord.aliases ?? [])];
}

export function buildSeedLookup() {
  const lookup = new Map<string, TeamSeedRecord>();

  for (const seedRecord of TEAMS_2026) {
    lookup.set(String(seedRecord.assignedNumber), seedRecord);

    for (const candidate of getCandidateNames(seedRecord)) {
      lookup.set(normalizeTeamName(candidate), seedRecord);
    }
  }

  return lookup;
}

export function resolveSeedRecord(value: string | number) {
  const lookup = buildSeedLookup();
  return lookup.get(String(value)) ?? lookup.get(normalizeTeamName(String(value))) ?? null;
}
