import Link from "next/link";
import { Trainer } from "@/content/trainers";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Badge } from "@/components/ui/Badge";

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <Link
      href={`/trainers#${trainer.slug}`}
      className="group block overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card transition-shadow duration-300 ease-soft hover:shadow-soft"
    >
      <PhotoPlaceholder label={trainer.photoLabel} aspect="aspect-[4/5]" />
      <div className="p-6">
        <h3 className="font-display text-xl text-ink-900">{trainer.name}</h3>
        <p className="mb-3 text-sm font-medium text-plum-600">{trainer.role}</p>
        <div className="flex flex-wrap gap-2">
          {trainer.specialties.slice(0, 2).map((s) => (
            <Badge key={s} tone="sand">
              {s}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
