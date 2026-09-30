"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Trainer } from "@/content/trainers";
import { Badge } from "@/components/ui/Badge";
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
 * fall back to its existing PhotoPlaceholder (the same fallback
 * TrainerCard.tsx already relies on) instead of requesting a file that
 * 404s and rendering a broken image icon.
 *
 * Demo #5 follow-up 2: the two remaining photo-less placeholders (Jalen
 * Curtis, Thea Thurston) were removed from the roster entirely, so this
 * is empty for now — kept in place (rather than removing the mechanism)
 * for the next trainer added without a photo yet.
 *
 * Approved edit (client-directed): credentials and specialties now render
 * together under one "Certifications" label (see CertificationsList
 * below), and every card is the same height regardless of how many
 * certifications a trainer has. The card is no longer one giant <button>
 * (a "Click to see more" toggle needed its own interactive element, and
 * nesting a <button> inside a <button> is invalid HTML) — the photo/name
 * area and an explicit "View full bio" link both open the same modal.
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
]);

// The collapsed certifications block caps at roughly two comfortable badge
// rows. Whichever whole badges fit within that height show by default; a
// trainer with more gets a "Click to see more" toggle for the rest.
// Cutting at a whole-badge boundary (rather than clipping the block's CSS
// height) is deliberate — a fixed-height overflow:hidden would slice
// straight through whichever badge row straddled the limit, chopping its
// text in half.
const CERTS_COLLAPSED_MAX_HEIGHT_PX = 80;

function CertificationsList({
  regionId,
  items,
}: {
  regionId: string;
  items: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function measure() {
      const container = measureRef.current;
      if (!container) return;
      const containerTop = container.getBoundingClientRect().top;
      const children = Array.from(container.children) as HTMLElement[];
      let count = 0;
      for (const child of children) {
        const bottom = child.getBoundingClientRect().bottom - containerTop;
        if (bottom <= CERTS_COLLAPSED_MAX_HEIGHT_PX + 1) {
          count++;
        } else {
          break;
        }
      }
      setVisibleCount(Math.max(count, Math.min(1, items.length)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  if (items.length === 0) return null;

  const overflowing = visibleCount < items.length;
  const shown = expanded ? items : items.slice(0, visibleCount);

  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
        Certifications
      </p>
      <div className="relative">
        {/* Off-screen full list, measured to find how many whole badges fit
            the collapsed height at the card's actual current width. Same
            width as the visible list (absolute inside this relative
            wrapper) but invisible and out of the layout flow. */}
        <div
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 flex w-full flex-wrap gap-1.5"
        >
          {items.map((c) => (
            <Badge key={c} tone="sage">
              {c}
            </Badge>
          ))}
        </div>
        <div id={regionId} className="flex flex-wrap gap-1.5">
          {shown.map((c) => (
            <Badge key={c} tone="sage">
              {c}
            </Badge>
          ))}
        </div>
      </div>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={regionId}
          className="mt-2 text-xs font-semibold text-sage-700 underline decoration-2 underline-offset-2 hover:text-sage-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600"
        >
          {expanded ? "Click to see less" : "Click to see more"}
        </button>
      )}
    </div>
  );
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
  const certifications = [...trainer.credentials, ...trainer.specialties];
  const regionId = useId();

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
            src={
              SLUGS_WITHOUT_PHOTO_YET.has(trainer.slug)
                ? undefined
                : SLUGS_WITH_BIO_PHOTO.has(trainer.slug)
                  ? `/images/trainers/bio/${trainer.slug}.webp`
                  : `/images/trainers/${trainer.slug}.webp`
            }
            alt={`${trainer.name}, ${trainer.role} at GetAgeFit`}
            placeholderLabel={trainer.photoLabel}
            aspect="aspect-[4/5]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-500 ease-soft group-hover:scale-105"
          />
        </div>
        <div
          className={`h-1 ${accentIndex % 2 === 0 ? "bg-sage-600" : "bg-plum-600"}`}
        />
        <div className="px-6 pt-6">
          <h2 className="mb-1 text-lg font-display text-ink-900">
            {trainer.name}
          </h2>
          <p className="text-sm font-medium text-plum-600">{trainer.role}</p>
        </div>
      </button>

      <div className="flex flex-1 flex-col justify-between px-6 pb-6">
        <CertificationsList regionId={regionId} items={certifications} />
        <button
          type="button"
          onClick={onOpen}
          className="mt-4 self-start text-sm font-semibold text-ink-500 hover:text-sage-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600"
        >
          View full bio →
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
