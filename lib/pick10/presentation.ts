import type { LiveGameState } from "@/lib/pick10/espn";

type TeamPresentationInput = {
  assignedNumber?: number;
  name?: string;
  seed?: number;
  wins: number;
  isAlive: boolean;
  isChampion: boolean;
  isRunnerUp: boolean;
  liveGame?: LiveGameState | null;
};

export function getTeamStatusLabel(team: TeamPresentationInput) {
  if (team.isChampion) {
    return "Champion";
  }

  if (team.liveGame?.state === "in_progress") {
    return "Live";
  }

  if (team.isRunnerUp) {
    return "Runner-up";
  }

  if (!team.isAlive) {
    return "Eliminated";
  }

  if (team.wins > 0) {
    return team.wins === 1 ? "1 win" : `${team.wins} wins`;
  }

  if (team.liveGame?.state === "scheduled") {
    return "Upcoming";
  }

  return "Awaiting tip";
}

export function getTeamBadgeClass(team: TeamPresentationInput) {
  if (team.isChampion) {
    return "border-amber-200 bg-amber-100 text-amber-800";
  }

  if (team.liveGame?.state === "in_progress") {
    return "border-yellow-200 bg-yellow-100 text-yellow-800";
  }

  if (team.isRunnerUp) {
    return "border-orange-200 bg-orange-100 text-orange-700";
  }

  if (!team.isAlive) {
    return "border-red-200 bg-red-100 text-red-700";
  }

  if (team.wins > 0) {
    return "border-emerald-200 bg-emerald-100 text-emerald-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function getCompactTeamLabel(team: Pick<TeamPresentationInput, "assignedNumber" | "name">) {
  return `#${team.assignedNumber ?? "?"} ${team.name ?? "Unknown"}`;
}

export function getCompactTeamChipClass(team: TeamPresentationInput) {
  if (team.isChampion) {
    return "border-amber-300/80 bg-amber-100/80 text-amber-900";
  }

  if (team.liveGame?.state === "in_progress") {
    return "border-yellow-300/80 bg-yellow-100/85 text-yellow-900";
  }

  if (team.isRunnerUp) {
    return "border-orange-300/80 bg-orange-100/80 text-orange-900";
  }

  if (!team.isAlive) {
    return "border-red-200/80 bg-red-50 text-red-800 opacity-60 line-through decoration-red-300";
  }

  if (team.wins > 0) {
    return "border-emerald-300/80 bg-emerald-100/75 text-emerald-900";
  }

  if (team.liveGame?.state === "scheduled") {
    return "border-slate-300 bg-slate-50 text-slate-700 border-dashed";
  }

  return "border-border/80 bg-muted/60 text-foreground";
}

export function getCompactTeamStateToken(team: TeamPresentationInput) {
  if (team.isChampion) {
    return "CH";
  }

  if (team.liveGame?.state === "in_progress") {
    return "LIVE";
  }

  if (team.isRunnerUp) {
    return "RU";
  }

  if (team.liveGame?.state === "scheduled") {
    return "UP";
  }

  return null;
}

export function getTeamLiveSummary(team: TeamPresentationInput) {
  if (team.liveGame?.state !== "in_progress") {
    return null;
  }

  const scoreText =
    team.liveGame.teamScore !== null && team.liveGame.opponentScore !== null
      ? `${team.liveGame.teamScore}-${team.liveGame.opponentScore}`
      : null;

  return [scoreText, team.liveGame.detail].filter(Boolean).join(" · ") || "Live";
}

export function getTeamAssistiveLabel(team: TeamPresentationInput) {
  const compactLabel = getCompactTeamLabel(team);
  const seedText = team.seed ? `Seed ${team.seed}. ` : "";

  if (team.liveGame?.state === "in_progress") {
    const liveSummary = getTeamLiveSummary(team);
    return `${compactLabel}. ${seedText}Live vs ${team.liveGame.opponentName}. ${liveSummary}.`;
  }

  if (team.liveGame?.state === "scheduled") {
    const detailText = team.liveGame.detail ? ` ${team.liveGame.detail}.` : "";
    return `${compactLabel}. ${seedText}Upcoming vs ${team.liveGame.opponentName}.${detailText}`;
  }

  return `${compactLabel}. ${seedText}${getTeamStatusLabel(team)}.`;
}
