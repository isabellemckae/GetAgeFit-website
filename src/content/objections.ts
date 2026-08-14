// Status: MIXED.
// Questions are VERIFIED / APPROVED verbatim from the New Website Master
// Reference §11, "Thinking About Getting Started?" (homepage architecture
// #7). Answers are PROPOSED COPY — the source document directs that
// answers be "short, reassuring, and human" but does not supply approved
// answer text itself, so these are drafted to that brief and need
// review/approval before publishing. No facts, stats, or credentials are
// asserted in any answer below. See docs/CONTENT-STATUS.md.
//
// Answers were tightened in the Phase 4 editorial reduction pass (cuts
// only — no new claims added; since these were always mine, not
// verbatim-approved text, they carried the most editorial latitude on
// the page). Original wording is in git history (Phase 3 commit) if a
// reviewer wants to compare.
//
// The closing line and CTA support text ARE approved verbatim (§11) and
// are exported separately so the CTA itself (button + support line) can
// be composed from the shared CTA copy wired up in site-config.ts.

export type Objection = {
  question: string;
  answer: string;
};

export const objections: Objection[] = [
  {
    question: "What if I’m out of shape?",
    answer: "You don’t need to be ready, you just need to be willing.",
  },
  {
    question: "What if I have an old injury?",
    answer: "Tell your trainer about it. Your plan gets built around it.",
  },
  {
    question: "What if I’ve never lifted weights?",
    answer:
      "Most of our clients hadn’t either. You’ll be shown exactly what to do.",
  },
  {
    question: "What if I’m nervous about walking into a gym?",
    answer: "That’s normal. You’ll be greeted by a person.",
  },
  {
    question: "What if I’m not sure it’s right for me?",
    answer: "No pressure, no commitment, just a conversation.",
  },
];

// Approved verbatim (§11)
export const objectionsClosing = "Come see what Get Age Fit is all about.";
