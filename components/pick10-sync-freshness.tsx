"use client";

import { useEffect, useState } from "react";

function formatAbsoluteTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatRelativeTime(value: Date, nowMs: number) {
  const diffMs = value.getTime() - nowMs;
  const absDiffMs = Math.abs(diffMs);

  if (absDiffMs < 60_000) {
    return "just now";
  }

  const formatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

  if (absDiffMs < 3_600_000) {
    return formatter.format(Math.round(diffMs / 60_000), "minute");
  }

  if (absDiffMs < 86_400_000) {
    return formatter.format(Math.round(diffMs / 3_600_000), "hour");
  }

  return formatter.format(Math.round(diffMs / 86_400_000), "day");
}

export default function Pick10SyncFreshness({ value }: { value: string | null }) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!value) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [value]);

  if (!value) {
    return <span>Not synced yet</span>;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return <span>Sync time unavailable</span>;
  }

  const absoluteTime = formatAbsoluteTime(parsed);

  return (
    <time dateTime={parsed.toISOString()} aria-label={`Last synced ${absoluteTime}`}>
      {formatRelativeTime(parsed, nowMs)}
    </time>
  );
}
