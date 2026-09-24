import { useForm, useWatch } from "react-hook-form";
import { Check, X } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { PasswordField } from "../../../components/PasswordField";
import { useToast } from "../../../components/toast/ToastContext";
import { cn } from "../../../lib/cn";
import { logAudit } from "../../access/auditLog";
import { updateMember, type TeamMember } from "../../access/teamMembers";
import { DEV_PASSWORD } from "../../access/teamMembersData";

interface PasswordValues {
  current: string;
  next: string;
  confirm: string;
}

const CHECKS: { label: string; test: (value: string) => boolean }[] = [
  { label: "At least 8 characters", test: (value) => value.length >= 8 },
  { label: "Upper and lower case letters", test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { label: "A number", test: (value) => /\d/.test(value) },
  { label: "A symbol", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

// Change password. Mock: the new password is kept on the member record so
// the login check uses it from then on.
// TODO: replace with POST /auth/change-password — never store passwords client-side.
export function PasswordCard({ member }: { member: TeamMember }) {
  const { showToast } = useToast();
  const { control, handleSubmit, reset } = useForm<PasswordValues>({ defaultValues: { current: "", next: "", confirm: "" } });
  const next = useWatch({ control, name: "next" });
  const currentPassword = member.password ?? DEV_PASSWORD;

  const onSubmit = handleSubmit((values) => {
    updateMember(member.id, { password: values.next });
    logAudit({ actor: member.name, category: "auth", action: "Changed password", target: member.email });
    reset();
    showToast("success", "Password changed. Use the new one next time you sign in.");
  });

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text">Password</h2>
        <p className="text-xs text-text-muted">Change the password you use to sign in.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <PasswordField control={control} name="current" label="Current Password" rules={{ validate: (value) => value === currentPassword || "That isn't your current password." }} />
        <PasswordField
          control={control}
          name="next"
          label="New Password"
          rules={{
            validate: (value, values) => {
              if (!CHECKS.every((check) => check.test(value))) return "Meet every requirement below.";
              return value !== values.current || "Choose a different password.";
            },
          }}
        />
        <PasswordField control={control} name="confirm" label="Confirm New Password" rules={{ validate: (value, values) => value === values.next || "Passwords don't match." }} />
      </div>
      <ul className="grid gap-1 text-xs sm:grid-cols-2">
        {CHECKS.map((check) => {
          const passed = check.test(next);
          return (
            <li key={check.label} className={cn("flex items-center gap-1.5", passed ? "text-success" : "text-text-muted")}>
              {passed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              {check.label}
            </li>
          );
        })}
      </ul>
      <div className="flex justify-end">
        <Button onClick={onSubmit}>Update Password</Button>
      </div>
    </Card>
  );
}
