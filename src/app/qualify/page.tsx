import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
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
          <p className="mx-auto mb-6 max-w-xl text-lg leading-relaxed text-ink-600">
            A few honest questions (about two minutes) so we can point you
            toward exactly the right next step, whatever that looks like for
            you.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-3">
              {[
                "/images/trainers/ali-tabei.webp",
                "/images/trainers/robin-winkles.webp",
                "/images/trainers/robert-dolan.webp",
              ].map((photo) => (
                <ResponsiveImage
                  key={photo}
                  src={photo}
                  alt="A GetAgeFit trainer"
                  placeholderLabel="Trainer photo"
                  aspect="aspect-square"
                  className="w-10 !rounded-full ring-2 ring-sand-50"
                />
              ))}
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
              Real coaches read every answer
            </p>
          </div>
        </div>
        <QualifyQuiz />
      </Container>
    </section>
  );
}
