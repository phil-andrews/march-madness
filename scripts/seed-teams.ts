import { getDb, teams } from "@/lib/db";
import { TEAMS_2026 } from "@/lib/pick10/teams-2026";

async function main() {
  const db = getDb();

  for (const team of TEAMS_2026) {
    await db
      .insert(teams)
      .values({
        assignedNumber: team.assignedNumber,
        name: team.name,
        seed: team.seed,
        slotLabel: team.slotLabel ?? team.name,
        isFirstFourSlot: team.isFirstFourSlot ?? false,
        firstFourOpponent: team.firstFourOpponent ?? null,
      })
      .onConflictDoUpdate({
        target: teams.assignedNumber,
        set: {
          name: team.name,
          seed: team.seed,
          slotLabel: team.slotLabel ?? team.name,
          isFirstFourSlot: team.isFirstFourSlot ?? false,
          firstFourOpponent: team.firstFourOpponent ?? null,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`Seeded ${TEAMS_2026.length} tournament slots.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
