import { spawnSync } from "node:child_process";
import path from "node:path";

const migrationPath = path.join(process.cwd(), "drizzle", "0001_initial.sql");
const result = spawnSync("psql", ["-v", "ON_ERROR_STOP=1", "-f", migrationPath], {
  stdio: "inherit",
  env: process.env,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
