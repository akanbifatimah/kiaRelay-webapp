import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CheckCircle2, MailCheck, Timer } from "lucide-react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { OtpInput } from "../../../components/OtpInput";
import { MOCK_VERIFICATION_CODE, sendVerificationCode, verifyCode, type VerificationChannel } from "../contactVerification";

const RESEND_SECONDS = 30;

const COPY: Record<VerificationChannel, { title: string; fallback: string }> = {
  email: { title: "Verify your email", fallback: "your email" },
  phone: { title: "Verify your phone", fallback: "your phone" },
};

// Code verification between Account and Details: email first, then phone
// (email added 2026-09-30). The phone screen follows the "Phone Verification"
// design; the email screen has no design, so it reuses that layout with an
// icon in place of the photo.
export function CodeVerifyStep({ channel, target, onVerified }: { channel: VerificationChannel; target: string; onVerified: () => void }) {
  const [left, setLeft] = useState(RESEND_SECONDS);
  const [wrong, setWrong] = useState(false);
  const { control, handleSubmit, formState, setValue } = useForm<{ code: string }>({ defaultValues: { code: "" } });

  useEffect(() => {
    if (left <= 0) return;
    const timer = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);

  async function resend() {
    setValue("code", "");
    setWrong(false);
    await sendVerificationCode(channel, target);
    setLeft(RESEND_SECONDS);
  }

  const verify = handleSubmit(async ({ code }) => {
    if (await verifyCode(channel, code)) onVerified();
    else setWrong(true);
  });

  return (
    <Card className="mx-auto flex max-w-md flex-col items-center gap-6 py-8 text-center">
      {channel === "phone" ? (
        <img src="/business/verify-phone.webp" alt="" className="h-40 w-40 rounded-3xl object-cover" />
      ) : (
        <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-primary/10">
          <MailCheck className="h-16 w-16 text-primary" aria-hidden />
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-text">{COPY[channel].title}</h2>
        <p className="mt-1 text-sm text-text-muted">We sent a 6-digit code to</p>
        <p className="break-all text-sm font-semibold text-text">{target || COPY[channel].fallback}</p>
      </div>
      <form onSubmit={verify} className="flex w-full flex-col items-center gap-4">
        <Controller
          name="code"
          control={control}
          rules={{ validate: (value) => value.length === 6 || "Enter all 6 digits." }}
          render={({ field, fieldState }) => (
            <div className="flex flex-col items-center gap-2">
              <OtpInput
                value={field.value}
                onChange={(value) => {
                  setWrong(false);
                  field.onChange(value);
                }}
              />
              {(wrong || fieldState.error) && <span className="text-xs text-danger">{wrong ? "That code isn't right. Try again." : fieldState.error?.message}</span>}
            </div>
          )}
        />
        <p className="flex items-center gap-1.5 text-sm text-text">
          Didn't receive it?
          {left > 0 ? (
            <span className="flex items-center gap-1 text-primary">
              <Timer className="h-4 w-4" />
              Resend code in 0:{String(left).padStart(2, "0")}
            </span>
          ) : (
            <button type="button" onClick={resend} className="font-semibold text-primary hover:underline">
              Send again
            </button>
          )}
        </p>
        <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
          Verify
          <CheckCircle2 className="h-4 w-4" />
        </Button>
        {/* TODO: remove once real email/SMS delivery exists. */}
        <p className="text-xs text-text-muted">Demo code: {MOCK_VERIFICATION_CODE}</p>
      </form>
    </Card>
  );
}
