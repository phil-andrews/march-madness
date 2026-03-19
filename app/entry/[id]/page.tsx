import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  getTeamBadgeClass,
  getTeamLiveSummary,
  getTeamStatusLabel,
} from "@/lib/pick10/presentation";
import { getEntryDetail } from "@/lib/pick10/scoring";

export const dynamic = "force-dynamic";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntryDetail(id);

  if (!entry) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_35%),linear-gradient(to_bottom,_#fafaf9,_#f5f6ef)] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Entry detail
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              {entry.name}
            </h1>
            {entry.notes ? (
              <p className="mt-2 text-sm text-muted-foreground">Owner: {entry.notes}</p>
            ) : null}
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Every team below shows current wins, scored points, and the simple projected ceiling
              we are using for the pool.
            </p>
          </div>

          <Link href="/">
            <Button variant="outline">Back to leaderboard</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm">
            <div className="text-sm text-muted-foreground">Current score</div>
            <div className="mt-2 text-4xl font-semibold">{entry.totalPoints}</div>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm">
            <div className="text-sm text-muted-foreground">Projected max</div>
            <div className="mt-2 text-4xl font-semibold">{entry.projectedMax}</div>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm">
            <div className="text-sm text-muted-foreground">Alive teams</div>
            <div className="mt-2 text-4xl font-semibold">{entry.aliveTeamCount}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {entry.teams.map((team) => (
            <article
              key={`${entry.id}-${team.assignedNumber}`}
              className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Pick {team.position}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    #{team.assignedNumber} {team.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Slot: {team.slotLabel} · Seed {team.seed}
                  </p>
                  {team.liveGame ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {team.liveGame.state === "in_progress"
                        ? `Live vs ${team.liveGame.opponentName} · ${getTeamLiveSummary(team)}`
                        : `Upcoming vs ${team.liveGame.opponentName}${
                            team.liveGame.detail ? ` · ${team.liveGame.detail}` : ""
                          }`}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${getTeamBadgeClass(
                    team,
                  )}`}
                >
                  {getTeamStatusLabel(team)}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-muted/70 p-4">
                  <div className="text-sm text-muted-foreground">Wins</div>
                  <div className="mt-2 text-3xl font-semibold">{team.wins}</div>
                </div>
                <div className="rounded-2xl bg-muted/70 p-4">
                  <div className="text-sm text-muted-foreground">Points</div>
                  <div className="mt-2 text-3xl font-semibold">{team.points}</div>
                </div>
                <div className="rounded-2xl bg-muted/70 p-4">
                  <div className="text-sm text-muted-foreground">Projected max</div>
                  <div className="mt-2 text-3xl font-semibold">{team.projectedMax}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
