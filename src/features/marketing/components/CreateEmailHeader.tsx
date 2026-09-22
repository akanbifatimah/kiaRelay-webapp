import { Bookmark, Eye, Play } from "lucide-react";
import { Button } from "../../../components/Button";

interface CreateEmailHeaderProps {
  savedAt: string;
  onPreview: () => void;
  onSaveDraft: () => void;
}

export function CreateEmailHeader({ savedAt, onPreview, onSaveDraft }: CreateEmailHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-heading-1 text-text">Create an Email</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tag-healthcare-bg px-2.5 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Auto-saved draft at {savedAt}
          </span>
        </div>
        <p className="text-body mt-1 text-text-muted">Write your message, pick who gets it, and send it out.</p>
      </div>
      <div className="flex items-center gap-2">
        {/* No screenshot shows where Create Email links into the Email Preview
            screen — this "Preview" action is an inferred addition. */}
        <Button type="button" variant="ghost" onClick={onPreview}>
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button type="button" variant="secondary" onClick={onSaveDraft}>
          <Bookmark className="h-4 w-4" />
          Save draft
        </Button>
        <Button type="submit">
          <Play className="h-4 w-4" />
          Send now
        </Button>
      </div>
    </div>
  );
}
