import fs from "node:fs";
import path from "node:path";
import { importEntriesFromText } from "@/lib/pick10/import";

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    throw new Error("Usage: npm run db:import -- <path-to-import-file>");
  }

  const payload = fs.readFileSync(path.resolve(process.cwd(), fileArg), "utf8");
  const result = await importEntriesFromText(payload);
  console.log(
    `Imported ${result.totalCount} entries (${result.createdCount} created, ${result.updatedCount} updated).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
