import { z } from "zod";
import { ENTRIES_2026 } from "@/2026-picks";
import { saveEntry } from "@/lib/pick10/import";

const sourceEntrySchema = z.object({
  name: z.string().trim().min(1),
  team_name: z.string().trim().min(1),
  picks: z.array(z.number().int()),
});

async function main() {
  const parsedEntries = z.array(sourceEntrySchema).parse(ENTRIES_2026);
  const seenNames = new Set<string>();
  let createdCount = 0;
  let updatedCount = 0;

  for (const rawEntry of parsedEntries) {
    const normalizedEntryName = rawEntry.team_name.trim();

    if (seenNames.has(normalizedEntryName)) {
      throw new Error(`Duplicate entry name "${normalizedEntryName}" in 2026-picks.ts.`);
    }

    seenNames.add(normalizedEntryName);

    const result = await saveEntry(
      {
        name: normalizedEntryName,
        assignedNumbers: rawEntry.picks,
      },
      {
        notes: rawEntry.name.trim(),
      },
    );

    if (result.created) {
      createdCount += 1;
    } else {
      updatedCount += 1;
    }
  }

  console.log(
    `Imported ${parsedEntries.length} 2026 entries (${createdCount} created, ${updatedCount} updated).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
