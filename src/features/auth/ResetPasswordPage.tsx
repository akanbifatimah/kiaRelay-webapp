import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate, type Location } from "react-router-dom";
import { Hash, ArrowLeft } from "lucide-react";
import { Button } from "../../components/Button";
import { PasswordField } from "../../components/PasswordField";
import { useToast } from "../../components/toast/ToastContext";
import { AuthLayout } from "./AuthLayout";
import { resetPassword } from "./passwordReset";

interface ResetPasswordFormValues {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export function ResetPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, getValues } = useForm<ResetPasswordFormValues>({
    defaultValues: { code: "", newPassword: "", confirmPassword: "" },
  });

  // Can't reset a password with no email context — send back to step 1.
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  async function onSubmit(values: ResetPasswordFormValues) {
    setIsSubmitting(true);
    try {
      await resetPassword(email as string, values.code, values.newPassword);
      showToast("success", "Password reset successful.");
      navigate("/login", { replace: true, state: null as Location["state"] });
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="pb-4 text-center">
        <h1 className="text-lg font-semibold text-text">Reset Password</h1>
        <p className="text-body mt-1 text-text-muted">
          Enter the code sent to <span className="font-medium text-text">{email}</span> and your
          new password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="code"
          control={control}
          rules={{
            required: "Reset code is required",
            minLength: { value: 6, message: "Enter the 6-digit code" },
          }}
          render={({ field, fieldState }) => (
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-text">Reset Code</span>
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                <Hash className="h-4 w-4 shrink-0 text-text-muted" />
                <input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                />
              </div>
              {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
            </label>
          )}
        />

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
