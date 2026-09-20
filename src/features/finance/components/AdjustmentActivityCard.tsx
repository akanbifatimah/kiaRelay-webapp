import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { FormField } from "../../../components/FormField";
import { Avatar } from "../../../components/Avatar";
import type { AdjustmentNote } from "../adjustmentDetail";

interface AddNoteFormValues {
  note: string;
}

// Mirrors AddNoteModal (drivers)/FullActivityLogSection's real-add pattern —
// page-local state, not a stub.
export function AdjustmentActivityCard({ initialNotes }: { initialNotes: AdjustmentNote[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { control, handleSubmit, reset } = useForm<AddNoteFormValues>({ defaultValues: { note: "" } });

  function onSubmit(values: AddNoteFormValues) {
    const text = values.note.trim();
    if (!text) return;
    setNotes((prev) => [{ id: `note-${Date.now()}`, author: "Alex Mercer", text, timestamp: "Just now" }, ...prev]);
    reset();
    setIsAddingNote(false);
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Adjustment Activity</h3>
        <button
          type="button"
          onClick={() => setIsAddingNote(true)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Note
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {notes.map((note) => (
          <div key={note.id} className="flex gap-2.5">
            <Avatar name={note.author} size="sm" />
            <div>
              <p className="text-sm text-text">{note.text}</p>
              <p className="mt-0.5 text-xs text-text-muted">
                {note.author} · {note.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isAddingNote && (
        <Modal
          title="Add Note"
          onClose={() => setIsAddingNote(false)}
          footer={
            <>
              <Button type="button" variant="secondary" onClick={() => setIsAddingNote(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
                Add Note
              </Button>
            </>
          }
        >
          <FormField
            control={control}
            name="note"
            label="Note"
            type="textarea"
            placeholder="Add an internal note…"
            rules={{ required: "This field is required" }}
          />
        </Modal>
      )}
    </Card>
  );
}
