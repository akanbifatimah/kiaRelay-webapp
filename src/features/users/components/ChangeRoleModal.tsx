import { useForm, useWatch } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { moduleLabel, ROLES, type RoleKey } from "../../access/modules";
import { useRoleDefaults } from "../../access/teamMembers";

interface ChangeRoleModalProps {
  count: number;
  onConfirm: (role: RoleKey) => void;
  onCancel: () => void;
}

// Batch Actions → Change Role (not in the designs, 2026-09-23). Selected
// members take the new role's current default modules, previewed here so
// the Super Admin sees exactly what access they're handing out.
export function ChangeRoleModal({ count, onConfirm, onCancel }: ChangeRoleModalProps) {
  const defaults = useRoleDefaults();
  const { control, handleSubmit } = useForm<{ role: RoleKey }>({ defaultValues: { role: "operations" } });
  const role = useWatch({ control, name: "role" });
  const modules = defaults[role];

  return (
    <Modal
      title={`Change Role for ${count} User${count === 1 ? "" : "s"}`}
      subtitle="Each selected user takes the role's default module access."
      size="md"
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit((values) => onConfirm(values.role))}>Apply Role</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="role" label="New Role" type="select" options={ROLES.map((r) => ({ value: r.key, label: r.label }))} />
        <div className="rounded-lg bg-bg p-3">
          <p className="text-label text-text-muted">Resulting module access</p>
          <p className="mt-1 text-sm text-text">
            {role === "super-admin" ? "All modules (locked)" : modules.length ? modules.map(moduleLabel).join(", ") : "No modules — assign access individually afterwards."}
          </p>
        </div>
      </div>
    </Modal>
  );
}
