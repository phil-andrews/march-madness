export const TOURNAMENT_CONFIG = {
  title: "march madness w/ the boys",
  subtitle: "Seed-times-wins scoring, plus champion and runner-up bonuses.",
  year: 2026,
  scoringStartDate: "20260319",
  syncStartDate: "20260317",
  syncEndDate: "20260407",
  syncStatusKey: "tournament_results",
  maxTournamentWins: 6,
  entrySize: 10,
  syncLookbackDays: 1,
  syncLookaheadDays: 1,
} as const;

export type SyncMode = "incremental" | "backfill";
