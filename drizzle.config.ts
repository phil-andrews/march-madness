import { defineConfig } from "drizzle-kit";
import { buildDatabaseUrl } from "./lib/db";

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db.ts",
  out: "./drizzle",
  dbCredentials: {
    url: buildDatabaseUrl(),
  },
});
