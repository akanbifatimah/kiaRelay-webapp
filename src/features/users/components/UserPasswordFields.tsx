import { useWatch, type Control } from "react-hook-form";
import { PasswordField } from "../../../components/PasswordField";
import { PasswordChecklist } from "../../../components/PasswordChecklist";
import { meetsPasswordRules } from "../../../lib/passwordRules";
import type { UserFormValues } from "../userActions";

interface UserPasswordFieldsProps {
  control: Control<UserFormValues>;
  /** Editing: the password is optional — leaving it blank keeps the current one. */
  isEdit: boolean;
}

// Initial password for a new member, or an admin-set reset when editing.
// TODO: the real API should email an invite / reset link instead of an
// admin choosing the password — and it must never be stored client-side.
export function UserPasswordFields({ control, isEdit }: UserPasswordFieldsProps) {
  const password = useWatch({ control, name: "password" });

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordField
          control={control}
          name="password"
          label={isEdit ? "New Password (optional)" : "Password *"}
          rules={{
            validate: (value) => {
              const text = String(value);
              if (!text) return isEdit || "Password is required.";
              return meetsPasswordRules(text) || "Meet every requirement below.";
            },
          }}
        />
        <PasswordField
          control={control}
          name="confirmPassword"
          label={isEdit ? "Confirm New Password" : "Confirm Password *"}
          rules={{ validate: (value, values) => value === values.password || "Passwords don't match." }}
        />
      </div>
      {isEdit && !password ? (
        <p className="text-xs text-text-muted">Leave blank to keep the member's current password.</p>
      ) : (
        <PasswordChecklist value={password} />
      )}
    </div>
  );
}
