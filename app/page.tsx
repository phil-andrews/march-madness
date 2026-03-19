import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TOURNAMENT_CONFIG } from "@/lib/pick10/config";
import {
  getTeamBadgeClass,
  getTeamLiveSummary,
  getTeamStatusLabel,
} from "@/lib/pick10/presentation";
import { getLeaderboardSnapshot } from "@/lib/pick10/scoring";

export const dynamic = "force-dynamic";

function formatSyncTime(value: Date | null) {
  if (!value) {
    return "Not synced yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function Home() {
  const snapshot = await getLeaderboardSnapshot();
  const topThree = snapshot.entries.slice(0, 3);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.14),_transparent_25%),linear-gradient(to_bottom,_#fcfcfb,_#f3f4ef)] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
                March Madness 2026
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
                {TOURNAMENT_CONFIG.title}
              </h1>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                {TOURNAMENT_CONFIG.subtitle} This is the live friend-group pool board, not a full
                enterprise app, so the focus is simple: correct standings, visible picks, and easy
                admin control.
              </p>
            </div>

            <Link href="/admin">
              <Button>Admin</Button>
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-muted/70 p-4">
              <div className="text-sm text-muted-foreground">Entries</div>
              <div className="mt-2 text-3xl font-semibold">{snapshot.entries.length}</div>
            </div>
            <div className="rounded-[1.5rem] bg-muted/70 p-4">
              <div className="text-sm text-muted-foreground">Completed games tracked</div>
              <div className="mt-2 text-3xl font-semibold">{snapshot.completedGames}</div>
            </div>
            <div className="rounded-[1.5rem] bg-muted/70 p-4">
              <div className="text-sm text-muted-foreground">Last sync</div>
              <div className="mt-2 text-base font-medium">{formatSyncTime(snapshot.lastSyncedAt)}</div>
            </div>
          </div>
        </section>

        {snapshot.entries.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-border bg-card/70 p-10 text-center shadow-sm">
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

        {topThree.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-3">
            {topThree.map((entry, index) => (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Rank #{entry.displayRank}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{entry.name}</h2>
                    {entry.notes ? (
                      <p className="mt-2 text-sm text-muted-foreground">Owner: {entry.notes}</p>
                    ) : null}
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                    {index === 0 ? "Leader" : "Top 3"}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-muted/70 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Score
                    </div>
                    <div className="mt-2 text-3xl font-semibold">{entry.totalPoints}</div>
                  </div>
                  <div className="rounded-2xl bg-muted/70 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Projected max
                    </div>
                    <div className="mt-2 text-3xl font-semibold">{entry.projectedMax}</div>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        ) : null}

        {snapshot.entries.length > 0 ? (
          <section className="rounded-[2rem] border border-border/70 bg-card/90 p-4 shadow-sm md:p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">Leaderboard</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ranking is by current points, then projected max for display order.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-yellow-800">
                  Yellow = live
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-emerald-700">
                  Green = advanced
                </span>
                <span className="rounded-full border border-red-200 bg-red-100 px-3 py-1 text-red-700">
                  Red = eliminated
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-slate-700">
                  Gray = upcoming
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {snapshot.entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/entry/${entry.id}`}
                  className="block rounded-[1.6rem] border border-border/60 bg-background/80 p-4 transition-colors hover:bg-background md:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-lg font-semibold">
                        #{entry.displayRank}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">{entry.name}</h3>
                        {entry.notes ? (
                          <p className="mt-1 text-sm text-muted-foreground">Owner: {entry.notes}</p>
                        ) : null}
                        <p className="mt-1 text-sm text-muted-foreground">
                          {entry.aliveTeamCount} teams still alive
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:w-auto sm:grid-cols-2">
                      <div className="rounded-2xl bg-muted/70 px-4 py-3">
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Score
                        </div>
                        <div className="mt-1 text-2xl font-semibold">{entry.totalPoints}</div>
                      </div>
                      <div className="rounded-2xl bg-muted/70 px-4 py-3">
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Projected max
                        </div>
                        <div className="mt-1 text-2xl font-semibold">{entry.projectedMax}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.teams.map((team) => (
                      <span
                        key={`${entry.id}-${team.assignedNumber}`}
                        title={`${team.assignedNumber}. ${team.name} · Seed ${team.seed} · ${getTeamStatusLabel(
                          team,
                        )}`}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${getTeamBadgeClass(
                          team,
                        )}`}
                      >
                        <span>#{team.assignedNumber}</span>
                        <span>{team.name}</span>
                        {getTeamLiveSummary(team) ? (
                          <span className="opacity-80">{getTeamLiveSummary(team)}</span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
