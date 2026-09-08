import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/Button";
import { PasswordField } from "../../components/PasswordField";
import { useToast } from "../../components/toast/ToastContext";
import { AuthLayout } from "./AuthLayout";
import { resetPassword } from "./passwordReset";

interface NewPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export function NewPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; verified?: boolean } | null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, getValues } = useForm<NewPasswordFormValues>({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  // Can't set a new password without having verified a code for this email first.
  if (!state?.email || !state.verified) {
    return <Navigate to="/forgot-password" replace />;
  }
  const email = state.email;

  async function onSubmit(values: NewPasswordFormValues) {
    setIsSubmitting(true);
    await resetPassword(email, values.newPassword);
    setIsSubmitting(false);
    showToast("success", "Password reset successful.");
    navigate("/login", { replace: true });
  }

  return (
    <AuthLayout>
      <div className="pb-4 text-center">
        <h1 className="text-lg font-semibold text-text">New Password</h1>
        <p className="text-body mt-1 text-text-muted">Create a strong new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <PasswordField
          control={control}
          name="newPassword"
          label="New Password"
          rules={{ required: "New password is required", minLength: { value: 8, message: "At least 8 characters" } }}
        />
        <PasswordField
          control={control}
          name="confirmPassword"
          label="Confirm New Password"
          rules={{
            required: "Please confirm your password",
            validate: (value) => value === getValues("newPassword") || "Passwords don't match",
          }}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Please wait…" : "Reset Password"}
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Login
      </Link>
    </AuthLayout>
  );
}
