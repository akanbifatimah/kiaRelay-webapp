import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";

interface PublishingSidebarCardProps {
  onSendNow: () => void;
  onSchedule: () => void;
  onSaveDraft: () => void;
}

export function PublishingSidebarCard({ onSendNow, onSchedule, onSaveDraft }: PublishingSidebarCardProps) {
  return (
    <Card className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-text">Publishing</h3>
      <Button type="button" onClick={onSendNow}>
        Send Now
      </Button>
      <Button type="button" variant="secondary" onClick={onSchedule}>
        Schedule for Later
      </Button>
      <Button type="button" variant="ghost" onClick={onSaveDraft}>
        Save as Draft
      </Button>
    </Card>
  );
}
