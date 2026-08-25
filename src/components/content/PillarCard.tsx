import { Pillar } from "@/content/pillars";

export function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  const isAccent = index % 2 === 1;
  return (
    <div className="group relative overflow-hidden rounded-xl2 border border-ink-100 bg-white p-7 shadow-card transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-soft">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
          isAccent ? "from-plum-500 to-plum-700" : "from-sage-500 to-sage-700"
        }`}
      />
      <div className="mb-5 flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
            isAccent ? "bg-plum-100 text-plum-700" : "bg-sage-100 text-sage-800"
          }`}
        >
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
