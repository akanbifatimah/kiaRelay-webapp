import { createPortal } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/Button";

interface AssignmentSuccessModalProps {
  count: number;
  fromScheduleName: string;
  toScheduleName: string;
  onReturn: () => void;
}

// Deliberately not built on the shared Modal — the design has no header bar
// or close X (see screenshot), just a centered icon/message/single-button
// dialog, so reusing Modal's header chrome would fight the design instead
// of matching it.
export function AssignmentSuccessModal({ count, fromScheduleName, toScheduleName, onReturn }: AssignmentSuccessModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex w-full max-w-sm flex-col items-center gap-3 rounded-[var(--radius-card)] bg-surface p-6 text-center shadow-lg">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tag-healthcare-bg text-success">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <p className="text-sm font-semibold text-text">Assignment Successful</p>
        <p className="text-xs text-text-muted">
          You have successfully moved {count} driver{count === 1 ? "" : "s"} from {fromScheduleName} to the{" "}
          <span className="font-medium text-primary">{toScheduleName}</span> schedule.
        </p>
        <Button type="button" variant="dark" className="w-full" onClick={onReturn}>
          Return to Dashboard
        </Button>
      </div>
    </div>,
    document.body,
  );
}
