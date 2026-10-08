// FAQ content — approved copy, sourced verbatim from Theo Thurston's two
// FAQ emails dated October 7, 2026 ("FREQUENTLY ASKED QUESTIONS for new
// website page" and the follow-up "FAQ - Corrections + more Q & A =>").
// Replaces the earlier PROPOSED COPY placeholder set. Content is preserved
// as supplied: no pricing figures, policies, or amenities were added or
// invented beyond what these emails state. Only light spelling/branding
// cleanup was applied (consistent "GetAgeFit" capitalization matching the
// rest of the site, a few stray mid-sentence capitals normalized) — no
// business meaning was changed. Where the second email explicitly
// superseded the first (the missed/rolled-over sessions policy, Q13),
// that corrected wording is used here, not any earlier draft.
//
// Studio hours (Q12) corrected Saturday open time (6:00 AM, not 7:00 AM)
// against this same source — see src/lib/site-config.ts, updated to match.

export type FAQEntry = {
  question: string;
  answer: string;
};

export const faqs: FAQEntry[] = [
  {
    question: "What makes the GetAgeFit experience different?",
    answer:
      "We believe getting stronger should be one of the most positive parts of your day. Our 8,000-square-foot private studio in Georgetown is designed for adults over 40 who appreciate expert guidance, personal attention, and a comfortable, uncrowded atmosphere.\n\nJust as important is the culture we share. Love, joy, and gratitude are at the heart of how we treat one another. You can expect a genuine welcome, thoughtful encouragement, and professional, attentive service from people who care about you as a person, not just your workout.\n\nWe want you to leave each visit feeling stronger, more confident, and glad you came.",
  },
  {
    question: "What should I expect when I come in for a consultation?",
    answer:
      "We offer a complimentary two-part experience so you can first understand the nuts and bolts of the program, then experience what it feels like to train at GetAgeFit before making a decision.\n\nYour first visit is a relaxed introduction to our studio and programs. On another day, you can enjoy a complimentary personal training session and experience the training firsthand.",
  },
  {
    question: "What happens during my initial consultation?",
    answer:
      "We'll show you around the studio, review a brief health history form, and talk about your goals, concerns, and any injuries or physical limitations.\n\nThen we'll explain our age-appropriate strength training approach, along with our nutrition and cardiovascular guidance.\n\nIf the overview makes sense to you, we will schedule your complimentary training session on a different day.\n\nYour first visit is purely informational. No exercise or workout clothes required. Come as you are and bring your questions!",
  },
  {
    question: "What happens during my complimentary training session?",
    answer:
      "On a separate day, you'll train with one of our certified personal trainers and see what our unique, age-appropriate training feels like.\n\nYour trainer will tailor the experience to your current abilities and explain how exercises can be adjusted to suit your needs.\n\nWhether you're already active or haven't exercised in years, we'll meet you where you are.",
  },
  {
    question: "When do we discuss training options and rates?",
    answer:
      "During your first visit, we'll explain how our program works.\n\nThe initial presentation provides enough information to decide whether you'd like to schedule your complimentary training session on a different day. However, the best way to understand the training experience is to try it.\n\nAfter your complimentary training session, we'll thoroughly explain the training options, schedules, and rates, and answer any remaining questions.\n\nThere's absolutely no pressure to enroll. If it feels right, we'd love to welcome you. If not, no problem!",
  },
  {
    question: "Can you give me an idea of your rates?",
    answer:
      "We offer a highly personalized experience, and we believe the overall value matters just as much as the session rate.\n\nWe'll review specific packages and pricing with you after you complete your complimentary training session.\n\nYour personal training package includes more than guided strength workouts: personalized nutrition and cardio guidance, InBody body composition scans, access to cardio equipment, secure studio access during designated hours, pre-workout beverages, bottled water, post-workout protein drinks, and towel service.\n\nThere is no separate gym membership fee for these included amenities.",
  },
  {
    question: "If I decide to join, how is my trainer selected?",
    answer:
      "You get to choose!\n\nTell us the days and times that work best for you, and we'll share the trainers available during those windows, along with a link to their biographies.\n\nYou can learn about their experience, credentials, and backgrounds.\n\nIf you'd like a recommendation, we're always happy to help you find a great fit.",
  },
  {
    question: "Will I work with the same trainer each session?",
    answer:
      "Yes. Consistency helps your trainer get to know your strengths, limitations, and progress, so each session can build on the last.\n\nIf your regular trainer is occasionally unavailable, we can help arrange a session with another qualified trainer.",
  },
  {
    question: "I haven't exercised in years. Is GetAgeFit right for me?",
    answer:
      "Absolutely. You don't need to get in shape before you start. That's what we're here to help you do!\n\nMany clients begin after a long break from regular exercise. We'll tailor your training to your starting point and help you progress at a comfortable, appropriate pace.",
  },
  {
    question: "What if I have joint pain, an old injury, or physical limitations?",
    answer:
      "We'll take time to understand your concerns and adjust exercises where appropriate, with an emphasis on good technique, controlled movement, and gradual progress.\n\nIf needed, we may ask you to check with your healthcare provider before starting.\n\nYour comfort and safety matter to us.",
  },
  {
    question: "Can my spouse or a friend train with me?",
    answer:
      "Yes! Many clients enjoy training with a spouse, partner, or friend.\n\nYour trainer can adapt the session to each person's fitness level and goals.\n\nAsk us about couples training options and any current special offers.",
  },
  {
    question: "What are your studio hours?",
    answer:
      "Monday–Friday: 5:00 AM–8:00 PM\nSaturday: 6:00 AM–4:00 PM\n\nWe offer early morning, daytime, and evening appointments to help training fit your life.",
  },
  {
    question: "What if I travel, get sick, or miss sessions? Do I lose them?",
    answer:
      "No. Any unused sessions in your package of 8 or 12 sessions simply roll over rather than expiring at the end of each calendar month.\n\nIf you take time away, your unused sessions remain available when you return. There's no need to freeze a monthly membership.\n\nWe do ask for at least 24 hours' notice when canceling a scheduled appointment because your trainer has reserved that time especially for you.",
  },
  {
    question: "Can I come in and lift weights on my own?",
    answer:
      "Strength training at GetAgeFit takes place with a certified personal trainer.\n\nWe intentionally don't offer self-directed weight-training memberships, which helps us preserve the personal attention and uncrowded atmosphere our clients enjoy.\n\nMembers are welcome to use our cardiovascular equipment independently.",
  },
  {
    question: "Do I pay in full at the beginning?",
    answer:
      "No, you do not have to pay in full at the beginning.\n\nAlthough we have found that it takes at least a structured 12-week program, consisting of 24 or 36 sessions, to see meaningful results, you are only obligated to an 8- or 12-session payment at a time.\n\nThose results may include body recomposition, improved medical markers, better balance, regained strength, greater bone density, and improved everyday function.\n\nThere are no long-term contracts, and you can discontinue at the conclusion of each 8- or 12-session package.\n\nWe believe in providing exceptional service, not locking someone into a long-term obligation. It's completely up to you if you would like to continue.",
  },
  {
    question:
      "What are my options after completing the initial 12-week transformation program?",
    answer:
      "After completing your 12-week transformation, it's a great time to reflect on your progress and decide where you'd like to go next.\n\nThis isn't the end. It's the beginning of maintaining a stronger, healthier, and more capable you!\n\nYou have several options. Your trainer can provide copies of your workout sheets in a personalized binder so you can continue training independently at another gym.\n\nMany clients choose to continue working with their trainer for another 12 weeks, and some continue for months or years.\n\nYou can also transition from three sessions per week to two maintenance sessions per week, or reduce 60-minute sessions to 45-minute sessions. We're happy to accommodate the approach that works best for you.\n\nYou don't need to decide now. Once you've completed your first 12-week transformation, you'll have a much clearer picture of how you'd like to continue.",
  },
];
