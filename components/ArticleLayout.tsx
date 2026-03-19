import { ReactNode } from "react";
import Link from "next/link";
import type { Article } from "@/lib/articles";

function TagBadge({ label, color }: { label: string; color: string }) {
  const colorMap: Record<string, string> = {
    coaching: "bg-accent-green/10 text-accent-green border-accent-green/20",
    seeding: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
    bracket: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
    three: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20",
  };
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${colorMap[color] || colorMap.coaching}`}
    >
      {label}
    </span>
  );
}

function HeroHeader({ article }: { article: Article }) {
  return (
    <div
      className="text-white py-16 px-8 text-center"
      style={{ background: article.heroGradient }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          {article.title}
        </h1>
        <p className="text-lg opacity-85">{article.subtitle}</p>
        {article.meta && (
          <p className="mt-4 text-sm opacity-60">{article.meta}</p>
        )}
      </div>
    </div>
  );
}

function EditorialHeader({ article }: { article: Article }) {
  return (
    <div className="max-w-[920px] mx-auto pt-12 pb-2 px-6">
      <h1 className="text-4xl font-bold text-nora-black tracking-tight mb-2">
        {article.title}
      </h1>
      <p className="text-lg text-nora-grey italic">{article.subtitle}</p>
    </div>
  );
}

export default function ArticleLayout({
  article,
  children,
}: {
  article: Article;
  children: ReactNode;
}) {
  const isHero = article.layout === "hero";

  return (
    <article className="min-h-screen">
      <div
        className={`${isHero ? "" : "max-w-[920px] mx-auto"} px-6 pt-4 pb-2`}
      >
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-nora-grey hover:text-nora-black transition-colors"
        >
          <span>&larr;</span>
          <span>All Articles</span>
        </Link>
      </div>

      {isHero ? (
        <HeroHeader article={article} />
      ) : (
        <EditorialHeader article={article} />
      )}

      <div
        className={`${isHero ? "max-w-[1100px]" : "max-w-[920px]"} mx-auto px-6 py-10`}
      >
        {children}
      </div>

      <footer className="max-w-[920px] mx-auto px-6 pb-12">
        <div className="border-t border-nora-border-light pt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {article.tags.map((tag) => (
              <TagBadge key={tag.label} label={tag.label} color={tag.color} />
            ))}
          </div>
          <Link
            href="/articles"
            className="text-sm text-nora-grey hover:text-nora-black transition-colors"
          >
            &larr; Back to overview
          </Link>
        </div>
      </footer>
    </article>
  );
}
