// The mobile app's four onboarding slides (Figma "Onboarding 1–4"), shown on
// the web as the rotating panel beside registration. The copy is word-for-word
// the same as kiarelay-customer-mobile/src/constants/onboarding.ts, and the
// images are the same extracted WebPs, served from public/business/.
export const ONBOARDING_SLIDES = [
  {
    title: "Send anything, anywhere",
    body: "From pipe fittings to medical supplies. One platform for every industry across Texas, Louisiana, and beyond.",
    image: "/business/onboarding-industries.webp",
  },
  {
    title: "Track in real time",
    body: "Watch your delivery move on the map. Get live ETAs, driver updates, and proof of delivery the moment it happens.",
    image: "/business/onboarding-tracking.webp",
  },
  {
    title: "Built for your industry",
    body: "Hazmat-aware drivers. HIPAA-compliant handling. Cold-chain tracking. Dimension and weight-based pricing that makes sense.",
    image: "/business/onboarding-expertise.webp",
  },
  {
    title: "Book in seconds",
    body: "Enter pickup and drop-off. Add package details. Choose Standard, Express, or Scheduled. See your price instantly. Book and relax.",
    image: "/business/onboarding-booking.webp",
  },
];
