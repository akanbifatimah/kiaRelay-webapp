import { Card } from "../../../components/Card";
import { Avatar } from "../../../components/Avatar";

interface EmailPreviewHeaderCardProps {
  fromName: string;
  fromEmail: string;
  toLabel: string;
  toEmail: string;
  sentLabel: string;
  subject: string;
}

// The From/To/Subject envelope info shown above the rendered email itself —
// "KiaRelay" collapses to a single-letter "K" avatar since it's one word.
export function EmailPreviewHeaderCard({ fromName, fromEmail, toLabel, toEmail, sentLabel, subject }: EmailPreviewHeaderCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar name="KiaRelay" />
          <div className="text-sm">
            <p className="text-text">
              <span className="font-medium">{fromName}</span> <span className="text-text-muted">&lt;{fromEmail}&gt;</span>
            </p>
            <p className="text-text-muted">
              To: {toLabel} <span>&lt;{toEmail}&gt;</span>
            </p>
          </div>
        </div>
        <span className="whitespace-nowrap text-xs text-text-muted">{sentLabel}</span>
      </div>
      <h1 className="text-base font-semibold text-text">{subject}</h1>
    </Card>
  );
}
