import { notFound } from "next/navigation";
import { articles } from "@/lib/articles";
import ArticleLayout from "@/components/ArticleLayout";
import CoachingExperience from "@/content/coaching-experience";
import CoachingMap2025 from "@/content/2025-coaching-map";
import SeedingExpertFallibility from "@/content/seeding-expert-fallibility";
import ExpertsVsHeuristics from "@/content/experts-vs-heuristics";
import CoachingMeetsSeeding from "@/content/coaching-meets-seeding";
import BracketSimulation from "@/content/bracket-simulation";
import SelectiveUpsetStrategy from "@/content/selective-upset-strategy";
import ThreePointArbitrage from "@/content/three-point-arbitrage";
import HiddenCostOfMiss from "@/content/hidden-cost-of-miss";
import AccuracyNotVolume from "@/content/accuracy-not-volume";
import type { Metadata } from "next";

const contentMap: Record<string, React.ComponentType> = {
  "coaching-experience": CoachingExperience,
  "2025-coaching-map": CoachingMap2025,
  "seeding-expert-fallibility": SeedingExpertFallibility,
  "experts-vs-heuristics": ExpertsVsHeuristics,
  "coaching-meets-seeding": CoachingMeetsSeeding,
  "bracket-simulation": BracketSimulation,
  "selective-upset-strategy": SelectiveUpsetStrategy,
  "three-point-arbitrage": ThreePointArbitrage,
  "hidden-cost-of-miss": HiddenCostOfMiss,
  "accuracy-not-volume": AccuracyNotVolume,
};

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} — March Madness Economics`,
    description: article.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  const Content = contentMap[slug];

  if (!article || !Content) {
    notFound();
  }

  return (
    <ArticleLayout article={article}>
      <Content />
    </ArticleLayout>
  );
}
