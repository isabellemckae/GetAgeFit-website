export function Badge({
  children,
  tone = "sage",
}: {
  children: React.ReactNode;
  tone?: "sage" | "plum" | "sand";
}) {
  const toneClass =
    tone === "sage"
      ? "bg-gradient-to-r from-sage-100 to-sage-50 text-sage-800 border-sage-200"
      : tone === "plum"
        ? "bg-gradient-to-r from-plum-100 to-plum-50 text-plum-700 border-plum-200"
        : "bg-sand-200 text-ink-700 border-sand-300";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}
