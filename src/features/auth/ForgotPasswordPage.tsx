import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { AuthLayout } from "./AuthLayout";
import { requestPasswordReset } from "./passwordReset";

interface ForgotPasswordFormValues {
  email: string;
}

export function ForgotPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({ defaultValues: { email: "" } });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsSubmitting(true);
    const { mockCode } = await requestPasswordReset(values.email);
    setIsSubmitting(false);
    showToast("success", `Reset code sent — check your inbox. (Demo code: ${mockCode})`);
    navigate("/verify-code", { state: { email: values.email } });
  }

  return (
    <AuthLayout>
      <div className="pb-4 text-center">
        <h1 className="text-lg font-semibold text-text">Forgot Password?</h1>
        <p className="text-body mt-1 text-text-muted">
          Enter the email address associated with your account and we&apos;ll send you a reset
          code.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email is required" }}
          render={({ field, fieldState }) => (
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-text">Email Address</span>
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                <Mail className="h-4 w-4 shrink-0 text-text-muted" />
                <input
                  {...field}
                  type="email"
                  placeholder="admin@kiarelay.com"
                  className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                />
              </div>
              {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
            </label>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Please wait…" : "Continue"}
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
