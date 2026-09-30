import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowRight, UserRound } from "lucide-react";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { PasswordField } from "../../../components/PasswordField";
import { PasswordChecklist } from "../../../components/PasswordChecklist";
import { meetsPasswordRules } from "../../../lib/passwordRules";
import { isBusinessEmailAvailable } from "../businessAccounts";
import { ACCOUNT_DEFAULTS, EMAIL_PATTERN, PHONE_RULE, type AccountValues } from "../registerForm";
import { FormSection } from "./FormSection";

// TODO: point at the final Terms page URL once the website domain is live.
const TERMS_URL = "https://www.kiarelay.com/terms";

interface AccountStepProps {
  initial?: AccountValues;
  onContinue: (values: AccountValues) => Promise<void> | void;
}

// Step 1, "Account": the owner who signs in. Not in the screenshots, so it
// uses the Personal sign-up's fields (agreed plan, 2026-09-29), plus password
// confirmation and terms, which the web has always asked for. Names are split
// into First / Last (user rule, 2026-09-30).
export function AccountStep({ initial, onContinue }: AccountStepProps) {
  const { control, handleSubmit, formState } = useForm<AccountValues>({ defaultValues: initial ?? ACCOUNT_DEFAULTS, mode: "onTouched" });
  const password = useWatch({ control, name: "password" });

  return (
    <form onSubmit={handleSubmit(onContinue)} className="flex flex-col gap-6">
      <FormSection title="Account Owner" icon={UserRound}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={control} name="firstName" label="First Name *" placeholder="e.g. Jennifer" rules={{ required: "Enter your first name." }} />
          <FormField control={control} name="lastName" label="Last Name *" placeholder="e.g. Walsh" rules={{ required: "Enter your last name." }} />
        </div>
        <FormField control={control} name="phone" label="Phone Number *" placeholder="+1 (713) 555-0100" rules={{ required: "Enter your phone number.", ...PHONE_RULE }} />
        <FormField
          control={control}
          name="email"
          label="Work Email *"
          placeholder="you@company.com"
          rules={{
            required: "Enter your work email.",
            pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address." },
            validate: (value) => isBusinessEmailAvailable(String(value)) || "This email is already registered. Sign in instead.",
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField control={control} name="password" label="Password *" rules={{ validate: (value) => meetsPasswordRules(String(value)) || "Meet every requirement below." }} />
          <PasswordField control={control} name="confirmPassword" label="Confirm Password *" rules={{ validate: (value, values) => value === values.password || "Passwords don't match." }} />
        </div>
        <PasswordChecklist value={password} />
        <Controller
          name="agree"
          control={control}
          rules={{ validate: (value) => value || "Accept the terms to continue." }}
          render={({ field: { value, onChange }, fieldState }) => (
            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-2 text-sm text-text">
                <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
                <span>
                  I'm authorized to open this account for my company and accept the{" "}
                  <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                    Terms of Service
                  </a>
                  .
                </span>
              </label>
              {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
            </div>
          )}
        />
      </FormSection>
      <Button type="submit" className="self-end" disabled={formState.isSubmitting}>
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
