// The Complete Experience — PROMPT §8. One integrated experience, presented
// as seven connected pillars rather than a menu of disconnected services.

export type Pillar = {
  key: string;
  name: string;
  headline: string;
  description: string;
};

export const pillars: Pillar[] = [
  {
    key: "train",
    name: "Train",
    headline: "Personalized strength coaching",
    description:
      "One-on-one and 1:2 strength training, programmed around your body, your history, and your goals — not a generic class plan.",
  },
  {
    key: "fuel",
    name: "Fuel",
    headline: "Nutrition that fits real life",
    description:
      "Practical nutrition counseling that supports your training and your daily life, without rigid rules that don't fit how you actually eat.",
  },
  {
    key: "move",
    name: "Move",
    headline: "Cardio and movement, guided",
    description:
      "Customized cardio and movement strategies that build endurance and mobility alongside strength — set up and adjusted with your coach.",
  },
  {
    key: "measure",
    name: "Measure",
    headline: "Progress you can see",
    description:
      "InBody assessments and ongoing progress tracking, so you and your coach always know what's working and what to adjust.",
  },
  {
    key: "adapt",
    name: "Adapt",
    headline: "Built around your history",
    description:
      "Programming that adapts to injuries, limitations, and ability — your training respects where your body has been.",
  },
  {
    key: "belong",
    name: "Belong",
    headline: "A community that shows up",
    description:
      "A boutique studio built on relationships and service, where trainers and fellow members know your name and your goals.",
  },
  {
    key: "progress",
    name: "Progress",
    headline: "A structured path forward",
    description:
      "A clear, ongoing approach designed to help you get stronger and feel better — month after month, not just for a season.",
  },
];
