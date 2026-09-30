import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LogOut, Mail } from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { ConfirmModal } from "../../components/ConfirmModal";
import { BUSINESS_BRAND } from "../../constants/brand";
import { businessLogout, getBusinessSession, useBusinessAccounts } from "./businessAccounts";
import { fullName, industryLabel } from "./businessTypes";
import { BusinessStatusHero } from "./components/BusinessStatusHero";
import { SubmittedDocumentsCard } from "./components/SubmittedDocumentsCard";

const SUPPORT_EMAIL = "support@kiarelay.com";

// Where a KiaRelay Business user lands after registering or signing in. The
// top is the "Verification Status" design (Application Submitted / You're
// all set), then the company details and documents on file.
// TODO: grow into the business portal (orders, invoices, team) once those
// designs are shared.
export function BusinessAccountPage() {
  const navigate = useNavigate();
  const accounts = useBusinessAccounts();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const session = getBusinessSession();
  const account = accounts.find((a) => a.id === session?.id);
  if (!account) return <Navigate to="/login" replace />;

  const { company, owner } = account;
  const details: [string, string][] = [
    ["Account ID", account.id],
    ["Legal name", company.dba ? `${company.legalName} (DBA ${company.dba})` : company.legalName],
    ["EIN / Tax ID", company.ein],
    ["Industry · Type", `${industryLabel(company)} · ${company.companyType}`],
    ["Address", `${company.street}, ${company.city}, ${company.state} ${company.zip}`],
    ["Primary contact", `${fullName(company.contactFirstName, company.contactLastName)}, ${company.contactTitle} · ${company.contactEmail} · ${company.contactPhone}`],
    ["Account owner (sign-in)", `${fullName(owner.firstName, owner.lastName)} · ${owner.email} · ${owner.phone}`],
  ];

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <img src="/business/logo.png" alt="KiaRelay" className="h-9 w-auto" />
          <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline">{BUSINESS_BRAND}</span>
        </div>
        <Button variant="secondary" onClick={() => setConfirmLogout(true)}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </header>
      <main className="mx-auto flex max-w-4xl flex-col gap-6 p-4 sm:p-8">
        <p className="text-sm text-text-muted">
          Welcome, {owner.firstName} · {company.legalName}
        </p>
        <BusinessStatusHero account={account} />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-text">Company details</h2>
            <dl className="flex flex-col divide-y divide-border text-sm">
              {details.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5 py-2.5">
                  <dt className="text-text-muted">{label}</dt>
                  <dd className="font-medium text-text">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <SubmittedDocumentsCard account={account} />
        </div>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${BUSINESS_BRAND} account ${account.id}`)}`}
          className="flex w-fit items-center gap-2 self-center text-sm font-medium text-primary hover:underline"
        >
          <Mail className="h-4 w-4" />
          Need to change something? Email {SUPPORT_EMAIL}
        </a>
      </main>
      {confirmLogout && (
        <ConfirmModal
          title="Sign out?"
          message={`You'll need your email and password to sign back in to ${BUSINESS_BRAND}.`}
          confirmLabel="Sign Out"
          onCancel={() => setConfirmLogout(false)}
          onConfirm={() => {
            businessLogout();
            navigate("/login", { replace: true });
          }}
        />
      )}
    </div>
  );
}
