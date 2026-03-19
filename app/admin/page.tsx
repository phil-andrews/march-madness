import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/pick10/admin";
import { getTeamReferences } from "@/lib/pick10/import";
import {
  getTeamBadgeClass,
  getTeamLiveSummary,
  getTeamStatusLabel,
} from "@/lib/pick10/presentation";
import { getEntryDetail, getLeaderboardSnapshot } from "@/lib/pick10/scoring";
import {
  importEntriesAction,
  loginAdmin,
  logoutAdmin,
  saveEntryAction,
  syncTournamentAction,
} from "./actions";

export const dynamic = "force-dynamic";

function MessageBanner({
  message,
  tone,
}: {
  message?: string;
  tone: "neutral" | "error";
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {message}
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const notice = typeof params.notice === "string" ? params.notice : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;
  const editId = typeof params.edit === "string" ? params.edit : undefined;
  const adminConfigured = isAdminConfigured();
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_38%),linear-gradient(to_bottom,_#fafaf9,_#f4f4f0)] px-4 py-12">
        <div className="mx-auto max-w-md rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-sm backdrop-blur">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Unlock the control room
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Use the shared admin passcode to import entries, trigger syncs, and fix picks.
            </p>
          </div>

          <MessageBanner message={error} tone="error" />

          {adminConfigured ? (
            <form action={loginAdmin} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="passcode">
                  Admin passcode
                </label>
                <input
                  id="passcode"
                  name="passcode"
                  type="password"
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <Button type="submit" className="w-full">
                Unlock admin
              </Button>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Add <code>ADMIN_PASSCODE=...</code> to <code>.env.local</code> before using the
              admin tools.
            </div>
          )}
        </div>
      </main>
    );
  }

  const snapshot = await getLeaderboardSnapshot();
  const teamReferences = await getTeamReferences();
  const editingEntry = editId ? await getEntryDetail(editId) : null;
  const picksValue = editingEntry
    ? editingEntry.teams.map((team) => team.assignedNumber).join(", ")
    : "";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_25%),linear-gradient(to_bottom,_#fcfcfb,_#f3f4ef)] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Pick-10 Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Import picks, sync results, fix mistakes
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              The pool already exists. This page is for getting the known entries into Neon and
              keeping the standings fresh while games finish.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/">
              <Button variant="outline">Back to leaderboard</Button>
            </Link>
            <form action={logoutAdmin}>
              <Button type="submit" variant="outline">
                Log out
              </Button>
            </form>
          </div>
        </div>

        <MessageBanner message={notice} tone="neutral" />
        <MessageBanner message={error} tone="error" />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Sync tournament results</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Incremental sync checks the recent tournament window. Backfill walks the full
                  configured tournament date range.
                </p>
              </div>
              <div className="rounded-2xl bg-muted px-3 py-2 text-right text-sm">
                <div className="font-semibold">{snapshot.completedGames}</div>
                <div className="text-muted-foreground">games stored</div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <form action={syncTournamentAction}>
                <input type="hidden" name="mode" value="incremental" />
                <Button type="submit">Run incremental sync</Button>
              </form>
              <form action={syncTournamentAction}>
                <input type="hidden" name="mode" value="backfill" />
                <Button type="submit" variant="outline">
                  Run full backfill
                </Button>
              </form>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Pool snapshot</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-muted/70 p-4">
                <div className="text-3xl font-semibold">{snapshot.entries.length}</div>
                <div className="text-sm text-muted-foreground">entries loaded</div>
              </div>
              <div className="rounded-2xl bg-muted/70 p-4">
                <div className="text-3xl font-semibold">{teamReferences.length}</div>
                <div className="text-sm text-muted-foreground">teams seeded</div>
              </div>
              <div className="rounded-2xl bg-muted/70 p-4">
                <div className="text-3xl font-semibold">{snapshot.completedGames}</div>
                <div className="text-sm text-muted-foreground">results cached</div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Bulk import</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Paste a JSON array or plain text blocks. Plain text blocks should be one entry per
              block, with the first line as the name and the next 10 lines as picks.
            </p>

            <form action={importEntriesAction} className="mt-5 space-y-4">
              <textarea
                name="payload"
                rows={16}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder={`Phil\n1\n5\n17\n24\n28\n33\n40\n47\n55\n63\n\nor\n\n[{ "name": "Phil", "picks": [1, 5, 17, 24, 28, 33, 40, 47, 55, 63] }]`}
              />
              <Button type="submit">Import entries</Button>
            </form>
          </section>

          <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              {editingEntry ? `Edit ${editingEntry.name}` : "Add or update one entry"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use assigned slot numbers, team names, or slot labels. Commas or one-per-line both
              work.
            </p>

            <form action={saveEntryAction} className="mt-5 space-y-4">
              <input name="entryId" type="hidden" value={editingEntry?.id ?? ""} />
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="entry-name">
                  Entry name
                </label>
                <input
                  id="entry-name"
                  name="name"
                  defaultValue={editingEntry?.name ?? ""}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="entry-picks">
                  Picks
                </label>
                <textarea
                  id="entry-picks"
                  name="picks"
                  defaultValue={picksValue}
                  rows={8}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="entry-notes">
                  Owner or notes
                </label>
                <input
                  id="entry-notes"
                  name="notes"
                  defaultValue={editingEntry?.notes ?? ""}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit">{editingEntry ? "Save changes" : "Create entry"}</Button>
                {editingEntry ? (
                  <Link href="/admin">
                    <Button variant="outline">Clear form</Button>
                  </Link>
                ) : null}
              </div>
            </form>
          </section>
        </div>

        <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Current entries</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Existing entries are listed with their picks in order. Use edit to load one into
                the form.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Owner</th>
                  <th className="px-3 py-3 font-medium">Score</th>
                  <th className="px-3 py-3 font-medium">Projected max</th>
                  <th className="px-3 py-3 font-medium">Picks</th>
                  <th className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.entries.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-muted-foreground" colSpan={6}>
                      No entries have been imported yet.
                    </td>
                  </tr>
                ) : null}

                {snapshot.entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border/60 align-top">
                    <td className="px-3 py-4 font-medium">{entry.name}</td>
                    <td className="px-3 py-4 text-muted-foreground">
                      {entry.notes || <span className="text-muted-foreground/60">-</span>}
                    </td>
                    <td className="px-3 py-4">{entry.totalPoints}</td>
                    <td className="px-3 py-4">{entry.projectedMax}</td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        {entry.teams.map((team) => (
                          <span
                            key={`${entry.id}-${team.assignedNumber}`}
                            title={`Seed ${team.seed} · ${team.name} · ${
                              getTeamLiveSummary(team) ?? getTeamStatusLabel(team)
                            }`}
                            className={`rounded-full border px-2.5 py-1 text-xs ${getTeamBadgeClass(
                              team,
                            )}`}
                          >
                            {team.assignedNumber}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/entry/${entry.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Link href={`/admin?edit=${entry.id}`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
