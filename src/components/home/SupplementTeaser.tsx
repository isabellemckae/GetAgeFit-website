"use client";

import { useEffect, useState } from "react";

/**
 * Homepage §9 follow-up — a colorful, bold-but-not-overpowering teaser
 * line under the founder copy, opening a lightweight popup on click
 * (same open/close pattern as TrainerBioModal.tsx: backdrop click,
 * Escape, and an X button all close it).
 *
 * Body copy is explicitly a placeholder — Theo is writing the real
 * supplement-line description and will supply it; nothing here is
 * invented product/ingredient/claim content.
 */
const PLACEHOLDER_BODY = "Theo will write and turn in";

export function SupplementTeaser() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="mt-6 flex items-center gap-2 rounded-lg border-l-4 border-plum-500 bg-gradient-to-r from-plum-50 to-sage-50 px-4 py-3 text-left text-sm font-bold text-plum-700 transition-colors hover:from-plum-100 hover:to-sage-100 sm:text-base"
      >
        <span>
          Did you know that Theo has created a GetAgeFit supplement line to
          enhance your training &amp; life?
        </span>
        <span aria-hidden="true" className="shrink-0 text-sage-600">
          →
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="GetAgeFit supplement line"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-xl2 bg-white p-6 shadow-soft sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card hover:bg-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <h2 className="mb-3 font-display text-2xl text-ink-900">
              GetAgeFit Supplements
            </h2>
            <p className="text-sm leading-relaxed text-ink-600">
              {PLACEHOLDER_BODY}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
