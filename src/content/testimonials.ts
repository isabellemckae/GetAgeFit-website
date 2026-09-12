// Five real, approved GetAgeFit client testimonials (homepage architecture
// #6, "Real Client Stories"). Quotes are verbatim as supplied — do not
// rewrite or paraphrase them. This section is deliberately 100%
// typographic (Demo #5 redesign) — no client photos, placeholders, or
// avatars of any kind, so there is no image field on this type at all.

export type Testimonial = {
  slug: string;
  quote: string;
  context: string;
};

export const testimonials: Testimonial[] = [
  {
    slug: "carol-dodds",
    quote:
      "I have battled my weight for most of my adult life (I'm 61 yrs.). My workout today was amazing. My trainer is patient and caring and is pushing me to do my best. Theo and all the staff seem to do the same. Can't wait to get the results I have longed for thru age appropriate work outs and right nutrition in a beautiful environment. Here we go!!",
    context: "Carol Dodds",
  },
  {
    slug: "j-bryant-boyd",
    quote:
      "I've been training at Get Age Fit since February 2024, and the results have been remarkable. My trainer pushes us to work hard but always within our abilities, ensuring every workout is both challenging and safe. I'm now stronger and in better shape than I've been in decades! After undergoing total knee replacement surgery in December 2024, the team tailored my training to support my recovery. Thanks to their expertise and encouragement, I've regained full strength and stability — I actually feel more confident on that knee than I have in years. My wife and I train together, and our sessions have become a fun, motivating, and even a little competitive part of our week.",
    context: "J. Bryant Boyd",
  },
  {
    slug: "leann-murphy",
    quote:
      "Great environment with knowledgeable, encouraging trainers and well-maintained equipment. Look forward to going, even on \"leg\" day. Feel like I'm stronger physically and mentally since starting training here months ago. Not to mention my clothes fit so much better.",
    context: "Leann Murphy",
  },
  {
    slug: "mike-williams",
    quote:
      "We left GetAgeFit with the tools, knowledge, and confidence to continue training on our own. GetAgeFit isn't just about lifting weights or counting calories — it's about learning how your body works and how to keep improving as you age. Theo and his team of trainers truly care about their clients' success and overall quality of life. We highly recommend GetAgeFit to anyone looking to transform not just their body, but their entire approach to health and longevity.",
    context: "Mike Williams",
  },
  {
    slug: "andrea-morales",
    quote:
      "My husband and I have been training here for more than three months now. We absolutely love it. It is a true first class gym experience. The facility is pristine, with an abundance of well-maintained equipment. We love that our trainer pushes us hard but it's always done in a safe way. We both comment all the time that if we were working out at home, there's no way we would push ourself in the same way. Overall, you can tell that the owner, Theo, and his team all are really kind people who care and just want to make us all a little healthier and live longer, stronger lives. I'm very grateful to have found this place!",
    context: "Andrea Morales",
  },
];
