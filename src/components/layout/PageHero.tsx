import { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Demo #3 visual sprint: shared interior-page hero.
 *
 * Every interior page previously repeated its own near-identical inline
 * `<section className="bg-sand-100 py-20...">` hero block (why-getagefit,
 * how-it-works, programs, about, transformations, trainers, contact,
 * resources, qualify all had the same shape). Centralizing it here fixes
 * the "every section looks the same" problem at the source: pages now vary
 * `tone` for rhythm across the site while sharing one richer, decorated
 * treatment instead of nine flat, identical copies.
 *
 * Purely presentational — no data/behavior. Safe to use in front of
 * existing form components (QualifyQuiz, ConsultationForm) without
 * touching them.
 */
export function PageHero({
  eyebrow,
  eyebrowTone = "sage",
  heading,
  body,
  tone = "sand",
  align = "center",
  children,
}: {
  eyebrow: string;
  eyebrowTone?: "sage" | "plum" | "light";
  heading: ReactNode;
  body?: ReactNode;
  tone?: "sand" | "dark" | "meshPlum";
  align?: "center" | "left";
  children?: ReactNode;
}) {
  const isDark = tone !== "sand";
  const wrapClass =
    tone === "sand"
      ? "bg-mesh-hero"
      : tone === "dark"
        ? "bg-mesh-dark"
        : "bg-mesh-plum";

  return (
    <section className={`${wrapClass} py-20 md:py-28`}>
      {isDark && (
        <>
          <div className="blob -right-20 -top-24 h-72 w-72 bg-sage-500/20" />
          <div className="blob -bottom-24 -left-16 h-64 w-64 bg-plum-400/20" />
        </>
      )}
      <div
        className={`relative mx-auto max-w-content px-6 md:px-10 ${
          align === "center" ? "text-center" : ""
        }`}
      >
        <div className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
          <Eyebrow tone={isDark ? "light" : eyebrowTone}>{eyebrow}</Eyebrow>
          <h1
            className={`mb-6 max-w-3xl text-4xl md:text-5xl ${
              align === "center" ? "mx-auto" : ""
            } ${isDark ? "text-sand-50" : ""}`}
          >
            {heading}
          </h1>
          {body && (
            <p
              className={`max-w-2xl text-lg leading-relaxed ${
                align === "center" ? "mx-auto" : ""
              } ${isDark ? "text-sand-200/90" : "text-ink-600"}`}
            >
              {body}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
