export function Badge({
  children,
  tone = "sage",
}: {
  children: React.ReactNode;
  tone?: "sage" | "plum" | "sand";
}) {
  const toneClass =
    tone === "sage"
      ? "bg-sage-100 text-sage-800"
      : tone === "plum"
        ? "bg-plum-100 text-plum-700"
        : "bg-sand-200 text-ink-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}
