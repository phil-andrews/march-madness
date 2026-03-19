"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  isAdminConfigured,
  isValidAdminPasscode,
  requireAdminSession,
  setAdminSession,
} from "@/lib/pick10/admin";
import { runTournamentSync } from "@/lib/pick10/espn";
import { importEntriesFromText, parseManualEntry, saveEntry } from "@/lib/pick10/import";

function redirectToAdmin(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const queryString = searchParams.toString();
  redirect(queryString ? `/admin?${queryString}` : "/admin");
}

export async function loginAdmin(formData: FormData) {
  if (!isAdminConfigured()) {
    redirectToAdmin({ error: "ADMIN_PASSCODE is not configured." });
  }

  const passcode = String(formData.get("passcode") ?? "").trim();

  if (!passcode || !isValidAdminPasscode(passcode)) {
    redirectToAdmin({ error: "Invalid admin passcode." });
  }

  await setAdminSession();
  redirectToAdmin({ notice: "Admin access unlocked." });
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}

export async function importEntriesAction(formData: FormData) {
  await requireAdminSession();

  try {
    const payload = String(formData.get("payload") ?? "");
    const result = await importEntriesFromText(payload);

    revalidatePath("/");
    revalidatePath("/admin");

    redirectToAdmin({
      notice: `Imported ${result.totalCount} entries (${result.createdCount} created, ${result.updatedCount} updated).`,
    });
  } catch (error) {
    redirectToAdmin({
      error: error instanceof Error ? error.message : "Import failed.",
    });
  }
}

export async function saveEntryAction(formData: FormData) {
  await requireAdminSession();

  try {
    const entryId = String(formData.get("entryId") ?? "").trim() || undefined;
    const name = String(formData.get("name") ?? "").trim();
    const picks = String(formData.get("picks") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim() || undefined;

    const entry = await parseManualEntry(name, picks);
    const result = await saveEntry(entry, { entryId, notes });

    revalidatePath("/");
    revalidatePath("/admin");

    redirectToAdmin({
      notice: result.created ? `Created ${entry.name}.` : `Updated ${entry.name}.`,
      edit: result.entryId,
    });
  } catch (error) {
    redirectToAdmin({
      error: error instanceof Error ? error.message : "Could not save the entry.",
    });
  }
}

export async function syncTournamentAction(formData: FormData) {
  await requireAdminSession();

  try {
    const mode = formData.get("mode") === "backfill" ? "backfill" : "incremental";
    const result = await runTournamentSync(mode);

    revalidatePath("/");
    revalidatePath("/admin");

    if ("skipped" in result && result.skipped) {
      redirectToAdmin({ notice: result.skipped });
    }

    redirectToAdmin({
      notice: `Processed ${result.completedGames} completed games across ${result.dates.length} dates and inserted ${result.insertedGames} new results.`,
    });
  } catch (error) {
    redirectToAdmin({
      error: error instanceof Error ? error.message : "Sync failed.",
    });
  }
}
