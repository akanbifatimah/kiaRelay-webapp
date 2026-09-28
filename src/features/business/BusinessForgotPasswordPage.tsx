import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { PasswordField } from "../../components/PasswordField";
import { PasswordChecklist } from "../../components/PasswordChecklist";
import { useToast } from "../../components/toast/ToastContext";
import { meetsPasswordRules } from "../../lib/passwordRules";
import { AuthLayout } from "../auth/AuthLayout";
import { MOCK_RESET_CODE, requestPasswordReset, verifyResetCode } from "../auth/passwordReset";
import { findBusinessByEmail, updateBusinessPassword } from "./businessAccounts";

interface ResetValues {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

// KiaRelay Business password reset (TC-15): email → code + new password.
// Reuses the admin flow's mock service, so the demo code is the same and is
// shown in a toast, since no email is actually sent.
// TODO: POST /business/auth/forgot-password + /reset-password.
export function BusinessForgotPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const { control, handleSubmit } = useForm<ResetValues>({ defaultValues: { email: "", code: "", password: "", confirmPassword: "" } });
  const password = useWatch({ control, name: "password" });

  const onSubmit = handleSubmit(async (values) => {
    setBusy(true);
    if (!sent) {
      // Always "succeeds" (no account enumeration), like the admin flow.
      await requestPasswordReset(values.email);
      setSent(true);
      showToast("success", `If that email has an account, a code is on its way. (Demo code: ${MOCK_RESET_CODE})`);
    } else if (!(await verifyResetCode(values.email, values.code))) {
      showToast("error", "That code isn't right. Check the email and try again.");
    } else {
      if (findBusinessByEmail(values.email)) updateBusinessPassword(values.email, values.password);
      showToast("success", "Password updated. Sign in with your new password.");
      navigate("/business/login", { replace: true });
    }
    setBusy(false);
  });

  return (
    <AuthLayout>
      <div className="pb-4 text-center">
        <h1 className="text-lg font-semibold text-text">Reset your password</h1>
        <p className="text-body mt-1 text-text-muted">{sent ? "Enter the 6-digit code we emailed and choose a new password." : "Enter your work email and we'll send you a reset code."}</p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField control={control} name="email" label="Work Email" icon={<Mail className="h-4 w-4" />} readOnly={sent} rules={{ required: "Email is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." } }} />
        {sent && (
          <>
            <FormField control={control} name="code" label="Reset Code" icon={<KeyRound className="h-4 w-4" />} rules={{ required: "Enter the code.", pattern: { value: /^\d{6}$/, message: "6 digits." } }} />
            <PasswordField control={control} name="password" label="New Password" rules={{ validate: (v) => meetsPasswordRules(String(v)) || "Meet every requirement below." }} />
            <PasswordField control={control} name="confirmPassword" label="Confirm Password" rules={{ validate: (v, values) => v === values.password || "Passwords don't match." }} />
            <PasswordChecklist value={password} />
          </>
        )}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Please wait..." : sent ? "Update Password" : "Send Code"}
        </Button>
      </form>
      <Link to="/business/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
