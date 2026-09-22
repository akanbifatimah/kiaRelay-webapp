import { useWatch, type Control } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/Card";
import type { CreateNewsletterFormValues } from "../createNewsletterForm";

interface NewsletterContentPreviewCardProps {
  control: Control<CreateNewsletterFormValues>;
}

// A live, miniature preview of the newsletter being composed — reuses the
// same hero image as EmailRenderedPreview at a smaller scale. No screenshot
// shows a dedicated "Preview" button on this page, so clicking the thumbnail
// itself opens the full NewsletterPreviewPage — the natural "expand" action
// for a preview-of-a-preview.
export function NewsletterContentPreviewCard({ control }: NewsletterContentPreviewCardProps) {
  const navigate = useNavigate();
  const headline = useWatch({ control, name: "headline" });
  const message = useWatch({ control, name: "message" });
  const internalName = useWatch({ control, name: "newsletterName" });
  const subject = useWatch({ control, name: "subject" });
  const headerImageUrl = useWatch({ control, name: "headerImageUrl" });

  function openFullPreview() {
    navigate("/marketing/newsletters/draft/preview", {
      state: { internalName: internalName || subject, subject, heroHeadline: headline, intro: message, heroImageUrl: headerImageUrl },
    });
  }

  return (
    <Card className="flex flex-col gap-2 p-3">
      <h3 className="text-sm font-semibold text-text">Content Preview</h3>
      <button type="button" onClick={openFullPreview} className="overflow-hidden rounded-md border border-border text-left hover:opacity-90">
        <img src={headerImageUrl ?? "/Email Hero Image.svg"} alt="" className="h-16 w-full object-cover object-top" />
        <div className="flex flex-col gap-1.5 p-3">
          <p className="text-xs font-semibold text-text">{headline}</p>
          <p className="line-clamp-3 text-[10px] leading-snug text-text-muted">{message}</p>
          <span className="mt-1 block rounded bg-bg py-1.5 text-center text-[10px] font-medium text-text-muted">View Full Report</span>
        </div>
      </button>
    </Card>
  );
}
