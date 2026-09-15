import { ClipboardCheck, Wallet, Truck, ShieldCheck, FolderUp, UserPlus, StickyNote, Paperclip } from "lucide-react";
import type { ActivityLogEntry, ActivityType } from "../driverActivityFullLog";

const iconByType: Record<ActivityType, typeof ClipboardCheck> = {
  compliance: ClipboardCheck,
  wallet: Wallet,
  delivery: Truck,
  "background-check": ShieldCheck,
  documents: FolderUp,
  account: UserPlus,
  note: StickyNote,
};

const colorByType: Record<ActivityType, string> = {
  compliance: "bg-tag-warning-bg text-tag-warning-fg",
  wallet: "bg-tag-danger-bg text-tag-danger-fg",
  delivery: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  "background-check": "bg-tag-info-bg text-tag-info-fg",
  documents: "bg-tag-standard-bg text-tag-standard-fg",
  account: "bg-tag-standard-bg text-tag-standard-fg",
  note: "bg-tag-express-bg text-tag-express-fg",
};

// Own visual language — richer than Timeline's plain dot/label/timestamp
// (status pills, attachment chips), so it's a separate component rather
// than an extension of Timeline (which stays as-is for its existing uses).
export function ActivityLogEntryRow({ entry, isLast }: { entry: ActivityLogEntry; isLast: boolean }) {
  const Icon = iconByType[entry.type];

  return (
    <div className="relative flex gap-3 pb-5">
      {!isLast && <span className="absolute left-4 top-9 h-full w-px bg-border" />}
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorByType[entry.type]}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text">{entry.title}</p>
            {entry.statusLabel && (
              <span className="text-badge rounded-full bg-tag-warning-bg px-2 py-0.5 text-tag-warning-fg">
                {entry.statusLabel}
              </span>
            )}
          </div>
          <span className="text-xs text-text-muted">{entry.timestamp}</span>
        </div>
        <p className="text-sm text-text-muted">{entry.description}</p>
        {entry.attachments && entry.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.attachments.map((file) => (
              <span
                key={file}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-text-muted"
              >
                <Paperclip className="h-3 w-3" />
                {file}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
