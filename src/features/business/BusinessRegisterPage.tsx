import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { cn } from "../../lib/cn";
import { BUSINESS_BRAND } from "../../constants/brand";
import { AuthLayout } from "../auth/AuthLayout";
import { businessLogin, getBusinessSession, registerBusiness } from "./businessAccounts";
import { REGISTER_DEFAULTS, REGISTER_STEPS, type RegisterValues } from "./registerForm";
import { RegisterAddressStep, RegisterCompanyStep } from "./components/RegisterCompanySteps";
import { RegisterAdminStep } from "./components/RegisterAdminStep";

// KiaRelay Business registration (TC-15, 2026-09-28). Four steps on one
// react-hook-form instance; each step validates only its own fields before
// moving on. Submitting creates a pending company account that KiaRelay
// admins review under KiaRelay Business Accounts, then signs the admin in.
// TODO: POST /business/register (with document upload) once the API exists.
export function BusinessRegisterPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { control, handleSubmit, trigger, getValues } = useForm<RegisterValues>({ defaultValues: REGISTER_DEFAULTS, mode: "onTouched" });

  if (getBusinessSession()) return <Navigate to="/business/account" replace />;

  const last = step === REGISTER_STEPS.length - 1;

  async function next() {
    if (await trigger(REGISTER_STEPS[step].fields)) setStep((s) => s + 1);
  }

  const submit = handleSubmit(({ confirmPassword: _confirm, agree: _agree, ...registration }) => {
    const account = registerBusiness(registration);
    businessLogin(account.email);
    showToast("success", `${account.companyName} is registered. We'll verify it shortly.`);
    navigate("/business/account", { replace: true });
  });

  const values = getValues();
  const review: [string, string][] = [
    ["Company", `${values.companyName} · ${values.registrationNumber}`],
    ["Industry", `${values.industry} · ${values.monthlyVolume} deliveries / month`],
    ["Address", `${values.address}, ${values.city}, ${values.state} ${values.postalCode}`],
    ["Company phone", values.companyPhone],
    ["Account admin", `${values.contactName}, ${values.contactTitle}`],
    ["Sign-in email", values.email],
  ];

  return (
    <AuthLayout wide backTo="/business">
      <div className="pb-5 text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Building2 className="h-3.5 w-3.5" />
          {BUSINESS_BRAND}
        </p>
        <h1 className="mt-3 text-lg font-semibold text-text">Register your company</h1>
        <p className="text-body mt-1 text-text-muted">Company accounts are verified by KiaRelay before activation.</p>
      </div>

      <ol className="mb-6 grid grid-cols-4 gap-2" aria-label="Registration steps">
        {REGISTER_STEPS.map((s, index) => (
          <li key={s.title} className="flex flex-col gap-1.5">
            <span className={cn("h-1.5 rounded-full", index <= step ? "bg-primary" : "bg-border")} />
            <span className={cn("text-xs", index === step ? "font-semibold text-text" : "text-text-muted")} aria-current={index === step ? "step" : undefined}>
              {index + 1}. {s.title}
            </span>
          </li>
        ))}
      </ol>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (last) void submit();
          else void next();
        }}
        className="flex flex-col gap-5"
      >
        <p className="text-sm text-text-muted">{REGISTER_STEPS[step].subtitle}</p>
        {step === 0 && <RegisterCompanyStep control={control} />}
        {step === 1 && <RegisterAddressStep control={control} />}
        {step === 2 && <RegisterAdminStep control={control} />}
        {last && (
          <dl className="flex flex-col divide-y divide-border rounded-lg border border-border text-sm">
            {review.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="text-text-muted">{label}</dt>
                <dd className="font-medium text-text sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit">{last ? "Submit Registration" : "Continue"}</Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already registered?{" "}
        <Link to="/business/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
