// Status: VERIFIED / APPROVED — verbatim from the New Website Master
// Reference §6, "Core Messaging Architecture" (homepage architecture #4:
// GET STRONG / GET HEART HEALTHY / GET STEADY / GET YOUR LIFE BACK).
// Supersedes Demo #1's 7-pillar TRAIN/FUEL/MOVE/MEASURE/ADAPT/BELONG/
// PROGRESS model (src/content/pillars.ts), which is preserved but retired
// from active use per the approved Demo #2 decisions.

export type Outcome = {
  anchor: string;
  description: string;
};

export const outcomes: Outcome[] = [
  {
    anchor: "GET STRONG.",
    description: "Regain the muscle and strength needed for everyday life.",
  },
  {
    anchor: "GET HEART HEALTHY.",
    description:
      "Build the cardiovascular fitness needed to keep up with life.",
  },
  {
    anchor: "GET STEADY.",
    description: "Improve balance, mobility, and confidence on your feet.",
  },
  {
    anchor: "GET YOUR LIFE BACK.",
    description: "Feel better. Move better. Do more of the things you love.",
  },
];
