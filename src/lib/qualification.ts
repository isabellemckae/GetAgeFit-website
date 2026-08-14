/**
 * Qualification funnel logic — PROMPT §16–§18.
 *
 * The investment-mindset question is a qualification *signal*, never a
 * disclosure of the internal minimum monthly investment (that figure is
 * never referenced here or anywhere public-facing — see PROMPT §2 and
 * docs/CONTENT-STATUS.md). Routing combines three signals — investment
 * mindset, coaching-importance, and long-term readiness — rather than a
 * single answer, so one soft answer doesn't misroute an otherwise
 * well-qualified prospect.
 */

export type PrimaryGoal =
  | "build_strength"
  | "mobility_balance"
  | "injury_limitation"
  | "weight_management"
  | "longevity"
  | "other";

export type TrainingFrequency = "1x" | "2x" | "3x_plus" | "not_sure";

export type ImportanceLevel = "not_important" | "somewhat" | "very" | "essential";

export type Readiness = "ready_now" | "few_months" | "exploring";

export type InvestmentMindset = "A" | "B" | "C" | "D";

export type QualificationAnswers = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ageRange: string;
  primaryGoal: PrimaryGoal;
  trainingFrequency: TrainingFrequency;
  hasInjuryOrLimitation: "yes" | "no";
  injuryDetail?: string;
  personalizedImportance: ImportanceLevel;
  readiness: Readiness;
  investmentMindset: InvestmentMindset;
};

export type QualificationResult =
  | "high_intent"
  | "potential_fit"
  | "nurture"
  | "low_fit";

export const investmentMindsetOptions: {
  value: InvestmentMindset;
  label: string;
}[] = [
  { value: "A", label: "I'm looking for the lowest-cost way to exercise." },
  {
    value: "B",
    label: "I'm willing to invest in quality coaching if it's the right fit for me.",
  },
  {
    value: "C",
    label:
      "I'm specifically looking for personalized, high-touch coaching and I'm prepared to make it a priority.",
  },
  { value: "D", label: "I'm not sure yet; I'd like to learn more." },
];

const importanceScore: Record<ImportanceLevel, number> = {
  not_important: 0,
  somewhat: 1,
  very: 2,
  essential: 3,
};

const readinessScore: Record<Readiness, number> = {
  exploring: 0,
  few_months: 1,
  ready_now: 2,
};

/**
 * Determine the qualification bucket. See PROMPT §18 for the four
 * outcomes and how each should be handled downstream.
 */
export function routeQualification(
  answers: Pick<
    QualificationAnswers,
    "investmentMindset" | "personalizedImportance" | "readiness"
  >,
): QualificationResult {
  const { investmentMindset, personalizedImportance, readiness } = answers;

  // Primarily seeking low-cost gym access → helpful resource pathway,
  // never aggressive sales, never shamed.
  if (investmentMindset === "A") return "low_fit";

  // Uncertain about readiness → nurture with resources rather than push
  // toward a consultation they're not ready for.
  if (investmentMindset === "D") return "nurture";

  const score =
    importanceScore[personalizedImportance] + readinessScore[readiness];

  // Strong interest in personalized coaching + investment readiness.
  if (
    (investmentMindset === "B" || investmentMindset === "C") &&
    readiness === "ready_now" &&
    (personalizedImportance === "very" || personalizedImportance === "essential")
  ) {
    return "high_intent";
  }

  // Interested but needs more information / isn't fully ready yet.
  if (score >= 1) return "potential_fit";

  return "nurture";
}

export const resultCopy: Record<
  QualificationResult,
  { heading: string; body: string; ctaLabel: string; ctaHref: string }
> = {
  high_intent: {
    heading: "Based on your answers, GetAgeFit may be a great fit for you.",
    body: "You're looking for exactly the kind of personalized, high-touch coaching we built GetAgeFit around. The next step is a consultation, where we'll talk through your goals, your history, and what your program would look like.",
    ctaLabel: "Schedule My Consultation",
    ctaHref: "/consultation",
  },
  potential_fit: {
    heading: "GetAgeFit could be a strong fit: let's talk it through.",
    body: "You've got real goals and an openness to the right coaching relationship. A consultation is a low-pressure way to get your questions answered and see exactly what a personalized plan would look like for you.",
    ctaLabel: "Schedule My Consultation",
    ctaHref: "/consultation",
  },
  nurture: {
    heading: "Let's get you the right information first.",
    body: "It sounds like you're still exploring. That's completely fine. We'll point you toward resources on strength, healthy aging, and what personalized coaching actually looks like, so you can decide when you're ready.",
    ctaLabel: "Explore Resources",
    ctaHref: "/resources",
  },
  low_fit: {
    heading: "Thank you for your honesty: here's what we'd recommend.",
    body: "GetAgeFit is built around personalized, high-touch coaching, which is a bigger investment than lower-cost gym access. That doesn't mean we can't help: our free resources cover a lot of the same strength and healthy-aging fundamentals we coach every day.",
    ctaLabel: "Explore Free Resources",
    ctaHref: "/resources",
  },
};
