// Resource Center articles — PROMPT §14.
//
// Status: PROPOSED COPY. These articles use general, widely-accepted
// strength-training and healthy-aging guidance — no GetAgeFit-specific
// statistics, client outcomes, or medical claims are made. Before
// publishing, the named GetAgeFit trainer should review each article,
// confirm the byline, and approve the content in their voice.
//
// Content model is intentionally simple (typed sections) so articles are
// easy to review, easy to extend, and render as clean semantic HTML for
// both search engines and AI systems (see PROMPT §14, §15).

export type ArticleSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

export type ArticleFAQ = { question: string; answer: string };

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  authorPlaceholder: string;
  readTime: string;
  publishedLabel: string; // e.g. "Reviewed by the GetAgeFit coaching team"
  sections: ArticleSection[];
  faqs?: ArticleFAQ[];
};

export const articleCategories = [
  "Strength After 40",
  "Healthy Aging",
  "Longevity",
  "Nutrition",
  "Mobility & Balance",
  "Injury-Aware Training",
  "Midlife Fitness",
  "Beginner Guides",
];

export const articles: Article[] = [
  {
    slug: "why-strength-training-matters-after-40",
    title: "Why Strength Training Matters More After 40",
    category: "Strength After 40",
    excerpt:
      "Muscle isn't just about how you look. After 40, it's one of the most important factors in how independently and confidently you move through daily life.",
    authorPlaceholder: "GetAgeFit Coaching Team",
    readTime: "6 min read",
    publishedLabel: "[CONFIRM AUTHOR / REVIEW DATE]",
    sections: [
      {
        type: "p",
        text: "Somewhere around midlife, the goal of exercise quietly changes. It stops being primarily about how you look and starts being about what you can still do — carry the groceries in one trip, get up off the floor without thinking about it, keep up on a hike, play with grandkids without running out of gas.",
      },
      { type: "h2", text: "Strength is a use-it-or-lose-it resource" },
      {
        type: "p",
        text: "Without consistent resistance training, adults tend to lose muscle mass and strength gradually with age. The encouraging news is that this process responds well to training — strength is one of the most trainable qualities at any age, and it's rarely too late to start building it back.",
      },
      {
        type: "p",
        text: "That's the whole idea behind GetAgeFit's approach: strength training isn't a young person's activity you eventually age out of. It's a tool that becomes more valuable, not less, as the years go on.",
      },
      { type: "h2", text: "What strength actually protects" },
      {
        type: "list",
        items: [
          "Independence — the ability to handle daily tasks without assistance",
          "Balance and fall resistance, through stronger legs, hips, and core",
          "Bone-loading activity, which is why resistance training is often recommended alongside cardio",
          "Confidence — knowing your body can do what you ask of it",
        ],
      },
      { type: "h2", text: "You don't need to start heavy — you need to start right" },
      {
        type: "p",
        text: "The biggest risk after 40 usually isn't lifting weights — it's lifting weights with no plan, no progression, and no one watching your form or your history. A program built around your body, adjusted as you go, is what makes strength training both effective and sustainable.",
      },
    ],
    faqs: [
      {
        question: "Is it too late to start strength training in my 50s, 60s, or beyond?",
        answer:
          "Generally, no. Adults who begin resistance training later in life commonly see meaningful strength gains. The right starting point depends on your current ability and health history, which is why an individualized evaluation matters more than a generic program.",
      },
      {
        question: "How is this different from a regular gym membership?",
        answer:
          "A gym gives you access to equipment. Personalized coaching gives you a plan built around your body, your history, and your goals — plus a coach who adjusts it as you progress. That's the core of GetAgeFit's model.",
      },
    ],
  },
  {
    slug: "training-around-injuries-and-limitations",
    title: "Training Around Injuries and Limitations, Not Around Fear",
    category: "Injury-Aware Training",
    excerpt:
      "A previous injury doesn't have to mean the end of strength training. It means training should be adapted — thoughtfully — around your history.",
    authorPlaceholder: "GetAgeFit Coaching Team",
    readTime: "5 min read",
    publishedLabel: "[CONFIRM AUTHOR / REVIEW DATE]",
    sections: [
      {
        type: "p",
        text: "A lot of people arrive at midlife carrying some kind of physical history — a knee that's been operated on, a shoulder that doesn't move like it used to, a back that flares up under the wrong load. Understandably, that history can make the idea of a gym feel intimidating, or even off-limits.",
      },
      {
        type: "p",
        text: "This article is general education, not medical advice. Always follow guidance from your physician or physical therapist regarding any diagnosed condition.",
      },
      { type: "h2", text: "Your history matters — it should shape the plan, not stop it" },
      {
        type: "p",
        text: "The goal of injury-aware training isn't to avoid every movement near a past injury. It's to understand what happened, what you can currently tolerate, and build a program that respects that starting point while still moving you forward.",
      },
      {
        type: "list",
        items: [
          "A thorough intake that accounts for your history and current limitations",
          "Exercise selection and loading that works around — not through — pain",
          "Ongoing communication so the plan adjusts as you do",
          "Coordination with your medical team when appropriate",
        ],
      },
      { type: "h2", text: "What this looks like in practice" },
      {
        type: "p",
        text: "At GetAgeFit, this means programming is never one-size-fits-all. It's built around your body as it is today, with the understanding that 'today' will keep changing — hopefully for the better — as you get stronger and more capable.",
      },
    ],
    faqs: [
      {
        question: "Do I need medical clearance before starting?",
        answer:
          "If you have a diagnosed condition or recent injury, it's wise to check with your physician or physical therapist before beginning a new training program. Bring what you know to your consultation so your coach can plan around it.",
      },
      {
        question: "Can training help me return to activities I've given up?",
        answer:
          "Many clients come to GetAgeFit hoping to return to hiking, golf, travel, or simply moving without discomfort. Coaches build toward those goals gradually and specifically — but individual outcomes vary and aren't guaranteed.",
      },
    ],
  },
  {
    slug: "protein-and-nutrition-basics-for-healthy-aging",
    title: "Protein and Nutrition Basics for Healthy Aging",
    category: "Nutrition",
    excerpt:
      "Nutrition doesn't need to be complicated to support your training. A few consistent habits go a long way — starting with enough protein.",
    authorPlaceholder: "GetAgeFit Coaching Team",
    readTime: "5 min read",
    publishedLabel: "[CONFIRM AUTHOR / REVIEW DATE]",
    sections: [
      {
        type: "p",
        text: "As we age, the body becomes somewhat less efficient at using protein to build and maintain muscle — which means getting enough of it, consistently, matters more than it did at 25.",
      },
      { type: "h2", text: "A few practical habits" },
      {
        type: "list",
        items: [
          "Include a protein source at each meal rather than saving it all for dinner",
          "Pair protein intake with your strength training days for best effect",
          "Stay ahead of hydration — thirst becomes a less reliable signal with age",
          "Favor consistency over perfection; a sustainable pattern beats a strict short-term plan",
        ],
      },
      { type: "h2", text: "Why this is part of the GetAgeFit experience" },
      {
        type: "p",
        text: "Training builds the stimulus for your body to get stronger. Nutrition provides the raw material to actually make that adaptation happen. That's why nutrition counseling is built into the coaching experience rather than treated as a separate add-on.",
      },
      {
        type: "p",
        text: "This is general nutrition education, not a substitute for individualized medical or dietetic advice — particularly if you manage a condition like diabetes or kidney disease.",
      },
    ],
  },
  {
    slug: "balance-and-mobility-training-for-fall-prevention",
    title: "Balance and Mobility Training: An Underrated Part of Independence",
    category: "Mobility & Balance",
    excerpt:
      "Strength gets most of the attention, but balance and mobility work is what keeps that strength usable in real life.",
    authorPlaceholder: "GetAgeFit Coaching Team",
    readTime: "4 min read",
    publishedLabel: "[CONFIRM AUTHOR / REVIEW DATE]",
    sections: [
      {
        type: "p",
        text: "It's easy to think of balance training as separate from 'real' strength training. In practice, the two reinforce each other — stronger hips and legs give your balance system more to work with, and better balance lets you train strength more confidently.",
      },
      { type: "h2", text: "What good balance and mobility work includes" },
      {
        type: "list",
        items: [
          "Single-leg strength and stability work",
          "Controlled range-of-motion work for hips, ankles, and shoulders",
          "Coordination and reaction-based movement, progressed gradually",
          "Consistent practice — balance is a skill, and skills fade without use",
        ],
      },
      {
        type: "p",
        text: "Woven into a broader strength program, this kind of work supports steadier movement in daily life — stairs, uneven ground, getting up from low chairs — the ordinary moments where confidence and capability matter most.",
      },
    ],
  },
  {
    slug: "what-to-expect-at-your-first-consultation",
    title: "What to Expect at Your GetAgeFit Consultation",
    category: "Beginner Guides",
    excerpt:
      "Curious what actually happens at a consultation? Here's a straightforward look at the process, so you know exactly what you're walking into.",
    authorPlaceholder: "GetAgeFit Coaching Team",
    readTime: "4 min read",
    publishedLabel: "[CONFIRM AUTHOR / REVIEW DATE]",
    sections: [
      {
        type: "p",
        text: "A lot of people put off starting simply because they don't know what the first step looks like. At GetAgeFit, the first step is a consultation — a conversation, not a sales pitch and not a workout you're unprepared for.",
      },
      { type: "h2", text: "In a consultation, your coach will typically" },
      {
        type: "list",
        items: [
          "Ask about your goals — what 'stronger' or 'more independent' actually means to you",
          "Review your training and injury history",
          "Talk through any current limitations or concerns",
          "Discuss what a personalized coaching experience with GetAgeFit looks like",
          "Explain the investment and answer your questions honestly",
        ],
      },
      { type: "h2", text: "There's no pressure to decide on the spot" },
      {
        type: "p",
        text: "The purpose of the consultation is to determine fit — for you and for GetAgeFit. If it's the right match, your coach will walk you through next steps. If it's not the right time, you'll still leave with clarity.",
      },
    ],
    faqs: [
      {
        question: "How long does a consultation take?",
        answer: "[CONFIRM TYPICAL CONSULTATION LENGTH]",
      },
      {
        question: "What should I bring?",
        answer:
          "Comfortable clothing, any relevant medical or injury history, and a clear sense of what you're hoping to achieve. Your coach will guide the rest.",
      },
    ],
  },
  {
    slug: "strength-training-through-menopause",
    title: "Strength Training Through Menopause: What to Know",
    category: "Midlife Fitness",
    excerpt:
      "Hormonal changes during menopause affect strength, body composition, and recovery — which makes this exactly the season to lean into resistance training, not away from it.",
    authorPlaceholder: "GetAgeFit Coaching Team",
    readTime: "5 min read",
    publishedLabel: "[CONFIRM AUTHOR / REVIEW DATE]",
    sections: [
      {
        type: "p",
        text: "Menopause brings real, well-documented changes — shifts in body composition, sleep, energy, and recovery among them. Many women notice that what used to work for their body doesn't work quite the same way anymore. That's a normal response to a real transition, not a sign that something is wrong with your effort.",
      },
      { type: "h2", text: "Why resistance training is often emphasized during this stage" },
      {
        type: "p",
        text: "Consistent strength training supports lean muscle mass and is commonly recommended alongside weight-bearing activity as part of a bone-supportive routine. It's one of the few variables in this transition that responds directly to consistent effort.",
      },
      { type: "h2", text: "What we'd emphasize in coaching" },
      {
        type: "list",
        items: [
          "Adjusting programming for changes in recovery, not fighting against them",
          "Prioritizing consistency over intensity spikes",
          "Pairing training with practical nutrition guidance",
          "Tracking progress with objective measures, like InBody scans, rather than relying on the scale alone",
        ],
      },
      {
        type: "p",
        text: "This is general educational content. For guidance specific to your health history, talk with your physician.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}
