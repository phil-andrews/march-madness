import Link from "next/link";
import { articles, sections, type TagColor } from "@/lib/articles";

const tagColorMap: Record<TagColor, string> = {
  coaching: "bg-accent-green/10 text-accent-green",
  seeding: "bg-accent-blue/10 text-accent-blue",
  bracket: "bg-accent-purple/10 text-accent-purple",
  three: "bg-accent-yellow/10 text-accent-yellow",
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(43,102,255,0.08),_transparent_32%),linear-gradient(to_bottom,_#f7f5ef,_#f1efe7)] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-[920px]">
        <div className="mb-10 rounded-[2rem] border border-nora-border-light bg-white/90 p-6 shadow-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-nora-grey hover:text-nora-black transition-colors"
          >
            <span>&larr;</span>
            <span>Back to march madness w/ the boys</span>
          </Link>

          <h1 className="mt-5 text-5xl font-bold tracking-tight text-nora-black">
            March Madness Economics
          </h1>
          <p className="mt-3 text-xl text-nora-grey italic">
            What 40 years of NCAA tournament data reveals about expert judgment,
            market efficiency, and the price of a three-pointer
          </p>
          <p className="mt-4 max-w-[720px] text-base text-nora-grey-dark">
            The pool tracker lives on the homepage. This archive keeps the long-form
            analysis series intact as a separate section of the site.
          </p>
        </div>

        {sections.map((section) => {
          const sectionArticles = section.slugs.map(
            (slug) => articles.find((article) => article.slug === slug)!,
          );

          return (
            <section key={section.label} className="mb-10">
              <div className="mb-4 text-xs font-bold tracking-widest uppercase text-nora-grey">
                {section.label}
              </div>

              <div className="grid gap-4">
                {sectionArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${article.slug}`}
                    className="group rounded-[1.5rem] border border-nora-border-light bg-white p-6 text-inherit no-underline transition-all hover:border-nora-grey hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="grid grid-cols-[44px_1fr] gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-nora-black text-base font-bold text-white">
                        {article.num}
                      </div>
                      <div>
                        <h2 className="mb-1 text-xl font-bold text-nora-black transition-colors group-hover:text-accent-blue">
                          {article.title}
                        </h2>
                        <p className="mb-2 text-sm leading-relaxed text-nora-grey">
                          {article.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {article.tags.map((tag) => (
                            <span
                              key={tag.label}
                              className={`rounded px-2 py-0.5 text-xs font-semibold ${tagColorMap[tag.color]}`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
