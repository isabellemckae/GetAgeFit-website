// Trainer profiles — PROMPT §13.
//
// ⚠️ CONTENT REQUIRED: no verified trainer bios, credentials, or photos were
// supplied. The entries below are structural placeholders only — every
// bracketed field must be replaced with confirmed information before
// launch. Do not treat any name, credential, or quote here as real.

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

export const trainers: Trainer[] = [
  {
    slug: "trainer-one",
    name: "[CONFIRM TRAINER NAME]",
    role: "[CONFIRM ROLE, e.g. Founder & Head Coach]",
    credentials: ["[CONFIRM TRAINER CREDENTIAL]"],
    specialties: ["[CONFIRM SPECIALTY]", "[CONFIRM SPECIALTY]"],
    philosophy: "[INSERT COACHING PHILOSOPHY — VERIFIED, IN TRAINER'S VOICE]",
    story: "[INSERT PERSONAL STORY / WHY THEY COACH — VERIFIED]",
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "trainer-two",
    name: "[CONFIRM TRAINER NAME]",
    role: "[CONFIRM ROLE]",
    credentials: ["[CONFIRM TRAINER CREDENTIAL]"],
    specialties: ["[CONFIRM SPECIALTY]", "[CONFIRM SPECIALTY]"],
    philosophy: "[INSERT COACHING PHILOSOPHY — VERIFIED, IN TRAINER'S VOICE]",
    story: "[INSERT PERSONAL STORY / WHY THEY COACH — VERIFIED]",
    photoLabel: "Trainer photo needed",
  },
];
