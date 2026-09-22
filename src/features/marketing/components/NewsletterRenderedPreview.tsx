import { Truck, Share2 } from "lucide-react";
import type { NewsletterPreviewData } from "../newsletterPreviewData";
import { MessageBlocks } from "./MessageBlocks";

type NewsletterRenderedPreviewProps = Pick<
  NewsletterPreviewData,
  "heroHeadline" | "greeting" | "intro" | "calloutTitle" | "calloutText" | "subheading" | "subheadingText" | "ctaLabel" | "heroImageUrl"
>;

// The rendered newsletter — hero image with an overlaid headline (distinct
// from EmailRenderedPreview's separate black banner + headline), a callout
// box, a bold subheading, CTA, and a small footer with a share icon.
export function NewsletterRenderedPreview({
  heroHeadline,
  greeting,
  intro,
  calloutTitle,
  calloutText,
  subheading,
  subheadingText,
  ctaLabel,
  heroImageUrl,
}: NewsletterRenderedPreviewProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="relative h-40 w-full">
        <img src={heroImageUrl ?? "/Email Hero Image.svg"} alt="" className="h-full w-full object-cover object-top" />
        <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 bg-black/80 px-4 py-2 text-sm font-bold text-white">
          <Truck className="h-3.5 w-3.5" />
          KiaRelay
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8">
          <h2 className="text-lg font-bold text-white">{heroHeadline}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6">
        <p className="text-sm font-medium text-text">{greeting}</p>
        <MessageBlocks message={intro} />
        <div className="flex flex-col gap-1.5 border-l-4 border-primary bg-bg px-4 py-3">
          <p className="text-sm font-semibold text-text">{calloutTitle}</p>
          <p className="text-sm text-text-muted">{calloutText}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-text">{subheading}</p>
          <p className="text-sm leading-relaxed text-text-muted">{subheadingText}</p>
        </div>
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="inline-block w-fit rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          {ctaLabel}
        </a>
      </div>
      <div className="flex flex-col items-center gap-1 border-t border-border p-4 text-center text-xs text-text-muted">
        <Share2 className="h-3.5 w-3.5" />
        <span>KiaRelay Operations Command</span>
        <span>100 Logistics Way, Suite 400, Chicago, 60607</span>
        <span>
          <button type="button" className="font-medium hover:underline">Unsubscribe</button>
          {" | "}
          <button type="button" className="font-medium hover:underline">Privacy Policy</button>
        </span>
      </div>
    </div>
  );
}
