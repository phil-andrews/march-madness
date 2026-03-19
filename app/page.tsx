import Link from "next/link";
import Pick10SyncFreshness from "@/components/pick10-sync-freshness";
import { Button } from "@/components/ui/button";
import { TOURNAMENT_CONFIG } from "@/lib/pick10/config";
import {
  getCompactTeamChipClass,
  getCompactTeamLabel,
  getCompactTeamStateToken,
  getTeamAssistiveLabel,
} from "@/lib/pick10/presentation";
import { getLeaderboardSnapshot, type LiveGameSummary } from "@/lib/pick10/scoring";

export const dynamic = "force-dynamic";

function formatLiveScore(game: LiveGameSummary) {
  if (game.teamScore === null || game.opponentScore === null) {
    return "Live";
  }

  return `${game.teamScore}-${game.opponentScore}`;
}

function formatImpactedEntries(game: LiveGameSummary) {
  if (game.impactedEntries.length === 0) {
    return null;
  }

  const visibleNames = game.impactedEntries.slice(0, 2).map((entry) => entry.name);
  const overflowCount = game.impactedEntries.length - visibleNames.length;

  return overflowCount > 0 ? `${visibleNames.join(", ")} +${overflowCount} more` : visibleNames.join(", ");
}

export default async function Home() {
  const snapshot = await getLeaderboardSnapshot();
  const topScore = snapshot.entries[0]?.totalPoints ?? null;
  const topScoreCount =
    topScore === null
      ? 0
      : snapshot.entries.filter((entry) => entry.totalPoints === topScore).length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.14),_transparent_25%),linear-gradient(to_bottom,_#fcfcfb,_#f3f4ef)] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl space-y-4 md:space-y-5">
        <section className="rounded-[1.7rem] border border-border/70 bg-card/92 p-4 shadow-sm backdrop-blur md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">
                March Madness {TOURNAMENT_CONFIG.year}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {TOURNAMENT_CONFIG.title}
                </h1>
                <p className="hidden text-sm text-muted-foreground md:block">
                  {TOURNAMENT_CONFIG.subtitle}
                </p>
              </div>
            </div>

            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Admin
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
              <span className="text-muted-foreground">Entries</span>
              <span className="font-semibold">{snapshot.entries.length}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
              <span className="text-muted-foreground">Games</span>
              <span className="font-semibold">{snapshot.completedGames}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
              <span className="text-muted-foreground">Synced</span>
              <span className="font-semibold">
                <Pick10SyncFreshness
                  value={snapshot.lastSyncedAt ? snapshot.lastSyncedAt.toISOString() : null}
                />
              </span>
            </span>
          </div>
        </section>

        {snapshot.entries.length === 0 ? (
          <section className="rounded-[1.8rem] border border-dashed border-border bg-card/75 p-8 text-center shadow-sm md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight">No entries imported yet</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              Seed the teams, then use the admin page to import the friend-group picks. Once those
              are in, the leaderboard and entry pages will populate automatically.
            </p>
            <div className="mt-5">
              <Link href="/admin">
                <Button>Go to admin</Button>
              </Link>
            </div>
          </section>
        ) : null}

        {snapshot.liveGames.length > 0 || snapshot.liveDataStatus === "unavailable" ? (
          <section className="rounded-[1.8rem] border border-border/70 bg-card/92 p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Live Now
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">Tracked games in progress</h2>
              </div>
              {snapshot.liveGames.length > 0 ? (
                <span className="inline-flex items-center gap-2 self-start rounded-full border border-yellow-300/80 bg-yellow-100/80 px-3 py-1 text-sm font-medium text-yellow-900">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" aria-hidden />
                  {snapshot.liveGames.length} live
                </span>
              ) : null}
            </div>

            <p className="sr-only" aria-live="polite" role="status">
              {snapshot.liveDataStatus === "unavailable"
                ? "Live game data is temporarily unavailable."
                : `${snapshot.liveGames.length} tracked games are live.`}
            </p>

            {snapshot.liveDataStatus === "unavailable" ? (
              <div className="mt-4 rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Live game data is temporarily unavailable. Standings are still based on the latest
                synced results.
              </div>
            ) : null}

            {snapshot.liveGames.length > 0 ? (
              <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
                <div className="flex gap-3">
                  {snapshot.liveGames.map((game) => {
                    const impactedEntries = formatImpactedEntries(game);

                    return (
                      <article
                        key={game.gameId}
                        className="min-w-[260px] flex-1 rounded-[1.45rem] border border-border/70 bg-background/85 p-4 shadow-sm md:min-w-[300px]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-900">
                            <span
                              className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"
                              aria-hidden
                            />
                            Live
                          </span>
                          <span className="text-sm font-semibold">{formatLiveScore(game)}</span>
                        </div>

                        <h3 className="mt-3 text-lg font-semibold tracking-tight">
                          {game.trackedTeamName} vs {game.opponentName}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {game.detail || "Game in progress"}
                        </p>

                        {impactedEntries ? (
                          <p className="mt-3 text-sm text-muted-foreground">
                            Affects {impactedEntries}
                          </p>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {snapshot.entries.length > 0 ? (
          <section className="rounded-[1.8rem] border border-border/70 bg-card/92 p-3 shadow-sm md:p-4">
            <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Leaderboard</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current points first. Tied scores share a rank, with projected max ordering the
                  rows.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {snapshot.entries.map((entry) => {
                const isTopScore = topScore !== null && entry.totalPoints === topScore;
                const isUniqueLeader = isTopScore && topScoreCount === 1;
                const isSharedTop = isTopScore && topScoreCount > 1;

                return (
                  <Link
                    key={entry.id}
                    href={`/entry/${entry.id}`}
                    className={`block rounded-[1.4rem] border p-3 transition-colors hover:bg-background/95 md:p-4 ${
                      isUniqueLeader
                        ? "border-emerald-300/80 bg-emerald-50/70"
                        : isSharedTop
                          ? "border-amber-300/70 bg-amber-50/70"
                          : "border-border/70 bg-background/82"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold ${
                          isUniqueLeader
                            ? "border-emerald-300 bg-white text-emerald-900"
                            : isSharedTop
                              ? "border-amber-300 bg-white text-amber-900"
                              : "border-border/70 bg-muted/70 text-foreground"
                        }`}
                      >
                        #{entry.displayRank}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-lg font-semibold tracking-tight">
                                {entry.name}
                              </h3>
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
                              {entry.hasLiveGame ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-yellow-300 bg-yellow-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-900">
                                  <span
                                    className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse"
                                    aria-hidden
                                  />
                                  Live pick
                                </span>
                              ) : null}
                            </div>

                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                              {entry.notes ? <span>Owner: {entry.notes}</span> : null}
                              <span>{entry.aliveTeamCount} alive</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 md:justify-end">
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-3 py-1 text-xs font-medium">
                              <span className="text-muted-foreground">Pts</span>
                              <span className="text-foreground">{entry.totalPoints}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-3 py-1 text-xs font-medium">
                              <span className="text-muted-foreground">Max</span>
                              <span className="text-foreground">{entry.projectedMax}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-3 py-1 text-xs font-medium">
                              <span className="text-muted-foreground">Alive</span>
                              <span className="text-foreground">{entry.aliveTeamCount}</span>
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {entry.teams.map((team) => {
                            const stateToken = getCompactTeamStateToken(team);

                            return (
                              <span
                                key={`${entry.id}-${team.assignedNumber}`}
                                aria-label={getTeamAssistiveLabel(team)}
                                className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${getCompactTeamChipClass(
                                  team,
                                )}`}
                              >
                                {team.liveGame?.state === "in_progress" ? (
                                  <span
                                    className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"
                                    aria-hidden
                                  />
                                ) : null}
                                <span className="max-w-[120px] truncate md:max-w-[160px]">
                                  {getCompactTeamLabel(team)}
                                </span>
                                {stateToken ? (
                                  <span className="rounded-full bg-black/8 px-1.5 py-0.5 text-[10px] font-semibold leading-none">
                                    {stateToken}
                                  </span>
                                ) : null}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
