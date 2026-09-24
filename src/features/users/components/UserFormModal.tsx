import { Controller, useForm, useWatch } from "react-hook-form";
import { Check, Info } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { Switch } from "../../../components/Switch";
import { ROLES, type RoleKey } from "../../access/modules";
import { isEmailTaken, useRoleDefaults, type TeamMember } from "../../access/teamMembers";
import type { UserFormValues } from "../userActions";
import { ModuleAccessField } from "./ModuleAccessField";

interface UserFormModalProps {
  /** Omit to add a new member. */
  member?: TeamMember;
  /** Editing yourself locks the role (no self-demotion/escalation). */
  isSelf: boolean;
  onSubmit: (values: UserFormValues) => void;
  onClose: () => void;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_OPTIONS = ROLES.map((role) => ({ value: role.key, label: role.key === "custom" ? "Custom (Modular Access Controls)" : role.label }));

export function UserFormModal({ member, isSelf, onSubmit, onClose }: UserFormModalProps) {
  const defaults = useRoleDefaults();
  const { control, handleSubmit, setValue } = useForm<UserFormValues>({
    defaultValues: {
      name: member?.name ?? "",
      email: member?.email ?? "",
      phone: member?.phone ?? "",
      title: member?.title ?? "",
      role: member?.role ?? "operations",
      modules: member?.modules ?? defaults.operations,
      active: member?.active ?? true,
    },
  });
  const role = useWatch({ control, name: "role" });

  return (
    <Modal
      title={member ? "Edit Team Member" : "Add Team Member"}
      subtitle="Configure user identity, assigned role, and module-level permissions."
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>
            <Check className="h-4 w-4" />
            Save User
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField control={control} name="name" label="Full Name *" placeholder="e.g. David Chen" rules={{ required: "Full name is required." }} />
        <FormField
          control={control}
          name="email"
          label="Email Address *"
          placeholder="name@kiarelay.com"
          rules={{
            required: "Email is required.",
            pattern: { value: EMAIL, message: "Enter a valid email address." },
            validate: (value) => !isEmailTaken(String(value), member?.id) || "Another team member already uses this email.",
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={control}
            name="phone"
            label="Phone Number (optional)"
            placeholder="e.g. +1 (713) 555-0192"
            rules={{ validate: (value) => !value || String(value).replace(/\D/g, "").length >= 10 || "Enter a full number, incl. country code." }}
          />
          <FormField control={control} name="title" label="Job Title (optional)" placeholder="e.g. Metro Hub Dispatcher" />
        </div>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-text-muted">Role *</span>
              <select
                {...field}
                disabled={isSelf}
                onChange={(event) => {
                  const next = event.target.value as RoleKey;
                  field.onChange(next);
                  // A preset fills in that role's default modules; the admin can still adjust them.
                  setValue("modules", defaults[next], { shouldValidate: true });
                }}
                className="rounded-md border border-border px-3 py-2 text-sm text-text disabled:bg-bg disabled:text-text-muted"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {isSelf && <span className="text-xs text-text-muted">You can't change your own role.</span>}
            </label>
          )}
        />
        <ModuleAccessField control={control} name="modules" locked={role === "super-admin"} />
        <p className="flex items-start gap-2 rounded-lg bg-bg p-3 text-xs text-text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>
            <span className="font-semibold text-text">Note:</span> If <span className="font-mono">Role = Super Admin</span> is selected, all modules are
            automatically granted and locked. User Management is always Super Admin-only.
          </span>
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-label text-text-muted">Account Status</p>
          <Controller
            name="active"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center justify-between gap-4 rounded-lg bg-bg p-3">
                <div>
                  <p className="text-sm font-semibold text-text">Active Account</p>
                  <p className="text-xs text-text-muted">User can immediately sign in and access permitted modules.</p>
                </div>
                <Switch checked={value} onChange={onChange} label="Active account" disabled={isSelf} />
              </div>
            )}
          />
        </div>
      </form>
    </Modal>
  );
}
