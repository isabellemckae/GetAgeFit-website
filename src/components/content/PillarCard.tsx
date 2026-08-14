import { Pillar } from "@/content/pillars";

export function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  return (
    <div className="group rounded-xl2 border border-ink-100 bg-white p-7 shadow-card transition-shadow duration-300 ease-soft hover:shadow-soft">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-sm font-semibold text-sage-800">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-xl text-ink-900">{pillar.name}</h3>
      </div>
      <p className="mb-2 font-semibold text-ink-800">{pillar.headline}</p>
      <p className="text-[0.95rem] leading-relaxed text-ink-500">
        {pillar.description}
      </p>
    </div>
  );
}
