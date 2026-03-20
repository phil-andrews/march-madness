import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const migrationDir = path.join(process.cwd(), "drizzle");
const migrationFiles = fs
  .readdirSync(migrationDir)
  .filter((filename) => filename.endsWith(".sql"))
  .sort();

for (const migrationFile of migrationFiles) {
  const migrationPath = path.join(migrationDir, migrationFile);
  console.log(`Applying ${migrationFile}...`);

  const result = spawnSync("psql", ["-v", "ON_ERROR_STOP=1", "-f", migrationPath], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
