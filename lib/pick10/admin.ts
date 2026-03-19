import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "pick10-admin";

function getConfiguredPasscode() {
  return process.env.ADMIN_PASSCODE?.trim() || null;
}

export function isAdminConfigured() {
  return Boolean(getConfiguredPasscode());
}

function buildToken(value: string) {
  return createHash("sha256").update(`pick10:${value}`).digest("hex");
}

export function isValidAdminPasscode(value: string) {
  const configuredPasscode = getConfiguredPasscode();
  if (!configuredPasscode) {
    return false;
  }

  const expected = buildToken(configuredPasscode);
  const provided = buildToken(value);
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

export async function isAdminAuthenticated() {
  const configuredPasscode = getConfiguredPasscode();
  if (!configuredPasscode) {
    return false;
  }

  const cookieStore = await cookies();
  const stored = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!stored) {
    return false;
  }

  const expected = buildToken(configuredPasscode);
  return timingSafeEqual(Buffer.from(expected), Buffer.from(stored));
}

export async function setAdminSession() {
  const configuredPasscode = getConfiguredPasscode();
  if (!configuredPasscode) {
    throw new Error("ADMIN_PASSCODE is not configured.");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, buildToken(configuredPasscode), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function requireAdminSession() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    throw new Error("Admin authentication required.");
  }
}
