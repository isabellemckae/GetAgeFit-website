// FAQ content — new dedicated FAQ page (client-directed).
//
// Status: PROPOSED COPY, written to the business facts already
// established elsewhere in this project (healthy-aging personal training
// in Georgetown, TX; one-on-one and 1:2 coaching; free evaluation and
// consultation as the entry point). No pricing, package details,
// schedules, or medical claims are asserted anywhere below — those
// aren't verified in this project, so the relevant questions are either
// omitted or answered by pointing to the consultation rather than
// guessing. Needs a final review pass from the GetAgeFit team before
// publishing, same as the rest of this project's proposed copy.

export type FAQEntry = {
  question: string;
  answer: string;
};

export const faqs: FAQEntry[] = [
  {
    question: "Am I too old to start strength training?",
    answer:
      "No. GetAgeFit exists specifically for adults 40 to 80 and beyond who want to get stronger, whatever your starting point. Your coach builds your program around where you are today, not where you used to be.",
  },
  {
    question: "Do I need to be in shape before I join?",
    answer:
      "Not at all. Most clients start exactly because they want help getting in shape, not because they already are. You don't need any fitness background to begin.",
  },
  {
    question: "What if I've never worked with a personal trainer before?",
    answer:
      "That's completely normal, and it's exactly what the free evaluation and consultation is for. Your coach will walk you through what coaching actually looks like before you commit to anything.",
  },
  {
    question: "What happens during the free evaluation and consultation?",
    answer:
      "You'll sit down with a coach to talk through your goals, your history, and any concerns, so you both can see whether GetAgeFit is the right fit for you. No cost, no obligation, and no pressure to decide on the spot.",
  },
  {
    question: "Is GetAgeFit a traditional gym?",
    answer:
      "No. We're not a large, crowded commercial gym. GetAgeFit trains out of a studio built around one-on-one and 1:2 coaching, so you're with your trainer the entire session rather than on your own on a gym floor.",
  },
  {
    question: "Will my training program actually be personalized to me?",
    answer:
      "Yes. Your coach builds your program around your goals, your history, and your current ability, not a one-size-fits-all routine. That's the point of coaching instead of a class.",
  },
  {
    question: "Can I train if I have an old injury or a physical limitation?",
    answer:
      "Tell your coach about it during your consultation. Your program is built around your history and current ability, in coordination with your medical guidance where appropriate. We can't diagnose or treat injuries, but we can train around them thoughtfully.",
  },
  {
    question: "I'm nervous about walking into a gym. Is that normal?",
    answer:
      "Very normal, and one of the biggest reasons people choose GetAgeFit. You'll be working one-on-one or 1:2 with your coach in a supportive environment built for adults who feel exactly the way you do right now.",
  },
  {
    question: "Do you offer nutrition guidance along with training?",
    answer:
      "Yes, nutrition guidance is part of the coaching relationship alongside your training program, built around your goals and your life rather than a generic meal plan.",
  },
  {
    question: "Where is GetAgeFit located?",
    answer:
      "GetAgeFit trains out of a flagship studio in Georgetown, Texas.",
  },
];
