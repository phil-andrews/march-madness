import type { LiveGameState } from "@/lib/pick10/espn";

type TeamPresentationInput = {
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
