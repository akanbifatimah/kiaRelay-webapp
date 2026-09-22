import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { MessageBlocks } from "./MessageBlocks";

interface TemplatePreviewModalProps {
  headline: string;
  subtitle: string;
  message: string;
  onClose: () => void;
}

// Real preview — was a toast saying "coming soon". Renders the template's
// own fields through MessageBlocks, the same renderer used everywhere else
// this app shows a formatted message.
export function TemplatePreviewModal({ headline, subtitle, message, onClose }: TemplatePreviewModalProps) {
  return (
    <Modal title="Template Preview" size="lg" onClose={onClose} footer={<Button onClick={onClose}>Close</Button>}>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-bg p-5">
        <h2 className="text-lg font-semibold text-text">{headline}</h2>
        {subtitle && <p className="-mt-3 text-sm text-text-muted">{subtitle}</p>}
        <MessageBlocks message={message} />
        <button type="button" className="w-fit rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground" disabled>
          View Full Report
        </button>
      </div>
    </Modal>
  );
}
