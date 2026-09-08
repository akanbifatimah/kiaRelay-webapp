import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/Button";
import { OtpInput } from "../../components/OtpInput";
import { useToast } from "../../components/toast/ToastContext";
import { AuthLayout } from "./AuthLayout";
import { requestPasswordReset, verifyResetCode } from "./passwordReset";

const RESEND_SECONDS = 60;

interface VerifyCodeFormValues {
  code: string;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function VerifyCodePage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, reset } = useForm<VerifyCodeFormValues>({ defaultValues: { code: "" } });

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((seconds) => (seconds > 0 ? seconds - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Can't verify a code with no email context — send back to step 1.
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  async function handleResend() {
    const { mockCode } = await requestPasswordReset(email as string);
    setSecondsLeft(RESEND_SECONDS);
    reset({ code: "" });
    showToast("success", `A new code was sent. (Demo code: ${mockCode})`);
  }

  async function onSubmit(values: VerifyCodeFormValues) {
    setIsSubmitting(true);
    const isValid = await verifyResetCode(email as string, values.code);
    setIsSubmitting(false);
    if (!isValid) {
      showToast("error", "Invalid or expired reset code.");
      return;
    }
    navigate("/reset-password", { state: { email, verified: true }, replace: true });
  }

  return (
    <AuthLayout>
      <div className="pb-4 text-center">
        <h1 className="text-lg font-semibold text-text">Check Your Email</h1>
        <p className="text-body mt-1 text-text-muted">
          Enter the 6-digit code sent to <span className="font-medium text-text">{email}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-4">
        <Controller
          name="code"
          control={control}
          rules={{ validate: (value) => value.length === 6 || "Enter the 6-digit code" }}
          render={({ field, fieldState }) => (
            <div className="flex flex-col items-center gap-1">
              <OtpInput value={field.value} onChange={field.onChange} />
              {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
            </div>
          )}
        />

        {secondsLeft > 0 ? (
          <p className="text-xs text-text-muted">Resend code in {formatTime(secondsLeft)}</p>
        ) : (
          <p className="text-xs text-text-muted">
            Didn&apos;t receive code?{" "}
            <button type="button" onClick={handleResend} className="font-medium text-primary hover:underline">
              Send again
            </button>
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Verifying…" : "Submit"}
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
