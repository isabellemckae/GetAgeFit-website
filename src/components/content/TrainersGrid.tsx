"use client";

import { useState } from "react";
import { Trainer } from "@/content/trainers";
import { Badge } from "@/components/ui/Badge";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { TrainerBioModal } from "@/components/content/TrainerBioModal";

/**
 * Same trainer card markup/styling that lived inline in
 * src/app/trainers/page.tsx, now wrapped with click-to-open-bio behavior.
 * Cards stay visually identical — this only adds an interaction layer
 * (see TrainerBioModal.tsx) on top of the existing clean card design.
 */
export function TrainersGrid({ trainers }: { trainers: Trainer[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {trainers.map((trainer, index) => (
          <button
            type="button"
            key={trainer.slug}
            id={trainer.slug}
            onClick={() => setOpenIndex(index)}
            className="group scroll-mt-28 overflow-hidden rounded-xl2 border border-ink-100 bg-sand-50 text-left shadow-card transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600"
            aria-haspopup="dialog"
          >
            <div className="overflow-hidden">
              <ResponsiveImage
                src={`/images/trainers/${trainer.slug}.webp`}
                alt={`${trainer.name}, ${trainer.role} at GetAgeFit`}
                placeholderLabel={trainer.photoLabel}
                aspect="aspect-[4/5]"
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="transition-transform duration-500 ease-soft group-hover:scale-105"
              />
            </div>
            <div
              className={`h-1 ${index % 2 === 0 ? "bg-sage-600" : "bg-plum-600"}`}
            />
            <div className="p-6">
              <h2 className="mb-1 text-lg font-display text-ink-900">
                {trainer.name}
              </h2>
              <p className="mb-3 text-sm font-medium text-plum-600">
                {trainer.role}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {trainer.credentials.map((c) => (
                  <Badge key={c} tone="sage">
                    {c}
                  </Badge>
                ))}
              </div>
              {trainer.specialties.length > 0 && (
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  {trainer.specialties.join(" · ")}
                </p>
              )}
            </div>
          </button>
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
