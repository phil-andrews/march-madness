import Link from "next/link";
import { articles, sections, type TagColor } from "@/lib/articles";

const tagColorMap: Record<TagColor, string> = {
  coaching: "bg-accent-green/10 text-accent-green",
  seeding: "bg-accent-blue/10 text-accent-blue",
  bracket: "bg-accent-purple/10 text-accent-purple",
  three: "bg-accent-yellow/10 text-accent-yellow",
};

export default function Home() {
  return (
    <div className="max-w-[860px] mx-auto px-5 py-12 pb-20">
      <h1 className="text-5xl font-bold tracking-tight text-nora-black mb-2">
        March Madness Economics
      </h1>
      <p className="text-xl text-nora-grey italic mb-3">
        What 40 years of NCAA tournament data reveals about expert judgment,
        market efficiency, and the price of a three-pointer
      </p>
      <p className="text-base text-nora-grey-dark mb-12 max-w-[700px]">
        This is a series of data analyses that use March Madness as a lens for
        economic storytelling &mdash; expert fallibility, arbitrage correction,
        variance as strategy, and the gap between insight and implementation. All
        findings are derived from the Kaggle March Machine Learning Mania
        dataset covering 1985&ndash;2025.
      </p>

      {sections.map((section) => {
        const sectionArticles = section.slugs.map(
          (s) => articles.find((a) => a.slug === s)!
        );
        return (
          <div key={section.label}>
            <div className="text-xs font-bold tracking-widest uppercase text-nora-grey mt-12 mb-4">
              {section.label}
            </div>
            <div className="grid gap-4">
              {sectionArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${article.slug}`}
                  className="group bg-white border border-nora-border-light rounded-xl p-6 grid grid-cols-[44px_1fr] gap-4 items-start no-underline text-inherit transition-all hover:border-nora-grey hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="w-11 h-11 rounded-full bg-nora-black text-white flex items-center justify-center font-bold text-base">
                    {article.num}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-nora-black mb-1 group-hover:text-accent-blue transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-nora-grey leading-relaxed mb-2">
                      {article.description}
                    </p>
                    <div className="flex gap-1.5">
                      {article.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${tagColorMap[tag.color]}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <footer className="mt-16 pt-5 border-t border-nora-border-light text-sm text-nora-grey">
        Data source: Kaggle March Machine Learning Mania (1985&ndash;2025).
        Regular season: ~118,000 games. Tournament: 2,518 games (compact),
        1,382 games (detailed box scores). 380 D1 teams, 1,621 coaches, 193
        computer ranking systems.
      </footer>
    </div>
  );
}
