"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function isArticleRoute(pathname: string) {
  if (pathname === "/articles") {
    return true;
  }

  if (
    pathname === "/" ||
    pathname.startsWith("/entry/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/")
  ) {
    return false;
  }

  return true;
}

function navLinkClass(isActive: boolean) {
  return cn(
    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-nora-black text-white shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const articleActive = isArticleRoute(pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#fcfcfb]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-nora-black md:text-sm md:tracking-[0.28em]"
        >
          march madness w/ the boys
        </Link>

        <nav className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-white/80 p-1 shadow-sm">
          <Link href="/" className={navLinkClass(!articleActive)}>
            Tracker
          </Link>
          <Link href="/articles" className={navLinkClass(articleActive)}>
            Articles
          </Link>
        </nav>
      </div>
    </header>
  );
}
