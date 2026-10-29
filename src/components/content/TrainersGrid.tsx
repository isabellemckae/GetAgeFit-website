"use client";

import { useState } from "react";
import { Trainer } from "@/content/trainers";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { TrainerBioModal } from "@/components/content/TrainerBioModal";

/**
 * Same trainer card markup/styling that lived inline in
 * src/app/trainers/page.tsx, now wrapped with click-to-open-bio behavior.
 * Cards stay visually identical — this only adds an interaction layer
 * (see TrainerBioModal.tsx) on top of the existing clean card design.
 *
 * Demo #5: trainers added as placeholder bios (no photo shoot yet) have
 * no /images/trainers/<slug>.webp file on disk. Previously every trainer
 * had a real file, so this component always guessed the src from the
 * slug. Listing the slugs that don't have one yet lets ResponsiveImage
 * fall back to its existing PhotoPlaceholder instead of requesting a file
 * that 404s and rendering a broken image icon.
 *
 * Demo #5 follow-up 2: the two remaining photo-less placeholders (Jalen
 * Curtis, Thea Thurston) were removed from the roster entirely, so this
 * is empty for now — kept in place (rather than removing the mechanism)
 * for the next trainer added without a photo yet.
 *
 * Trainer Bio Simplification (Theo, direct request): the default card no
 * longer shows certification/specialty badges at all — BadgeGroup (with
 * its per-card "how many whole badges fit" measuring logic) is gone
 * entirely, since there's nothing variable-height left on the card to
 * measure. Every card now shows only photo, name, role, and a "More
 * Info" button, so card height is naturally uniform regardless of how
 * much a trainer's expanded profile contains — that was the open problem
 * BadgeGroup existed to paper over; removing the badges removes the
 * problem instead. Full credentials/specialties move into
 * TrainerBioModal.tsx's expanded view, specialties before certifications
 * per the new information hierarchy, as plain lists rather than badges.
 */
const SLUGS_WITHOUT_PHOTO_YET = new Set<string>([]);

// Client-directed (Demo #6): several trainers' /images/trainers/<slug>.webp
// file is reused decoratively elsewhere on the site (founder page team
// strip/values, how-it-works, consultation, programs) — overwriting it
// would change those other placements too. Trainers listed here instead
// get a dedicated headshot (solid background, cropped for the bio card
// only) from /images/trainers/bio/<slug>.webp, leaving the shared file
// everywhere else untouched.
const SLUGS_WITH_BIO_PHOTO = new Set<string>([
  "travis-strawser",
  "paula-jones",
  "maria-arellano",
  "isa-lozano",
  "chip-collerain",
  "ali-tabei",
  "james-petersen",
  "tracie-stolle",
]);

export function trainerPhotoSrc(slug: string): string | undefined {
  if (SLUGS_WITHOUT_PHOTO_YET.has(slug)) return undefined;
  return SLUGS_WITH_BIO_PHOTO.has(slug)
    ? `/images/trainers/bio/${slug}.webp`
    : `/images/trainers/${slug}.webp`;
}

function TrainerPreviewCard({
  trainer,
  accentIndex,
  onOpen,
}: {
  trainer: Trainer;
  accentIndex: number;
  onOpen: () => void;
}) {
  return (
    <div
      id={trainer.slug}
      className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-xl2 border border-ink-100 bg-sand-50 shadow-card transition-shadow duration-300 ease-soft hover:shadow-soft"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="block text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600"
      >
        <div className="overflow-hidden">
          <ResponsiveImage
            src={trainerPhotoSrc(trainer.slug)}
            alt={`${trainer.name}, ${trainer.role} at GetAgeFit`}
            placeholderLabel={trainer.photoLabel}
            aspect="aspect-square"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-500 ease-soft group-hover:scale-105"
          />
        </div>
        <div
          className={`h-1 ${accentIndex % 2 === 0 ? "bg-sage-600" : "bg-plum-600"}`}
        />
      </button>

      <div className="flex flex-1 flex-col px-6 py-6">
        <h2 className="mb-1 text-lg font-display text-ink-900">
          {trainer.name}
        </h2>
        <p className="mb-5 text-sm font-medium text-plum-600">
          {trainer.role}
        </p>
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          aria-label={`More info about ${trainer.name}`}
          className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-sage-600 px-4 py-2 text-sm font-semibold text-sage-700 transition-colors duration-200 hover:bg-sage-600 hover:text-sand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600"
        >
          More Info
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function TrainersGrid({ trainers }: { trainers: Trainer[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer, index) => (
          <TrainerPreviewCard
            key={trainer.slug}
            trainer={trainer}
            accentIndex={index}
            onOpen={() => setOpenIndex(index)}
          />
        ))}
      </div>

      {openIndex !== null && (
        <TrainerBioModal
          trainer={trainers[openIndex]}
          onClose={() => setOpenIndex(null)}
          onPrev={() =>
            setOpenIndex((i) => (i === null ? null : (i - 1 + trainers.length) % trainers.length))
          }
          onNext={() =>
            setOpenIndex((i) => (i === null ? null : (i + 1) % trainers.length))
          }
        />
      )}
    </>
  );
}
