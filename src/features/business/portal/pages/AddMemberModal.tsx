import { useForm } from "react-hook-form";
import { Button } from "../../../../components/Button";
import { FormField } from "../../../../components/FormField";
import { Modal } from "../../../../components/Modal";
import type { BranchUser, BranchUserRole } from "../../../customers/companyBranches";

interface MemberForm {
  firstName: string;
  lastName: string;
  email: string;
  role: BranchUserRole;
  branch: string;
}

interface AddMemberModalProps {
  branches: string[];
  existing: BranchUser[];
  onClose: () => void;
  onAdd: (member: Omit<BranchUser, "id" | "status" | "lastActive">) => void;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Add Member (2026-09-30, no design — first pass). First/last names split.
// TODO: POST /customers/:id/users sends the invite email.
export function AddMemberModal({ branches, existing, onClose, onAdd }: AddMemberModalProps) {
  const { control, handleSubmit } = useForm<MemberForm>({ mode: "onTouched", defaultValues: { firstName: "", lastName: "", email: "", role: "viewer", branch: branches[0] } });
  const submit = handleSubmit((v) => onAdd({ firstName: v.firstName.trim(), lastName: v.lastName.trim(), email: v.email.trim().toLowerCase(), role: v.role, branchAssignment: v.branch }));

  return (
    <Modal
      title="Add Team Member"
      subtitle="They'll get an email invite to join your company account."
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Send Invite</Button>
        </div>
      }
    >
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <FormField control={control} name="firstName" label="First Name *" rules={{ required: "Required." }} />
        <FormField control={control} name="lastName" label="Last Name *" rules={{ required: "Required." }} />
        <div className="sm:col-span-2">
          <FormField
            control={control}
            name="email"
            label="Work Email *"
            placeholder="name@company.com"
            rules={{
              required: "Email is required.",
              pattern: { value: EMAIL, message: "Enter a valid email." },
              validate: (v) => !existing.some((m) => m.email.toLowerCase() === String(v).trim().toLowerCase()) || "That email is already on your team.",
            }}
          />
        </div>
        <FormField control={control} name="role" label="Role *" type="select" options={[{ value: "admin", label: "Admin" }, { value: "manager", label: "Manager" }, { value: "viewer", label: "Viewer" }]} />
        <FormField control={control} name="branch" label="Branch *" type="select" options={branches.map((b) => ({ value: b, label: b }))} />
      </form>
    </Modal>
  );
}
