import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Clock, LogOut, Mail, XCircle } from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { ConfirmModal } from "../../components/ConfirmModal";
import { cn } from "../../lib/cn";
import { BUSINESS_BRAND } from "../../constants/brand";
import { businessLogout, getBusinessSession, useBusinessAccounts, type BusinessAccount } from "./businessAccounts";

const SUPPORT_EMAIL = "support@kiarelay.com";

const STATUS_COPY: Record<BusinessAccount["status"], { title: string; body: string; icon: typeof Clock; tone: string }> = {
  pending: { title: "Verification in progress", body: "Our compliance team is reviewing your company details, usually within 1–2 business days. We'll email you as soon as it's done.", icon: Clock, tone: "bg-tag-warning-bg text-tag-warning-fg" },
  verified: { title: "Your company is verified", body: "Your account is active. Book and track deliveries for your company in the KiaRelay app by choosing KiaRelay Business.", icon: CheckCircle2, tone: "bg-tag-healthcare-bg text-tag-healthcare-fg" },
  rejected: { title: "We couldn't verify your company", body: "Some details didn't match our records. Contact support and we'll help you fix it.", icon: XCircle, tone: "bg-tag-danger-bg text-tag-danger-fg" },
};

// Where a KiaRelay Business admin lands after registering or signing in
// (TC-15, "registration + login only" scope). It shows verification status,
// read live so an admin's decision in Customer Management appears here, and
// the details on file.
// TODO: grow into the business portal (orders, invoices, team) in a later phase.
export function BusinessAccountPage() {
  const navigate = useNavigate();
  const accounts = useBusinessAccounts();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const session = getBusinessSession();
  const account = accounts.find((a) => a.id === session?.id);
  if (!account) return <Navigate to="/business/login" replace />;

  const status = STATUS_COPY[account.status];
  const steps = [
    { label: "Registered", done: true },
    { label: "Under review", done: account.status !== "pending" },
    { label: account.status === "rejected" ? "Needs attention" : "Verified", done: account.status === "verified" },
  ];
  const details: [string, string][] = [
    ["Account ID", account.id],
    ["Legal name", account.companyName],
    ["Registration / EIN", account.registrationNumber],
    ["Industry", account.industry],
    ["Address", `${account.address}, ${account.city}, ${account.state} ${account.postalCode}`],
    ["Account admin", `${account.contactName} · ${account.contactTitle}`],
    ["Sign-in email", account.email],
  ];

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <img src="/kia-relay-logo.svg" alt="KiaRelay" className="h-9 w-auto" />
          <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline">{BUSINESS_BRAND}</span>
        </div>
        <Button variant="secondary" onClick={() => setConfirmLogout(true)}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-8">
        <div>
          <h1 className="text-heading-1 flex items-center gap-2 text-text">
            <Building2 className="h-6 w-6 text-primary" />
            {account.companyName}
          </h1>
          <p className="text-body mt-1 text-text-muted">Welcome, {account.contactName.split(" ")[0]}.</p>
        </div>
        <Card className="flex flex-col gap-4">
          <div className={cn("flex items-start gap-3 rounded-lg p-4", status.tone)}>
            <status.icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">{status.title}</p>
              <p className="mt-1 text-sm">{status.body}</p>
            </div>
          </div>
          <ol className="grid grid-cols-3 gap-2" aria-label="Verification progress">
            {steps.map((s) => (
              <li key={s.label} className="flex flex-col gap-1.5">
                <span className={cn("h-1.5 rounded-full", s.done ? "bg-primary" : "bg-border")} />
                <span className={cn("text-xs", s.done ? "font-medium text-text" : "text-text-muted")}>{s.label}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-text">Company details</h2>
          <dl className="flex flex-col divide-y divide-border text-sm">
            {details.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="text-text-muted">{label}</dt>
                <dd className="font-medium text-text sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>
          <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${BUSINESS_BRAND} account ${account.id}`)}`} className="flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Mail className="h-4 w-4" />
            Need to change something? Email {SUPPORT_EMAIL}
          </a>
        </Card>
      </main>
      {confirmLogout && (
        <ConfirmModal
          title="Sign out?"
          message={`You'll need your email and password to sign back in to ${BUSINESS_BRAND}.`}
          confirmLabel="Sign Out"
          onCancel={() => setConfirmLogout(false)}
          onConfirm={() => {
            businessLogout();
            navigate("/business/login", { replace: true });
          }}
        />
      )}
    </div>
  );
}
