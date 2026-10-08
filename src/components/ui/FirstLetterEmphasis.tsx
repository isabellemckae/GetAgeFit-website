/**
 * Client-requested hero typography treatment (Oct 2026 master prompt,
 * Task 5): every word appears uppercase, with each word's first letter
 * rendered about 2pt larger than the rest of that word — e.g. the "P" in
 * "Personal" slightly larger than "ersonal", not a decorative drop cap.
 *
 * Source text stays natural-case; `uppercase` is applied as a CSS
 * text-transform rather than literal capital letters in the DOM, so a
 * screen reader's pronunciation is unaffected by this purely visual
 * treatment. The decorative per-word/per-letter markup is also
 * aria-hidden, with a plain-text `sr-only` twin carrying the real
 * accessible name — belt-and-suspenders so this is never read
 * letter-by-letter, regardless of how a given screen reader handles
 * adjacent inline spans.
 *
 * 2pt ≈ 2.6667px (1pt = 4/3px). Expressed as `calc(1em + 2.6667px)` so the
 * bump stays proportionate to whatever font-size is in effect at the
 * current responsive breakpoint, rather than a fixed px value that would
 * look oversized on mobile and undersized on desktop.
 */
const FIRST_LETTER_SIZE = "calc(1em + 2.6667px)";

export function FirstLetterEmphasis({
  text,
  highlightWords = [],
  highlightClassName = "",
}: {
  text: string;
  highlightWords?: string[];
  highlightClassName?: string;
}) {
  const words = text.split(" ");

  return (
    <>
      <span aria-hidden="true" className="uppercase">
        {words.map((word, i) => {
          const isLast = i === words.length - 1;
          const highlighted = highlightWords.includes(word);
          return (
            // The joining space is a sibling of (not nested inside) the
            // whitespace-nowrap span below, so the browser still has a
            // valid line-break opportunity between words on narrow
            // viewports — only each individual word is kept intact.
            <span key={`${word}-${i}`}>
              <span
                className={`whitespace-nowrap ${highlighted ? highlightClassName : ""}`}
              >
                <span style={{ fontSize: FIRST_LETTER_SIZE }}>{word.slice(0, 1)}</span>
                {word.slice(1)}
              </span>
              {!isLast ? " " : ""}
            </span>
          );
        })}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}
