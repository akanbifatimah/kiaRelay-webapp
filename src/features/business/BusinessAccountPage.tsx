import { Mail } from "lucide-react";
import { Card } from "../../components/Card";
import { PageHeader } from "../../components/PageHeader";
import { BUSINESS_BRAND } from "../../constants/brand";
import { companyTypeLabel, fullName, industryLabel } from "./businessTypes";
import { BusinessStatusHero } from "./components/BusinessStatusHero";
import { SubmittedDocumentsCard } from "./components/SubmittedDocumentsCard";
import { usePortalAccount } from "./portal/usePortalAccount";

const SUPPORT_EMAIL = "support@kiarelay.com";

// The portal's Company page (/business/company). It was the whole business
// account until the portal shell arrived (2026-09-30): the "Verification
// Status" design (Application Submitted / You're all set), then the company
// details and documents on file. The shell handles sign-in and sign-out.
export function BusinessAccountPage() {
  const account = usePortalAccount();
  if (!account) return null;

  const { company, owner } = account;
  const details: [string, string][] = [
    ["Account ID", account.id],
    ["Legal name", company.dba ? `${company.legalName} (DBA ${company.dba})` : company.legalName],
    ["EIN / Tax ID", company.ein],
    ["Industry · Type", `${industryLabel(company)} · ${companyTypeLabel(company)}`],
    ["Address", `${company.street}, ${company.city}, ${company.state} ${company.zip}`],
    ["Primary contact", `${fullName(company.contactFirstName, company.contactLastName)}, ${company.contactTitle} · ${company.contactEmail} · ${company.contactPhone}`],
    ["Account owner (sign-in)", `${fullName(owner.firstName, owner.lastName)} · ${owner.email} · ${owner.phone}`],
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader title="Company" subtitle={`Your ${BUSINESS_BRAND} account, verification and documents.`} />
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
    </div>
  );
}
