// Status: PLACEHOLDER — no verified/approved client testimonials exist
// yet for this section (homepage architecture #6, "Real Client Stories").
//
// The New Website Master Reference §11 gives three EXAMPLES of desired
// emotional tone ("I feel stronger than I have in years," "I didn't
// think I could do some of the things I'm doing now," "I wish I had
// started sooner") but explicitly labels them "examples of tone—not
// approved testimonials." They must NOT be published as real quotes.
//
// Do not fill these in without a verified, permitted client quote — see
// docs/CONTENT-STATUS.md for the existing legacy-testimonial
// verification/permission register this should feed into.

export type Testimonial = {
  slug: string;
  quote: string;
  context: string;
  photoLabel: string;
};

export const testimonials: Testimonial[] = [
  {
    slug: "client-one",
    quote: "[VERIFIED CLIENT TESTIMONIAL NEEDED]",
    context: "[CONFIRM CLIENT NAME/CONTEXT, WITH PERMISSION]",
    photoLabel: "Client photo needed (with permission)",
  },
  {
    slug: "client-two",
    quote: "[VERIFIED CLIENT TESTIMONIAL NEEDED]",
    context: "[CONFIRM CLIENT NAME/CONTEXT, WITH PERMISSION]",
    photoLabel: "Client photo needed (with permission)",
  },
  {
    slug: "client-three",
    quote: "[VERIFIED CLIENT TESTIMONIAL NEEDED]",
    context: "[CONFIRM CLIENT NAME/CONTEXT, WITH PERMISSION]",
    photoLabel: "Client photo needed (with permission)",
  },
];
