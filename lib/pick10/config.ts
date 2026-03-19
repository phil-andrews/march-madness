export const TOURNAMENT_CONFIG = {
  title: "Pick-10 March Madness Tracker",
  subtitle: "Seed-times-wins scoring, plus champion and runner-up bonuses.",
  year: 2026,
  scoringStartDate: "20260319",
  syncStartDate: "20260317",
  syncEndDate: "20260407",
  maxTournamentWins: 6,
  entrySize: 10,
  syncLookbackDays: 1,
  syncLookaheadDays: 1,
} as const;

export type SyncMode = "incremental" | "backfill";
