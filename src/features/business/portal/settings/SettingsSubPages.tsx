import { Link } from "react-router-dom";
import { CreditCard, Landmark, Mail } from "lucide-react";
import { Card } from "../../../../components/Card";
import { cn } from "../../../../lib/cn";
import { findCustomer } from "../../../customers/data";
import { getCustomerDetail } from "../../../customers/customerDetails";
import { PersonalInfoCard } from "../account/PersonalInfoCard";
import { NotificationPrefsCard, VerificationCard } from "../account/VerificationPrefsCards";
import { usePortalAccount } from "../usePortalAccount";
import { portalTerms } from "../usePortalData";
import { SettingsSubPage } from "./SettingsList";

const SUPPORT_EMAIL = "support@kiarelay.com";

export function PersonalSettingsPage() {
  const account = usePortalAccount();
  if (!account) return null;
  return (
    <SettingsSubPage title="Personal Information" subtitle="Your name and phone. A new phone number is verified by code.">
      <PersonalInfoCard account={account} />
    </SettingsSubPage>
  );
}

export function VerificationSettingsPage() {
  const account = usePortalAccount();
  if (!account) return null;
  return (
    <SettingsSubPage title="Verification Status" subtitle="Booking opens once every level is complete.">
      <VerificationCard account={account} />
      {account.status !== "verified" && <Link to="/business/company" className="text-sm font-medium text-primary hover:underline">See your application and documents</Link>}
    </SettingsSubPage>
  );
}

export function NotificationSettingsPage() {
  const account = usePortalAccount();
  if (!account) return null;
  return (
    <SettingsSubPage title="Notification Preferences" subtitle="Choose the emails we send you.">
      <NotificationPrefsCard account={account} />
    </SettingsSubPage>
  );
}

// Payment Methods (2026-10-01; a row on the Account Settings design — first
// pass): the company's methods on file (admin's record) and its terms.
// Adding or removing goes through billing, since they settle invoices.
// TODO: a self-serve add-card/ACH flow with the payment processor.
export function PaymentSettingsPage() {
  const account = usePortalAccount();
  if (!account) return null;
  const customer = findCustomer(account.id);
  const methods = customer ? getCustomerDetail(customer).paymentMethods : [];
  const terms = portalTerms(account);
  return (
    <SettingsSubPage title="Payment Methods" subtitle={`Invoices settle on ${terms.paymentTerms.replace("net-", "Net ")} terms by ACH or card.`}>
      <Card className="flex flex-col p-0">
        {methods.length === 0 && <p className="p-4 text-sm text-text-muted">No payment methods on file yet.</p>}
        {methods.map((m) => {
          const Icon = m.type === "bank" ? Landmark : CreditCard;
          return (
            <div key={m.id} className="flex items-center gap-3 border-b border-border p-4 last:border-0">
              <Icon className="h-5 w-5 text-sidebar" />
              <span className="flex-1 text-sm">
                <span className="block font-medium text-text">{m.label}</span>
                <span className="block text-xs text-text-muted">{m.type === "bank" ? `ACH · ${m.accountType ?? m.detail}` : m.detail}</span>
              </span>
              {m.isDefault && <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">DEFAULT</span>}
              <span className={cn("text-xs font-semibold", m.status === "verified" ? "text-success" : "text-warning")}>{m.status === "verified" ? "Active" : "Pending"}</span>
            </div>
          );
        })}
      </Card>
      <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Payment methods for ${account.id}`)}`} className="flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline">
        <Mail className="h-4 w-4" /> Add or change a payment method
      </a>
    </SettingsSubPage>
  );
}
