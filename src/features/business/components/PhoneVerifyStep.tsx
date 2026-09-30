import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CheckCircle2, Timer } from "lucide-react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { OtpInput } from "../../../components/OtpInput";
import { MOCK_PHONE_CODE, sendPhoneCode, verifyPhoneCode } from "../phoneVerification";

const RESEND_SECONDS = 30;

// "Phone Verification" design, between Account and Details (agreed flow,
// 2026-09-29): 6-digit code, resend timer, Verify.
export function PhoneVerifyStep({ phone, onVerified }: { phone: string; onVerified: () => void }) {
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
    await sendPhoneCode(phone);
    setLeft(RESEND_SECONDS);
  }

  const verify = handleSubmit(async ({ code }) => {
    if (await verifyPhoneCode(code)) onVerified();
    else setWrong(true);
  });

  return (
    <Card className="mx-auto flex max-w-md flex-col items-center gap-6 py-8 text-center">
      <img src="/business/verify-phone.webp" alt="" className="h-40 w-40 rounded-3xl object-cover" />
      <div>
        <h2 className="text-2xl font-bold text-text">Verify your phone</h2>
        <p className="mt-1 text-sm text-text-muted">We sent a 6-digit code to</p>
        <p className="text-sm font-semibold text-text">{phone}</p>
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
        {/* TODO: remove once real SMS delivery exists. */}
        <p className="text-xs text-text-muted">Demo code: {MOCK_PHONE_CODE}</p>
      </form>
    </Card>
  );
}
