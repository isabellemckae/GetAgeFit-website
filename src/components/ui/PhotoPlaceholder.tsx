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
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <span className="photo-placeholder-mark">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 17L10 11L14 15L20 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-sand-50"
            />
            <path
              d="M14 7H20V13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-sand-50"
            />
          </svg>
        </span>
        <span className="max-w-[80%] text-xs font-semibold uppercase tracking-[0.14em] text-sand-50/80">
          {label}
        </span>
      </div>
    </div>
  );
}
