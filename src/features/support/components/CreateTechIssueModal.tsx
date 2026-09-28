import { useForm } from "react-hook-form";
import { Wrench } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { unitAgents } from "../agents";
import { categoryLabels, priorityLabels } from "../types";
import type { TechIssueInput } from "../supportWorkflow";

interface CreateTechIssueModalProps {
  onClose: () => void;
  onCreate: (input: TechIssueInput) => void;
}

const TECH_CATEGORIES = ["technical", "infrastructure", "access", "routing"] as const;

// Lead Technical Support can log a technical issue that no customer raised
// (TC-16, Workflow B step 1), optionally assigning it right away.
export function CreateTechIssueModal({ onClose, onCreate }: CreateTechIssueModalProps) {
  const engineers = unitAgents(["tech-staff", "lead-tech"]);
  const { control, handleSubmit } = useForm<TechIssueInput>({
    defaultValues: { subject: "", category: "technical", priority: "medium", description: "", assigneeId: "" },
  });

  return (
    <Modal
      title={
        <>
          <Wrench className="h-5 w-5 text-primary" />
          New Technical Issue
        </>
      }
      subtitle="Logged straight into the Technical queue. No customer is notified."
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit((values) => onCreate({ ...values, assigneeId: values.assigneeId || undefined }))}>Create Issue</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="subject" label="Title" placeholder="e.g. Driver app crashes on photo upload" rules={{ required: "Give the issue a title." }} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={control} name="category" label="Category" type="select" options={TECH_CATEGORIES.map((value) => ({ value, label: categoryLabels[value] }))} />
          <FormField control={control} name="priority" label="Priority" type="select" options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))} />
        </div>
        <FormField control={control} name="description" label="Description" type="textarea" placeholder="What's happening, where, and how to reproduce it..." rules={{ required: "Describe the issue." }} />
        <FormField
          control={control}
          name="assigneeId"
          label="Assign to (optional)"
          type="select"
          options={[{ value: "", label: "Leave unassigned" }, ...engineers.map((a) => ({ value: a.id, label: `${a.name} — ${a.role}` }))]}
        />
      </div>
    </Modal>
  );
}
