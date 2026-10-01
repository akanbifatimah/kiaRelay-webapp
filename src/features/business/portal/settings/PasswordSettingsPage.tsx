import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { PasswordChecklist } from "../../../../components/PasswordChecklist";
import { PasswordField } from "../../../../components/PasswordField";
import { useToast } from "../../../../components/toast/ToastContext";
import { meetsPasswordRules } from "../../../../lib/passwordRules";
import { updateBusinessPassword } from "../../businessAccounts";
import { usePortalAccount } from "../usePortalAccount";
import { SettingsSubPage } from "./SettingsList";

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

// Change Password (2026-10-01; mirrors the app's Settings → Change Password).
// TODO: POST /auth/change-password — passwords must never live client-side.
export function PasswordSettingsPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { control, handleSubmit } = useForm<PasswordForm>({ mode: "onTouched", defaultValues: { current: "", next: "", confirm: "" } });
  const next = useWatch({ control, name: "next" });
  if (!account) return null;

  const save = handleSubmit((v) => {
    updateBusinessPassword(account.owner.email, v.next);
    showToast("success", "Password changed.");
    navigate("/business/settings");
  });

  return (
    <SettingsSubPage title="Change Password" subtitle="You'll use the new password the next time you sign in.">
      <Card>
        <form onSubmit={save} className="flex flex-col gap-4">
          <PasswordField control={control} name="current" label="Current Password" rules={{ required: "Enter your current password.", validate: (v) => v === account.password || "That password isn't right." }} />
          <PasswordField control={control} name="next" label="New Password" rules={{ required: "Choose a new password.", validate: (v) => (meetsPasswordRules(v) ? (v !== account.password || "Use a different password from your current one.") : "Meet every rule below.") }} />
          <PasswordChecklist value={next} />
          <PasswordField control={control} name="confirm" label="Confirm New Password" rules={{ required: "Confirm the new password.", validate: (v, all) => v === all.next || "Passwords don't match." }} />
          <Button type="submit" className="w-fit">Update Password</Button>
        </form>
      </Card>
    </SettingsSubPage>
  );
}
