import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useToast } from "../../components/toast/ToastContext";
import { businessLogin, getBusinessSession, registerBusiness } from "./businessAccounts";
import { sendVerificationCode } from "./contactVerification";
import type { BusinessDocumentKey, CompanyDetails, CreditApplication, UploadedDocument } from "./businessTypes";
import { DETAILS_DEFAULTS, formatPhone, STAGE_STEP, type AccountValues, type RegisterStage } from "./registerForm";
import { RegisterShell } from "./components/RegisterShell";
import { AccountStep } from "./components/AccountStep";
import { CodeVerifyStep } from "./components/CodeVerifyStep";
import { DetailsStep } from "./components/DetailsStep";
import { DocumentsStep } from "./components/DocumentsStep";

// Back from either code screen returns to Account, so a changed email or
// phone is always re-verified on the way forward.
const PREVIOUS: Record<RegisterStage, RegisterStage | null> = { account: null, "verify-email": "account", "verify-phone": "account", details: "account", documents: "details" };

// KiaRelay Business registration, rebuilt to the Figma "Sign Up: Business"
// design (2026-09-29) and matching the mobile app:
//   Account → Verify email → Verify phone → Details → Documents → "Application Submitted"
// (the account page). Each stage keeps its own form; values live here, so
// Back returns to a filled-in step.
// TODO: POST /business/register (with document upload) once the API exists.
export function BusinessRegisterPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [stage, setStage] = useState<RegisterStage>("account");
  const [account, setAccount] = useState<AccountValues>();
  const [company, setCompany] = useState<CompanyDetails>();
  const [documents, setDocuments] = useState<Partial<Record<BusinessDocumentKey, UploadedDocument>>>({});
  const [creditApplication, setCreditApplication] = useState<CreditApplication>();
  const [submitting, setSubmitting] = useState(false);

  if (getBusinessSession()) return <Navigate to="/business/account" replace />;

  async function handleAccount(values: AccountValues) {
    const next = { ...values, firstName: values.firstName.trim(), lastName: values.lastName.trim(), email: values.email.trim().toLowerCase(), phone: formatPhone(values.phone) };
    setAccount(next);
    await sendVerificationCode("email", next.email);
    setStage("verify-email");
  }

  async function handleEmailVerified() {
    if (account) await sendVerificationCode("phone", account.phone);
    setStage("verify-phone");
  }

  function submit() {
    if (!account || !company) return setStage("account");
    setSubmitting(true);
    const created = registerBusiness({
      owner: { firstName: account.firstName, lastName: account.lastName, email: account.email, phone: account.phone },
      password: account.password,
      emailVerified: true,
      phoneVerified: true,
      company,
      documents,
      creditApplication,
    });
    businessLogin(created.owner.email);
    showToast("success", `Application submitted. Reference #${created.reference}.`);
    navigate("/business/account", { replace: true });
  }

  const previous = PREVIOUS[stage];
  // The account owner is usually the primary contact, so prefill it (editable).
  const detailsInitial = company ?? {
    ...DETAILS_DEFAULTS,
    contactFirstName: account?.firstName ?? "",
    contactLastName: account?.lastName ?? "",
    contactEmail: account?.email ?? "",
    contactPhone: account?.phone ?? "",
  };

  return (
    <RegisterShell step={STAGE_STEP[stage]} onBack={previous ? () => setStage(previous) : undefined}>
      {stage === "account" && <AccountStep initial={account} onContinue={handleAccount} />}
      {stage === "verify-email" && account && <CodeVerifyStep channel="email" target={account.email} onVerified={handleEmailVerified} />}
      {stage === "verify-phone" && account && <CodeVerifyStep channel="phone" target={account.phone} onVerified={() => setStage("details")} />}
      {stage === "details" && (
        <DetailsStep
          initial={detailsInitial}
          onContinue={(values) => {
            setCompany({
              ...values,
              legalName: values.legalName.trim(),
              dba: values.dba.trim(),
              contactFirstName: values.contactFirstName.trim(),
              contactLastName: values.contactLastName.trim(),
              contactPhone: formatPhone(values.contactPhone),
            });
            setStage("documents");
          }}
        />
      )}
      {stage === "documents" && (
        <DocumentsStep
          documents={documents}
          onDocumentsChange={setDocuments}
          creditApplication={creditApplication}
          onCreditApplicationChange={setCreditApplication}
          submitting={submitting}
          onSubmit={submit}
        />
      )}
      <p className="mt-8 text-center text-sm text-text-muted">
        Already have a company account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </RegisterShell>
  );
}
