import { HTMLAttributes } from "react";
import { Container } from "./Container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: "sand" | "white" | "sage" | "ink";
  containerClassName?: string;
};

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  sand: "bg-sand-50",
  white: "bg-white",
  sage: "bg-sage-800 text-sand-50",
  ink: "bg-ink-900 text-sand-50",
};

export function Section({
  tone = "sand",
  className = "",
  containerClassName = "",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={`py-20 md:py-28 ${toneClasses[tone]} ${className}`}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "sage",
}: {
  children: React.ReactNode;
  tone?: "sage" | "plum" | "light";
}) {
  const toneClass =
    tone === "sage"
      ? "text-sage-700"
      : tone === "plum"
        ? "text-plum-600"
        : "text-sand-200";
  return (
    <p
      className={`mb-4 text-sm font-semibold uppercase tracking-[0.18em] ${toneClass}`}
    >
      {children}
    </p>
  );
}
