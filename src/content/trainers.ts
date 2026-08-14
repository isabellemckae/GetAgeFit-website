// Trainer profiles — PROMPT §13.
//
// Names, roles, and credentials below are sourced from the current live
// getagefit.com team roster (docs/CONTENT-STATUS.md → "Legacy Site
// Baseline"), captured August 2026 — this is real, audited content, not
// invented. What's still missing is each trainer's own words: coaching
// philosophy, personal story, and headshot. Those fields stay bracketed
// placeholders until each trainer supplies them — see PROMPT §29's rule
// against fabricating a person's voice or story on their behalf.
//
// ⚠️ CONFIRM before launch: this roster may have changed since capture
// (new hires, departures). Cross-check against the current team page.

export type Trainer = {
  slug: string;
  name: string;
  role: string;
  credentials: string[];
  specialties: string[];
  philosophy: string;
  story: string;
  photoLabel: string;
};

const needsPhilosophy =
  "[INSERT COACHING PHILOSOPHY, IN THIS TRAINER'S OWN WORDS]";
const needsStory = "[INSERT PERSONAL STORY / WHY THEY COACH (VERIFIED)]";

export const trainers: Trainer[] = [
  {
    slug: "james-petersen",
    name: "James Petersen",
    role: "Personal Trainer",
    credentials: ["NASM CPT", "NASM Nutrition Coach", "NASM Senior Fitness Specialist"],
    specialties: ["Balance & core training", "200-hr community yoga training"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "maria-arellano",
    name: "Maria Arellano",
    role: "Personal Trainer",
    credentials: ["CPT", "First Aid/CPR"],
    specialties: ["BS Biology & Spanish", "M.Ed. Education Administration"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "robert-dolan",
    name: "Robert Dolan, MD",
    role: "Personal Trainer & Physician",
    credentials: ["MD, NYU School of Medicine", "NASM CPT", "NASM Nutrition Coach"],
    specialties: [
      "Strength & cardiovascular health",
      "Clients returning from deconditioning, injury, or illness",
    ],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "paula-jones",
    name: "Paula Jones",
    role: "Personal Trainer",
    credentials: ["NASM CPT"],
    specialties: ["NFF Figure Competitor", "British Horse Society Instructor"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "chip-collerain",
    name: "Chip Collerain",
    role: "Personal Trainer",
    credentials: ["CPT", "BS Mechanical Engineering"],
    specialties: ["Sustainable, doable lifestyle change"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "isa-lozano",
    name: "Isa Lozano",
    role: "Personal Trainer",
    credentials: ["CPT", "Certified Behavior Change Specialist"],
    specialties: [
      "Sustainable body recomposition",
      "Healthy relationship with fitness & nutrition",
    ],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "tish-strandboge",
    name: "Tish Strandboge",
    role: "Personal Trainer",
    credentials: ["BA English", "CPT", "Certified Nutrition Coach", "GGS Menopause Coaching Specialist"],
    specialties: ["Menopause & midlife coaching"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "robin-winkles",
    name: "Robin Winkles",
    role: "Personal Trainer",
    credentials: ["BA Health Education", "Athletic Training (minor)", "CPT", "Nutrition Coach"],
    specialties: ["Physical-therapy background"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "christy-wall",
    name: "Christy Wall",
    role: "Personal Trainer",
    credentials: ["NASM CPT"],
    specialties: ["Older-adult training", "Cardiovascular health", "Nutrition"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "neon-luong",
    name: "Neon Luong",
    role: "Personal Trainer",
    credentials: ["BS Kinesiology", "CPT"],
    specialties: ["Body recomposition", "Hypertrophy & performance"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "jeff-venditte",
    name: "Jeff Venditte",
    role: "Personal Trainer",
    credentials: ["CPT", "CPR/AED", "NASM Corrective Exercise Specialization"],
    specialties: ["Corrective exercise"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "will-roberts",
    name: "Will Roberts",
    role: "Fitness Coach",
    credentials: ["18+ years coaching experience"],
    specialties: ["Athletes through older adults", "Post-physical-therapy training"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "keith-stolle",
    name: "Keith Stolle",
    role: "Personal Trainer",
    credentials: ["BA Healthcare Administration", "CPT"],
    specialties: ["GetAgeFit transformation graduate turned trainer"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "ali-tabei",
    name: "Ali Tabei",
    role: "Personal Trainer",
    credentials: ["Fitness Specialist", "Senior Fitness Specialist", "TRX Trainer", "Strength & Conditioning Coach"],
    specialties: ["Bodybuilding & fitness background"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "tracie-stolle",
    name: "Tracie Stolle",
    role: "Personal Trainer",
    credentials: ["CPT"],
    specialties: ["Flexible training", "Time under tension", "Clients 19–85+"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "travis-strawser",
    name: "Travis Strawser",
    role: "Personal Trainer",
    credentials: ["BS Business Administration (Marketing)", "NASM CPT", "Certified Massage Therapist", "Certified Stretch Coach"],
    specialties: ["Massage & stretch-assisted recovery"],
    philosophy: needsPhilosophy,
    story: needsStory,
    photoLabel: "Trainer photo needed",
  },
];

// Homepage preview shows a handful of trainers, not the full roster.
export const featuredTrainerSlugs = ["james-petersen", "robert-dolan", "isa-lozano"];
