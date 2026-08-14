/**
 * Stand-in for real photography. Per brand direction we never substitute
 * generic stock photos or AI-generated fitness imagery — this abstract,
 * on-brand placeholder marks exactly where a real photo belongs so the
 * GetAgeFit team can drop one in without a design conversation.
 */
export function PhotoPlaceholder({
  label,
  aspect = "aspect-[4/5]",
  className = "",
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div className={`photo-placeholder ${aspect} ${className}`} role="img" aria-label={label}>
      <span className="relative z-10 max-w-[80%] text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-700/70">
        {label}
      </span>
    </div>
  );
}
