"use client";

import { useEffect } from "react";
import { Trainer } from "@/content/trainers";
import { Badge } from "@/components/ui/Badge";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

/**
 * Detailed trainer bio — opened from a card in TrainersGrid.tsx.
 *
 * Only ever renders verified fields already in src/content/trainers.ts
 * (name, role, credentials, specialties, photo). `philosophy`/`story` are
 * placeholder text ("[INSERT ...]") for every trainer right now — this
 * intentionally omits those sections rather than showing bracket
 * placeholders to a visitor, and will pick them up automatically once a
 * trainer's real content replaces the placeholder (see `hasContent`).
 */
function hasContent(value: string) {
  return !value.trim().startsWith("[");
}

export function TrainerBioModal({
  trainer,
  onClose,
  onPrev,
  onNext,
}: {
  trainer: Trainer;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${trainer.name} bio`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl2 bg-white shadow-soft sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close trainer bio"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card hover:bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative w-full shrink-0 sm:w-2/5">
          <ResponsiveImage
            src={`/images/trainers/${trainer.slug}.webp`}
            alt={`${trainer.name}, ${trainer.role} at GetAgeFit`}
            placeholderLabel={trainer.photoLabel}
            aspect="aspect-[4/5]"
            imageClassName="object-top"
            className="h-full !rounded-none"
          />
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          <h2 className="mb-1 font-display text-2xl text-ink-900">
            {trainer.name}
          </h2>
          <p className="mb-4 text-sm font-medium text-plum-600">
            {trainer.role}
          </p>

          {trainer.credentials.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Credentials
              </p>
              <div className="flex flex-wrap gap-1.5">
                {trainer.credentials.map((c) => (
                  <Badge key={c} tone="sage">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {trainer.specialties.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Specialties
              </p>
              <ul className="space-y-1 text-sm text-ink-600">
                {trainer.specialties.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {hasContent(trainer.philosophy) && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Coaching Philosophy
              </p>
              <p className="text-sm leading-relaxed text-ink-600">
                {trainer.philosophy}
              </p>
            </div>
          )}

          {hasContent(trainer.story) && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Their Story
              </p>
              <p className="text-sm leading-relaxed text-ink-600">
                {trainer.story}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
            <button
              type="button"
              onClick={onPrev}
              className="text-sm font-semibold text-ink-500 hover:text-sage-800"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              className="text-sm font-semibold text-ink-500 hover:text-sage-800"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
