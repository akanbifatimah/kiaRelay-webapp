import { useEffect, useState } from "react";
import { cn } from "../../../lib/cn";
import { ONBOARDING_SLIDES } from "../onboardingSlides";

const SLIDE_MS = 6000;

// The mobile onboarding, as the web's side panel: one slide at a time,
// auto-advancing, with clickable dots. A dot click restarts the timer on
// the chosen slide.
// Layout (2026-09-30, user request): the photo area runs full width, edge to
// edge like mobile's full-bleed first slide, and takes whatever height is left
// after the text. The panel is locked to the viewport height, so nothing
// overflows.
export function OnboardingCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIndex((i) => (i + 1) % ONBOARDING_SLIDES.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index]);

  const slide = ONBOARDING_SLIDES[index];
  return (
    <div className="flex h-full flex-col">
      {/* 2026-09-30: the photos are square but this area rarely is, so
          object-cover cropped their tops. The whole photo now shows
          (object-contain) over a blurred, enlarged copy of itself that fills
          the rest — still edge to edge, never cropped. */}
      <div key={slide.image} className="relative min-h-0 flex-1 animate-fade-in overflow-hidden rounded-b-4xl">
        <img src={slide.image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl" />
        <img src={slide.image} alt="" className="relative h-full w-full object-contain" />
      </div>
      <div className="flex shrink-0 flex-col gap-5 px-10 pb-10 pt-8 xl:px-14">
        <div key={slide.title} className="min-h-32 animate-fade-in">
          <h2 className="text-2xl font-bold text-white xl:text-3xl">{slide.title}</h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-white/75">{slide.body}</p>
        </div>
        <div className="flex items-center gap-2" role="tablist" aria-label="Why KiaRelay">
          {ONBOARDING_SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={s.title}
              onClick={() => setIndex(i)}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-8 bg-primary" : "w-1.5 bg-white/30 hover:bg-white/50")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
