import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  check,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export function buildDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    PGSSLMODE,
    PGCHANNELBINDING,
  } = process.env;

  if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
    throw new Error(
      "Database connection is not configured. Set DATABASE_URL or PGHOST/PGDATABASE/PGUSER/PGPASSWORD.",
    );
  }

  const url = new URL(
    `postgresql://${encodeURIComponent(PGUSER)}:${encodeURIComponent(
      PGPASSWORD,
    )}@${PGHOST}/${encodeURIComponent(PGDATABASE)}`,
  );

  if (PGSSLMODE) {
    url.searchParams.set("sslmode", PGSSLMODE);
  }

  if (PGCHANNELBINDING) {
    url.searchParams.set("channel_binding", PGCHANNELBINDING);
  }

  return url.toString();
}

export const teams = pgTable("teams", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  assignedNumber: integer("assigned_number").notNull().unique(),
  name: text().notNull(),
  seed: integer().notNull(),
  espnTeamId: text("espn_team_id").unique(),
  slotLabel: text("slot_label").notNull(),
  isFirstFourSlot: boolean("is_first_four_slot").notNull().default(false),
  firstFourOpponent: text("first_four_opponent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const entries = pgTable("entries", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  source: text().notNull().default("admin"),
  notes: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const entryTeams = pgTable(
  "entry_teams",
  {
    entryId: uuid("entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "restrict" }),
    position: smallint().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.entryId, table.teamId] }),
    check("entry_teams_position_check", sql`${table.position} between 1 and 10`),
  ],
);

export const gameResults = pgTable("game_results", {
  id: bigserial({ mode: "number" }).primaryKey(),
  espnGameId: text("espn_game_id").notNull().unique(),
  round: integer().notNull(),
  winnerEspnTeamId: text("winner_espn_team_id").notNull(),
  loserEspnTeamId: text("loser_espn_team_id").notNull(),
  winnerTeamName: text("winner_team_name").notNull(),
  loserTeamName: text("loser_team_name").notNull(),
  isChampionship: boolean("is_championship").notNull().default(false),
  playedAt: timestamp("played_at", { withTimezone: true }).notNull(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
});

export const syncStatus = pgTable("sync_status", {
  key: text().primaryKey(),
  lastSuccessfulSyncAt: timestamp("last_successful_sync_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

let cachedSql: ReturnType<typeof neon> | undefined;
let cachedDb: ReturnType<typeof drizzle> | undefined;

export function getNeonSql() {
  cachedSql ??= neon(buildDatabaseUrl());
  return cachedSql;
}

export function getDb() {
  cachedDb ??= drizzle({
    client: getNeonSql(),
    schema: {
      teams,
      entries,
      entryTeams,
      gameResults,
      syncStatus,
    },
  });

  return cachedDb;
}

export type TeamRow = typeof teams.$inferSelect;
export type EntryRow = typeof entries.$inferSelect;
export type EntryTeamRow = typeof entryTeams.$inferSelect;
export type GameResultRow = typeof gameResults.$inferSelect;
export type SyncStatusRow = typeof syncStatus.$inferSelect;
