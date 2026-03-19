import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Pick10SyncFreshness from "@/components/pick10-sync-freshness";
import { Button } from "@/components/ui/button";
import { TOURNAMENT_CONFIG } from "@/lib/pick10/config";
import {
  getCompactTeamStateToken,
  getTeamAssistiveLabel,
  getTeamBadgeClass,
  getTeamStatusLabel,
} from "@/lib/pick10/presentation";
import {
  getEntryDetailView,
  type EntryDetailView,
  type TeamBreakdown,
} from "@/lib/pick10/scoring";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatCount(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatWinsLeft(count: number) {
  if (count === 0) {
    return "No wins left";
  }

  return count === 1 ? "1 win left" : `${count} wins left`;
}

function formatRank(entry: EntryDetailView) {
  return entry.tiedEntryCount > 1 ? `Tied #${entry.displayRank}` : `#${entry.displayRank}`;
}

function formatLiveScore(team: TeamBreakdown) {
  if (team.liveGame?.state !== "in_progress") {
    return "Live";
  }

  if (team.liveGame.teamScore === null || team.liveGame.opponentScore === null) {
    return "Live";
  }

  return `${team.liveGame.teamScore}-${team.liveGame.opponentScore}`;
}

function formatTeamContext(team: TeamBreakdown) {
  const parts = [`Seed ${team.seed}`];

  if (team.liveGame?.state === "scheduled") {
    parts.push(`Upcoming vs ${team.liveGame.opponentName}`);

    if (team.liveGame.detail) {
      parts.push(team.liveGame.detail);
    }

    return parts.join(" · ");
  }

  if (team.isChampion) {
    parts.push("Champion");
    return parts.join(" · ");
  }

  if (team.isRunnerUp) {
    parts.push("Runner-up");
    return parts.join(" · ");
  }

  if (!team.isAlive) {
    parts.push("Tournament run complete");
    return parts.join(" · ");
  }

  if (team.wins > 0) {
    parts.push(`${team.wins} ${team.wins === 1 ? "win" : "wins"} banked`);
  }

  parts.push(formatWinsLeft(team.remainingPossibleWins));

  return parts.join(" · ");
}

function SummaryStat({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.1rem] border bg-background/80 p-3 shadow-sm",
        accent ? "border-yellow-300/70 bg-yellow-50/70" : "border-border/70",
      )}
    >
      <div className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold tracking-tight">{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

function MetricPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  tone?: "default" | "live";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "live"
          ? "border-yellow-300/70 bg-white/90 text-yellow-950"
          : "border-border/70 bg-background/80 text-foreground",
      )}
    >
      <span className={tone === "live" ? "text-yellow-900/70" : "text-muted-foreground"}>
        {label}
      </span>
      <span>{value}</span>
    </span>
  );
}

function SectionHeading({
  title,
  description,
  count,
  tone = "default",
}: {
  title: string;
  description: string;
  count: string;
  tone?: "default" | "live" | "out";
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-sm font-medium",
          tone === "live" && "border-yellow-300/80 bg-yellow-100/80 text-yellow-900",
          tone === "out" && "border-red-200/80 bg-red-50 text-red-800",
          tone === "default" && "border-border/70 bg-background/85 text-foreground",
        )}
      >
        {tone === "live" ? (
          <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" aria-hidden />
        ) : null}
        {count}
      </span>
    </div>
  );
}

function LiveTeamRow({ team }: { team: TeamBreakdown }) {
  const detail = team.liveGame?.state === "in_progress" ? team.liveGame.detail : null;

  return (
    <article
      aria-label={getTeamAssistiveLabel(team)}
      className="rounded-[1.45rem] border border-yellow-300/80 bg-yellow-50/85 p-4 shadow-sm"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              Pick {team.position}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-900">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" aria-hidden />
              Live
            </span>
          </div>

          <h3 className="mt-3 text-xl font-semibold tracking-tight text-yellow-950">
            #{team.assignedNumber} {team.name}
          </h3>

          <p className="mt-1 text-sm text-yellow-950/80">
            Seed {team.seed} · vs {team.liveGame?.opponentName ?? "Opponent unavailable"}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex rounded-full border border-yellow-300/80 bg-white/90 px-3 py-1 font-semibold text-yellow-950">
              {formatLiveScore(team)}
            </span>
            <span className="inline-flex rounded-full border border-yellow-200/80 bg-yellow-100/80 px-3 py-1 text-yellow-950">
              {detail || "Game in progress"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:max-w-[320px] md:justify-end">
          <MetricPill label="Wins" value={team.wins} tone="live" />
          <MetricPill label="Pts" value={team.points} tone="live" />
          <MetricPill label="Max" value={team.projectedMax} tone="live" />
          <MetricPill label="Left" value={team.remainingPossibleWins} tone="live" />
        </div>
      </div>
    </article>
  );
}

function CompactTeamRow({
  team,
  tone = "default",
}: {
  team: TeamBreakdown;
  tone?: "default" | "muted";
}) {
  const stateToken = getCompactTeamStateToken(team);

  return (
    <article
      aria-label={getTeamAssistiveLabel(team)}
      className={cn(
        "rounded-[1.3rem] border p-3",
        tone === "muted" ? "border-red-200/70 bg-red-50/45" : "border-border/70 bg-background/82",
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Pick {team.position}
            </span>
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getTeamBadgeClass(
                team,
              )}`}
            >
              {getTeamStatusLabel(team)}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "text-lg font-semibold tracking-tight",
                tone === "muted" && "text-slate-700 line-through decoration-red-300",
              )}
            >
              #{team.assignedNumber} {team.name}
            </h3>
            {stateToken ? (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {stateToken}
              </span>
            ) : null}
          </div>

          <p
            className={cn(
              "mt-1 text-sm text-muted-foreground",
              tone === "muted" && "text-slate-600",
            )}
          >
            {formatTeamContext(team)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <MetricPill label="Wins" value={team.wins} />
          <MetricPill label="Pts" value={team.points} />
          <MetricPill label="Max" value={team.projectedMax} />
          <MetricPill label="Left" value={team.remainingPossibleWins} />
        </div>
      </div>
    </article>
  );
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntryDetailView(id);

  if (!entry) {
    notFound();
  }

  const isUniqueLeader = entry.displayRank === 1 && entry.tiedEntryCount === 1;
  const isSharedTop = entry.displayRank === 1 && entry.tiedEntryCount > 1;
  const aliveDescription =
    entry.upcomingTeamCount > 0
      ? `Remaining upside, including ${formatCount(entry.upcomingTeamCount, "upcoming game")}.`
      : "Picks that can still add points.";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.14),_transparent_25%),linear-gradient(to_bottom,_#fcfcfb,_#f3f4ef)] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl space-y-4 md:space-y-5">
        <section
          className={cn(
            "rounded-[1.8rem] border p-4 shadow-sm backdrop-blur md:p-5",
            isUniqueLeader && "border-emerald-300/80 bg-emerald-50/65",
            isSharedTop && "border-amber-300/80 bg-amber-50/65",
            !isUniqueLeader && !isSharedTop && "border-border/70 bg-card/92",
          )}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.32em] text-muted-foreground">
                <span>{TOURNAMENT_CONFIG.title}</span>
                <span className="h-1 w-1 rounded-full bg-current/40" aria-hidden />
                <span>Entry detail</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {entry.name}
                </h1>
                {isUniqueLeader ? (
                  <span className="rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-900">
                    Leader
                  </span>
                ) : null}
                {isSharedTop ? (
                  <span className="rounded-full border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900">
                    Tied top
                  </span>
                ) : null}
              </div>

              {entry.notes ? (
                <p className="mt-2 text-sm text-muted-foreground">Owner: {entry.notes}</p>
              ) : null}

              {entry.tiedEntryCount > 1 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Shared rank on current points with{" "}
                  {formatCount(entry.tiedEntryCount - 1, "other entry", "other entries")}.
                </p>
              ) : null}
            </div>

            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to leaderboard</Link>
            </Button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryStat label="Rank" value={formatRank(entry)} hint={`of ${entry.totalEntries}`} />
            <SummaryStat label="Score" value={entry.totalPoints} hint="current points" />
            <SummaryStat label="Max" value={entry.projectedMax} hint="projected ceiling" />
            <SummaryStat
              label="Alive"
              value={entry.aliveTeamCount}
              hint={`of ${TOURNAMENT_CONFIG.entrySize} picks`}
            />
            {entry.liveTeamCount > 0 ? (
              <SummaryStat label="Live" value={entry.liveTeamCount} hint="in progress" accent />
            ) : null}
            {entry.upcomingTeamCount > 0 ? (
              <SummaryStat label="Upcoming" value={entry.upcomingTeamCount} hint="scheduled next" />
            ) : null}
            <SummaryStat
              label="Synced"
              value={
                <Pick10SyncFreshness
                  value={entry.lastSyncedAt ? entry.lastSyncedAt.toISOString() : null}
                />
              }
              hint={
                entry.liveDataStatus === "unavailable"
                  ? "latest results only"
                  : "relative to latest sync"
              }
            />
          </div>
        </section>

        {entry.liveDataStatus === "unavailable" ? (
          <section className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
            Live game data is temporarily unavailable. Standings still use the latest synced
            results, but current in-progress and upcoming matchups may be missing here.
          </section>
        ) : null}

        {entry.liveTeams.length > 0 ? (
          <section className="rounded-[1.8rem] border border-yellow-200/80 bg-card/92 p-4 shadow-sm md:p-5">
            <SectionHeading
              title="Live now"
              description="Games currently in progress for this entry."
              count={formatCount(entry.liveTeamCount, "pick")}
              tone="live"
            />

            <div className="mt-4 space-y-3">
              {entry.liveTeams.map((team) => (
                <LiveTeamRow key={`${entry.id}-${team.assignedNumber}`} team={team} />
              ))}
            </div>
          </section>
        ) : null}

        {entry.aliveTeams.length > 0 ? (
          <section className="rounded-[1.8rem] border border-border/70 bg-card/92 p-4 shadow-sm md:p-5">
            <SectionHeading
              title="Still alive"
              description={aliveDescription}
              count={formatCount(entry.aliveTeams.length, "pick")}
            />

            <div className="mt-4 space-y-2.5">
              {entry.aliveTeams.map((team) => (
                <CompactTeamRow key={`${entry.id}-${team.assignedNumber}`} team={team} />
              ))}
            </div>
          </section>
        ) : null}

        {entry.eliminatedTeams.length > 0 ? (
          <section className="rounded-[1.8rem] border border-red-200/70 bg-card/92 p-4 shadow-sm md:p-5">
            <SectionHeading
              title="Out"
              description="Finished picks that can no longer add points."
              count={formatCount(entry.eliminatedTeams.length, "pick")}
              tone="out"
            />

            <div className="mt-4 space-y-2.5">
              {entry.eliminatedTeams.map((team) => (
                <CompactTeamRow
                  key={`${entry.id}-${team.assignedNumber}`}
                  team={team}
                  tone="muted"
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
