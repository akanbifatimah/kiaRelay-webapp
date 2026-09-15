import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { ActivityLogEntry } from "../driverActivityFullLog";

interface AddNoteFormValues {
  note: string;
}

interface AddNoteModalProps {
  onClose: () => void;
  onAdd: (entry: ActivityLogEntry) => void;
}

export function AddNoteModal({ onClose, onAdd }: AddNoteModalProps) {
  const { control, handleSubmit } = useForm<AddNoteFormValues>({ defaultValues: { note: "" } });

  function onSubmit(values: AddNoteFormValues) {
    const note = values.note.trim();
    if (!note) return;

    onAdd({
      id: `act-note-${Date.now()}`,
      type: "note",
      title: "Note Added",
      description: note,
      timestamp: "Just now",
    });
    onClose();
  }

  return (
    <Modal
      title="Add Note"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
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
        placeholder="Add an internal note to this driver's activity log…"
        rules={{ required: "This field is required" }}
      />
    </Modal>
  );
}
