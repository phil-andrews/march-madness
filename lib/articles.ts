export type TagColor = "coaching" | "seeding" | "bracket" | "three";

export type Article = {
  slug: string;
  num: number;
  title: string;
  subtitle: string;
  description: string;
  meta?: string;
  sectionLabel: string;
  tags: { label: string; color: TagColor }[];
  layout: "hero" | "editorial";
  heroGradient?: string;
};

export const articles: Article[] = [
  {
    slug: "coaching-experience",
    num: 1,
    title: "Does Tournament Experience Matter?",
    subtitle:
      "Analyzing 40 years of NCAA March Madness coaching data (1985-2024)",
    description:
      "Coaches with 15+ tournament appearances average 2.22 wins vs 0.52 for first-timers. The effect holds after controlling for seed quality \u2014 experience isn\u2019t just a proxy for having good teams.",
    meta: "634 coaches \u2022 2,557 tournament appearances \u2022 2,518 games",
    sectionLabel: "Part I \u2014 Coaching & Expert Judgment",
    tags: [{ label: "Coaching", color: "coaching" }],
    layout: "hero",
    heroGradient: "linear-gradient(135deg, #1B365D 0%, #2E5090 50%, #3A6EA5 100%)",
  },
  {
    slug: "2025-coaching-map",
    num: 2,
    title: "2025 Bracket: The Coaching Map",
    subtitle:
      "Mapping this year\u2019s 68-team field to coaching experience data",
    description:
      "Florida and Duke enter as 1-seeds with thin coaching resumes. Calipari vs. Self as 10 vs. 7 seed pits two 57-win coaches against the bracket.",
    meta: "68 teams \u2022 2025 NCAA Tournament field",
    sectionLabel: "Part I \u2014 Coaching & Expert Judgment",
    tags: [{ label: "Coaching", color: "coaching" }],
    layout: "hero",
    heroGradient: "linear-gradient(135deg, #1B365D 0%, #c44e22 100%)",
  },
  {
    slug: "seeding-expert-fallibility",
    num: 3,
    title: "Seeding & Expert Fallibility",
    subtitle:
      "40 years of NCAA selection committee decisions under the microscope",
    description:
      "The selection committee\u2019s 27% upset rate has been flat for 40 years. The 11-seed anomaly, the 5-vs-12 problem, and conference bias \u2014 the committee\u2019s \u201cprices\u201d have persistent, measurable errors.",
    meta: "2,518 tournament games \u2022 1985\u20132024",
    sectionLabel: "Part I \u2014 Coaching & Expert Judgment",
    tags: [{ label: "Seeding", color: "seeding" }],
    layout: "hero",
    heroGradient: "linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #cd853f 100%)",
  },
  {
    slug: "experts-vs-heuristics",
    num: 4,
    title: "Experts vs. Simple Heuristics",
    subtitle:
      "Can simple rules beat the NCAA selection committee?",
    description:
      "The committee picks winners at 71.4%. A simple win count captures 90% of that predictive power. Only 7 of 193 computer ranking systems beat the committee \u2014 and none by much.",
    meta: "193 computer ranking systems \u2022 40 seasons",
    sectionLabel: "Part I \u2014 Coaching & Expert Judgment",
    tags: [{ label: "Seeding", color: "seeding" }],
    layout: "hero",
    heroGradient: "linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #6c3483 100%)",
  },
  {
    slug: "coaching-meets-seeding",
    num: 5,
    title: "When Coaching Meets Seeding",
    subtitle:
      "The committee\u2019s coaching blind spot",
    description:
      "Upset rates jump from 26% to 38% when the underdog has a coaching experience edge. At 5+ more appearances, the upset rate hits 44\u201345% \u2014 nearly a coin flip.",
    meta: "2,518 tournament games \u2022 634 coaches",
    sectionLabel: "Part I \u2014 Coaching & Expert Judgment",
    tags: [
      { label: "Coaching", color: "coaching" },
      { label: "Seeding", color: "seeding" },
    ],
    layout: "hero",
    heroGradient: "linear-gradient(135deg, #0d3b0d 0%, #1a6b1a 50%, #2d8b2d 100%)",
  },
  {
    slug: "bracket-simulation",
    num: 6,
    title: "Bracket Pool Simulation",
    subtitle:
      "Can coaching experience win your bracket pool?",
    description:
      "Chalk averages 387 points vs. coaching\u2019s 306. The lesson: knowing \u2260 profiting \u2014 exponential scoring punishes upset strategies.",
    meta: "21 tournaments \u2022 Standard scoring (10-20-40-80-160-320)",
    sectionLabel: "Part II \u2014 Bracket Strategy",
    tags: [{ label: "Strategy", color: "bracket" }],
    layout: "hero",
    heroGradient: "linear-gradient(135deg, #1a1a2e 0%, #6b2fa0 40%, #d4531a 100%)",
  },
  {
    slug: "selective-upset-strategy",
    num: 7,
    title: "The Selective Upset Strategy",
    subtitle:
      "Use coaching only in Round 1, chalk from there. When limited to high-conviction picks, upsets hit at a 52% rate.",
    description:
      "Use coaching only in Round 1, chalk from there. When limited to high-conviction picks (5+ experience gap), upsets hit at a 52% rate \u2014 a slightly loaded coin in a field of chalk pickers.",
    sectionLabel: "Part II \u2014 Bracket Strategy",
    tags: [
      { label: "Strategy", color: "bracket" },
      { label: "Coaching", color: "coaching" },
    ],
    layout: "editorial",
  },
  {
    slug: "three-point-arbitrage",
    num: 8,
    title: "The Three-Point Arbitrage",
    subtitle:
      "How college basketball discovered \u2014 and is now closing \u2014 the most obvious market inefficiency in sports",
    description:
      "For 20 years, threes were underpriced. In 2025, the expected value inverted for the first time. Volume up 26%, accuracy flat, two-point efficiency rising \u2014 a textbook market correction that took two decades.",
    sectionLabel: "Part III \u2014 The Three-Point Arbitrage",
    tags: [{ label: "Three-Pointers", color: "three" }],
    layout: "editorial",
  },
  {
    slug: "hidden-cost-of-miss",
    num: 9,
    title: "The Hidden Cost of the Miss",
    subtitle:
      "Why the standard expected value calculation for three-pointers is wrong",
    description:
      "The standard EV calculation ignores rebound economics. Missed threes produce 20% fewer offensive rebounds than missed twos, swinging the EV gap by 0.049 points per shot against the three.",
    sectionLabel: "Part III \u2014 The Three-Point Arbitrage",
    tags: [{ label: "Three-Pointers", color: "three" }],
    layout: "editorial",
  },
  {
    slug: "accuracy-not-volume",
    num: 10,
    title: "Accuracy, Not Volume",
    subtitle:
      "Three-point shooting and winning in the NCAA tournament",
    description:
      "Three-point volume has a +0.023 correlation with winning \u2014 zero. Three-point accuracy: +0.446. And three-point defense may matter even more than offense.",
    sectionLabel: "Part III \u2014 The Three-Point Arbitrage",
    tags: [{ label: "Three-Pointers", color: "three" }],
    layout: "editorial",
  },
];

export const sections = [
  {
    label: "Part I \u2014 Coaching & Expert Judgment",
    slugs: [
      "coaching-experience",
      "2025-coaching-map",
      "seeding-expert-fallibility",
      "experts-vs-heuristics",
      "coaching-meets-seeding",
    ],
  },
  {
    label: "Part II \u2014 Bracket Strategy",
    slugs: ["bracket-simulation", "selective-upset-strategy"],
  },
  {
    label: "Part III \u2014 The Three-Point Arbitrage",
    slugs: [
      "three-point-arbitrage",
      "hidden-cost-of-miss",
      "accuracy-not-volume",
    ],
  },
];
