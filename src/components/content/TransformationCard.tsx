import { Transformation } from "@/content/transformations";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

export function TransformationCard({ story }: { story: Transformation }) {
  return (
    <article className="overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card">
      <PhotoPlaceholder label={story.photoLabel} aspect="aspect-[16/10]" />
      <div className="p-7">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-sage-700">
          {story.clientName} · Age {story.age}
        </p>
        <p className="mb-4 font-display text-lg text-ink-900">{story.goal}</p>
        <dl className="mb-5 space-y-3 text-sm text-ink-500">
          <div>
            <dt className="font-semibold text-ink-700">Starting point</dt>
            <dd>{story.startingPoint}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink-700">Approach</dt>
            <dd>{story.approach}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink-700">Outcome</dt>
            <dd>{story.outcome}</dd>
          </div>
        </dl>
        <blockquote className="border-l-2 border-plum-300 pl-4 font-display italic text-ink-700">
          “{story.quote}”
        </blockquote>
      </div>
    </article>
  );
}
