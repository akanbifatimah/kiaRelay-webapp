import { useBlocker } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "../../../components/Button";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { cn } from "../../../lib/cn";

interface SettingsSaveBarProps {
  isDirty: boolean;
  /** Shown when there are unsaved edits. */
  dirtyMessage: string;
  onCancel: () => void;
  onSave: () => void;
}

// Sticky footer shared by all three Settings screens. Leaving with unsaved
// edits goes through ConfirmModal (rule 9) via the data router's useBlocker,
// so a stray sidebar click can't silently throw work away.
export function SettingsSaveBar({ isDirty, dirtyMessage, onCancel, onSave }: SettingsSaveBarProps) {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname);

  return (
    <>
      <div className="sticky bottom-0 z-10 -mx-1 flex flex-col gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-text-muted">
          <span className={cn("h-2 w-2 rounded-full", isDirty ? "bg-primary" : "bg-success")} />
          {isDirty ? dirtyMessage : "All changes saved."}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={!isDirty}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!isDirty}>
            <Check className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      {blocker.state === "blocked" && (
        <ConfirmModal
          title="Discard unsaved changes?"
          message="You have edits on this page that haven't been saved. Leaving now will discard them."
          confirmLabel="Discard & Leave"
          cancelLabel="Keep Editing"
          tone="danger"
          onCancel={() => blocker.reset()}
          onConfirm={() => blocker.proceed()}
        />
      )}
    </>
  );
}
