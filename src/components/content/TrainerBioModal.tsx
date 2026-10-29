"use client";

import { useEffect, useRef } from "react";
import { Trainer } from "@/content/trainers";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { trainerPhotoSrc } from "@/components/content/TrainersGrid";

/**
 * Detailed trainer bio — opened from a card in TrainersGrid.tsx.
 *
 * Trainer Bio Simplification (Theo, direct request): restructured to the
 * requested information hierarchy —
 *   A. Identification (headshot, name, title)
 *   B. Training Specialties (plain list)
 *   C. Certifications & Degrees (plain list)
 *   D. About [Name] (the full existing biography, always last)
 * — replacing the previous pill/badge rendering with plain bulleted
 * lists and subtle dividers, and replacing the previous
 * certifications-before-specialties order. The headshot was not
 * previously shown here (the card the visitor just clicked already
 * showed it) but the new hierarchy explicitly calls for it up top, so
 * it's added here too, reusing the same photo TrainersGrid.tsx shows
 * (trainerPhotoSrc), kept intentionally small so it doesn't crowd a
 * mobile screen.
 *
 * Only ever renders verified fields already in src/content/trainers.ts
 * (name, role, credentials, specialties, philosophy, story) — nothing
 * here changes what data exists, only how it's presented. `philosophy`
 * is still placeholder text ("[INSERT ...]") for every trainer; the new
 * requested hierarchy (A/B/C/D above) has no slot for a separate
 * philosophy section, and since `hasContent` already hid it whenever it
 * was still a placeholder, removing the never-rendered block changes
 * nothing a visitor has ever seen. The `philosophy` field itself is left
 * untouched in the data file. `story` is populated for all trainers with
 * verbatim source bios that may contain multiple paragraphs;
 * `whitespace-pre-line` preserves those paragraph breaks as written.
 *
 * Accessibility: focus moves into the dialog on open (to the close
 * button), Tab/Shift+Tab are trapped within the dialog while it's open,
 * Escape closes it, and focus returns to whatever element had focus
 * right before the dialog opened (reliably the trigger button that was
 * just clicked, since that's standard browser focus behavior) once it
 * closes.
 */
function hasContent(value: string) {
  return !value.trim().startsWith("[");
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [onClose, onPrev, onNext]);

  const photoSrc = trainerPhotoSrc(trainer.slug);

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

      <div
        ref={dialogRef}
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl2 bg-white shadow-soft"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close trainer bio"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          {/* A. IDENTIFICATION */}
          <div className="mb-6 flex items-center gap-4">
            <ResponsiveImage
              src={photoSrc}
              alt={`${trainer.name}, ${trainer.role} at GetAgeFit`}
              placeholderLabel={trainer.photoLabel}
              aspect="aspect-square"
              sizes="96px"
              className="w-20 shrink-0 sm:w-24"
            />
            <div>
              <h2 className="font-display text-2xl text-ink-900">
                {trainer.name}
              </h2>
              <p className="text-sm font-medium text-plum-600">
                {trainer.role}
              </p>
            </div>
          </div>

          {/* B. TRAINING SPECIALTIES */}
          {trainer.specialties.length > 0 && (
            <div className="border-t border-ink-100 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Training Specialties
              </p>
              <ul className="space-y-2">
                {trainer.specialties.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* C. CERTIFICATIONS & DEGREES */}
          {trainer.credentials.length > 0 && (
            <div className="border-t border-ink-100 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Certifications &amp; Degrees
              </p>
              <ul className="space-y-2">
                {trainer.credentials.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* D. ABOUT [NAME] — always last */}
          {hasContent(trainer.story) && (
            <div className="border-t border-ink-100 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                About {trainer.name.split(",")[0]}
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">
                {trainer.story}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
            <button
              type="button"
              onClick={onPrev}
              className="text-sm font-semibold text-ink-500 hover:text-sage-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              className="text-sm font-semibold text-ink-500 hover:text-sage-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
