import { useState } from "react";
import { History, Download, Plus } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { useToast } from "../../../components/toast/ToastContext";
import { ActivityLogEntryRow } from "./ActivityLogEntryRow";
import { AddNoteModal } from "./AddNoteModal";
import { exportActivityLogToCsv } from "../exportActivityLog";
import { getActivityLog } from "../driverActivityFullLog";

export function FullActivityLogSection({ driverId }: { driverId: string }) {
  const { showToast } = useToast();
  const [entries, setEntries] = useState(() => getActivityLog(driverId));
  const [isAddingNote, setIsAddingNote] = useState(false);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
          <History className="h-4 w-4 text-primary" />
          Activity Log
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (entries.length === 0) {
                showToast("error", "No activity to export.");
                return;
              }
              exportActivityLogToCsv(entries);
              showToast("success", "Activity log exported.");
            }}
          >
            <Download className="h-4 w-4" />
            Export Log
          </Button>
          <Button variant="dark" size="sm" onClick={() => setIsAddingNote(true)}>
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-muted">No activity recorded yet.</p>
      ) : (
        <div className="flex flex-col">
          {entries.map((entry, index) => (
            <ActivityLogEntryRow key={entry.id} entry={entry} isLast={index === entries.length - 1} />
          ))}
        </div>
      )}

      {isAddingNote && (
        <AddNoteModal
          onClose={() => setIsAddingNote(false)}
          onAdd={(entry) => {
            setEntries((prev) => [entry, ...prev]);
            showToast("success", "Note added.");
          }}
        />
      )}
    </Card>
  );
}
