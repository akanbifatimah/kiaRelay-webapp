import { Controller, useWatch, type Control } from "react-hook-form";
import { FormField } from "../../../components/FormField";
import { PasswordField } from "../../../components/PasswordField";
import { PasswordChecklist } from "../../../components/PasswordChecklist";
import { meetsPasswordRules } from "../../../lib/passwordRules";
import { isBusinessEmailAvailable } from "../businessAccounts";
import { PHONE_RULE, type RegisterValues } from "../registerForm";

// TODO: point at the real Terms page once the website URL is final.
const TERMS_URL = "https://www.kiarelay.com/terms";

/** Step 3: the authorized signatory who owns the web sign-in (TC-15). */
export function RegisterAdminStep({ control }: { control: Control<RegisterValues> }) {
  const password = useWatch({ control, name: "password" });
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField control={control} name="contactName" label="Full Name *" placeholder="e.g. Jennifer Walsh" rules={{ required: "Name is required." }} />
        <FormField control={control} name="contactTitle" label="Job Title *" placeholder="e.g. Procurement Manager" rules={{ required: "Job title is required." }} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="email"
          label="Work Email *"
          placeholder="you@company.com"
          rules={{
            required: "Email is required.",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
            validate: (value) => isBusinessEmailAvailable(String(value)) || "This email is already registered. Sign in instead.",
          }}
        />
        <FormField control={control} name="contactPhone" label="Mobile Phone *" placeholder="+1 (713) 555-0187" rules={{ required: "Phone is required.", ...PHONE_RULE }} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordField control={control} name="password" label="Password *" rules={{ validate: (value) => meetsPasswordRules(String(value)) || "Meet every requirement below." }} />
        <PasswordField control={control} name="confirmPassword" label="Confirm Password *" rules={{ validate: (value, values) => value === values.password || "Passwords don't match." }} />
      </div>
      <PasswordChecklist value={password} />
      <Controller
        name="agree"
        control={control}
        rules={{ validate: (value) => value || "You need to accept the terms to register." }}
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
    </div>
  );
}
