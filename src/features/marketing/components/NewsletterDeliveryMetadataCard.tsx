import { Card } from "../../../components/Card";
import { Avatar } from "../../../components/Avatar";
import type { NewsletterPreviewData } from "../newsletterPreviewData";

type NewsletterDeliveryMetadataCardProps = Pick<
  NewsletterPreviewData,
  "fromName" | "fromEmail" | "toLabel" | "toEmail" | "subject" | "preheader"
>;

export function NewsletterDeliveryMetadataCard({
  fromName,
  fromEmail,
  toLabel,
  toEmail,
  subject,
  preheader,
}: NewsletterDeliveryMetadataCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-label text-text-muted">Delivery Metadata</h3>
      <div className="flex flex-col gap-1">
        <span className="text-label text-text-muted">From</span>
        <span className="flex items-center gap-2 text-sm text-text">
          <Avatar name="KiaRelay" size="sm" />
          {fromName}
        </span>
        <span className="text-xs text-text-muted">{fromEmail}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label text-text-muted">To (Audience)</span>
        <span className="w-fit rounded-full bg-bg px-2.5 py-1 text-xs font-medium text-text">{toLabel}</span>
        <span className="text-xs text-text-muted">{toEmail}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label text-text-muted">Subject Line</span>
        <span className="text-sm font-medium text-text">{subject}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label text-text-muted">Preheader Text</span>
        <span className="text-sm text-text-muted">{preheader}</span>
      </div>
    </Card>
  );
}
