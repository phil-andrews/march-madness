import { eq } from "drizzle-orm";
import { entries, getDb, getNeonSql, teams } from "@/lib/db";
import { TOURNAMENT_CONFIG } from "@/lib/pick10/config";
import { getAliasesForAssignedNumber, normalizeTeamName } from "@/lib/pick10/team-aliases";
import { resolveSeedRecord } from "@/lib/pick10/team-aliases";
import { z } from "zod";

export type TeamReference = {
  id: number;
  assignedNumber: number;
  name: string;
  slotLabel: string;
};

export type ParsedEntry = {
  name: string;
  assignedNumbers: number[];
};

const jsonEntrySchema = z.object({
  name: z.string().trim().min(1),
  picks: z.array(z.union([z.string(), z.number()])),
});

function tokenizePickLine(value: string) {
  const cleaned = value.replace(/^\s*(?:[-*]|\d+[.)-]?)\s*/, "").trim();
  if (!cleaned) {
    return [];
  }

  if (cleaned.includes(",") || cleaned.includes(";")) {
    return cleaned
      .split(/[;,]/)
      .map((token) => token.trim())
      .filter(Boolean);
  }

  return [cleaned];
}

function validateAssignedNumbers(assignedNumbers: number[]) {
  if (assignedNumbers.length !== TOURNAMENT_CONFIG.entrySize) {
    throw new Error(
      `Each entry must contain exactly ${TOURNAMENT_CONFIG.entrySize} picks. Received ${assignedNumbers.length}.`,
    );
  }

  if (new Set(assignedNumbers).size !== TOURNAMENT_CONFIG.entrySize) {
    throw new Error("Each entry must contain 10 distinct picks.");
  }
}

export function normalizeAssignedNumbers(assignedNumbers: number[]) {
  validateAssignedNumbers(assignedNumbers);
  return [...assignedNumbers].sort((left, right) => left - right);
}

function resolveAssignedNumber(
  rawValue: string | number,
  teamLookup: Map<string, TeamReference>,
) {
  if (typeof rawValue === "number") {
    return rawValue;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    throw new Error("Encountered an empty pick.");
  }

  const numericMatch = trimmed.match(/^#?(\d{1,2})\b/);
  if (numericMatch) {
    return Number(numericMatch[1]);
  }

  const matchedTeam = teamLookup.get(normalizeTeamName(trimmed));
  if (!matchedTeam) {
    throw new Error(`Could not resolve pick "${trimmed}" to an assigned slot.`);
  }

  return matchedTeam.assignedNumber;
}

function normalizeParsedEntry(
  name: string,
  rawPicks: Array<string | number>,
  teamLookup: Map<string, TeamReference>,
) {
  return {
    name: name.trim(),
    assignedNumbers: normalizeAssignedNumbers(
      rawPicks.map((pick) => resolveAssignedNumber(pick, teamLookup)),
    ),
  };
}

function parseJsonEntries(payload: string, teamLookup: Map<string, TeamReference>) {
  const parsed = JSON.parse(payload);
  const values = Array.isArray(parsed) ? parsed : parsed.entries;

  if (!Array.isArray(values)) {
    throw new Error("JSON imports must be an array or an object with an entries array.");
  }

  return values.map((value) => {
    const entry = jsonEntrySchema.parse(value);
    return normalizeParsedEntry(entry.name, entry.picks, teamLookup);
  });
}

function parseTextEntries(payload: string, teamLookup: Map<string, TeamReference>) {
  const blocks = payload
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      throw new Error(
        `Could not parse entry block "${block}". Each block needs a name and 10 picks.`,
      );
    }

    const [firstLine, ...remainingLines] = lines;
    let name = firstLine;
    const rawPicks: Array<string | number> = [];

    const headerMatch = firstLine.match(/^([^:]+):\s*(.*)$/);
    if (headerMatch) {
      name = headerMatch[1].trim();
      if (headerMatch[2].trim()) {
        rawPicks.push(...tokenizePickLine(headerMatch[2]));
      }
    }

    for (const line of remainingLines) {
      rawPicks.push(...tokenizePickLine(line));
    }

    return normalizeParsedEntry(name, rawPicks, teamLookup);
  });
}

export async function getTeamReferences() {
  const db = getDb();
  return db
    .select({
      id: teams.id,
      assignedNumber: teams.assignedNumber,
      name: teams.name,
      slotLabel: teams.slotLabel,
    })
    .from(teams);
}

export function buildTeamLookup(teamReferences: TeamReference[]) {
  const lookup = new Map<string, TeamReference>();

  for (const teamReference of teamReferences) {
    lookup.set(String(teamReference.assignedNumber), teamReference);
    lookup.set(normalizeTeamName(teamReference.name), teamReference);
    lookup.set(normalizeTeamName(teamReference.slotLabel), teamReference);

    for (const alias of getAliasesForAssignedNumber(teamReference.assignedNumber)) {
      lookup.set(normalizeTeamName(alias), teamReference);
    }
  }

  return lookup;
}

export async function parseBulkImportText(payload: string) {
  const teamReferences = await getTeamReferences();
  const teamLookup = buildTeamLookup(teamReferences);
  const trimmed = payload.trim();

  if (!trimmed) {
    throw new Error("Import payload is empty.");
  }

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    return parseJsonEntries(trimmed, teamLookup);
  }

  return parseTextEntries(trimmed, teamLookup);
}

export async function parseManualEntry(name: string, picksText: string) {
  const teamReferences = await getTeamReferences();
  const teamLookup = buildTeamLookup(teamReferences);
  const rawPicks = picksText
    .split("\n")
    .flatMap((line) => tokenizePickLine(line))
    .filter(Boolean);

  return normalizeParsedEntry(name, rawPicks, teamLookup);
}

export async function saveEntry(
  entry: ParsedEntry,
  options: { entryId?: string; notes?: string } = {},
) {
  const assignedNumbers = normalizeAssignedNumbers(entry.assignedNumbers);

  const db = getDb();
  const sql = getNeonSql();
  const teamReferences = await getTeamReferences();
  const teamIdByAssignedNumber = new Map(
    teamReferences.map((teamReference) => [teamReference.assignedNumber, teamReference.id]),
  );

  for (const assignedNumber of assignedNumbers) {
    if (!teamIdByAssignedNumber.has(assignedNumber)) {
      const fallback = resolveSeedRecord(assignedNumber);
      throw new Error(
        `Assigned slot ${assignedNumber} (${fallback?.name ?? "unknown"}) is not seeded in the database yet.`,
      );
    }
  }

  const matchedEntries = options.entryId
    ? await db.select({ id: entries.id }).from(entries).where(eq(entries.id, options.entryId))
    : await db.select({ id: entries.id }).from(entries).where(eq(entries.name, entry.name));

  if (!options.entryId && matchedEntries.length > 1) {
    throw new Error(
      `There are multiple entries named "${entry.name}". Edit by ID from the admin table instead.`,
    );
  }

  const entryId = matchedEntries[0]?.id ?? crypto.randomUUID();
  const writes = [];

  if (matchedEntries.length === 0) {
    writes.push(
      sql`
        insert into entries (id, name, source, notes)
        values (${entryId}, ${entry.name}, 'admin', ${options.notes ?? null})
      `,
    );
  } else {
    writes.push(
      sql`
        update entries
        set name = ${entry.name},
            source = 'admin',
            notes = ${options.notes ?? null},
            updated_at = now()
        where id = ${entryId}
      `,
    );
  }

  writes.push(sql`delete from entry_teams where entry_id = ${entryId}`);

  assignedNumbers.forEach((assignedNumber, index) => {
    writes.push(
      sql`
        insert into entry_teams (entry_id, team_id, position)
        values (${entryId}, ${teamIdByAssignedNumber.get(assignedNumber)!}, ${index + 1})
      `,
    );
  });

  await sql.transaction(writes);

  return {
    entryId,
    created: matchedEntries.length === 0,
  };
}

export async function importEntriesFromText(payload: string) {
  const parsedEntries = await parseBulkImportText(payload);
  let createdCount = 0;
  let updatedCount = 0;

  for (const entry of parsedEntries) {
    const result = await saveEntry(entry);
    if (result.created) {
      createdCount += 1;
    } else {
      updatedCount += 1;
    }
  }

  return {
    totalCount: parsedEntries.length,
    createdCount,
    updatedCount,
  };
}
