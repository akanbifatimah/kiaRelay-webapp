import { Controller, useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { roleMeta, type ModuleKey, type RoleKey } from "../../access/modules";
import { useRoleDefaults } from "../../access/teamMembers";
import { ModuleAccessField } from "./ModuleAccessField";
import { RoleBadge } from "./AccessBadges";

interface RolePermissionsModalProps {
  role: RoleKey;
  memberCount: number;
  onSave: (modules: ModuleKey[], applyToExisting: boolean) => void;
  onClose: () => void;
}

interface FormValues {
  modules: ModuleKey[];
  applyToExisting: boolean;
}

// "Edit Permissions →" on each Role Overview card (not in the designs,
// 2026-09-23): edits the role's default module preset — what a new user in
// that role starts with — and can optionally push it to everyone already in
// the role, overwriting their individual tweaks.
export function RolePermissionsModal({ role, memberCount, onSave, onClose }: RolePermissionsModalProps) {
  const defaults = useRoleDefaults();
  const { control, handleSubmit } = useForm<FormValues>({ defaultValues: { modules: defaults[role], applyToExisting: false } });

  return (
    <Modal
      title={
        <>
          Edit Permissions <RoleBadge role={role} />
        </>
      }
      subtitle={roleMeta(role).description}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit((values) => onSave(values.modules, values.applyToExisting))}>Save Permissions</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <ModuleAccessField control={control} name="modules" />
        <Controller
          name="applyToExisting"
          control={control}
          render={({ field: { value, onChange } }) => (
            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 text-sm">
              <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} disabled={memberCount === 0} className="mt-0.5 h-4 w-4 accent-primary" />
              <span>
                <span className="font-medium text-text">Also apply to the {memberCount} existing user{memberCount === 1 ? "" : "s"} with this role</span>
                <span className="block text-xs text-text-muted">
                  Replaces their current module access. Leave unchecked to change only the preset for new users.
                </span>
              </span>
            </label>
          )}
        />
      </div>
    </Modal>
  );
}
