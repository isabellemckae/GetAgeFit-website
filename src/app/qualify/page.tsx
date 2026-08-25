import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { QualifyQuiz } from "@/components/forms/QualifyQuiz";

export const metadata: Metadata = {
  title: "Is GetAgeFit Right for You?",
  description:
    "A short, thoughtful qualification experience to help you understand whether GetAgeFit's personalized coaching is the right fit, no pressure, no obligation.",
  alternates: { canonical: "/qualify" },
  robots: { index: true, follow: true },
};

export default function QualifyPage() {
  return (
    <section className="bg-mesh-hero py-16 md:py-24">
      <div className="blob -left-20 top-0 h-64 w-64 bg-sage-400/20" />
      <div className="blob -right-16 bottom-0 h-72 w-72 bg-plum-400/15" />
      <Container className="relative max-w-3xl">
        <div className="mb-12 text-center">
          <Eyebrow>Qualification Experience</Eyebrow>
          <h1 className="mb-5 text-4xl md:text-5xl">
            Is GetAgeFit right for you?
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-ink-600">
            A few honest questions (about two minutes) so we can point you
            toward exactly the right next step, whatever that looks like for
            you.
          </p>
        </div>
        <QualifyQuiz />
      </Container>
    </section>
  );
}
