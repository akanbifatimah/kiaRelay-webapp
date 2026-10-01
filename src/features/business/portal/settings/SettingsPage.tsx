import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CreditCard, FileText, HelpCircle, KeyRound, LogOut, MapPin, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { BUSINESS_BRAND, PRIVACY_URL, TERMS_URL } from "../../../../constants/brand";
import { cn } from "../../../../lib/cn";
import { findCustomer } from "../../../customers/data";
import { getCustomerDetail } from "../../../customers/customerDetails";
import { businessLogout } from "../../businessAccounts";
import { ProfileCard } from "../account/ProfileCard";
import { usePortalAccount } from "../usePortalAccount";
import { verificationLevel } from "./verification";
import { SettingsGroup, SettingsRow } from "./SettingsList";

// Settings (2026-10-01): the app's Account Settings design and Settings
// screen for the KiaRelay Business portal — profile header, account rows,
// security, about, Sign Out and Close Company Account.
export function SettingsPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  if (!account) return null;
  const level = verificationLevel(account);
  const customer = findCustomer(account.id);
  const card = customer ? getCustomerDetail(customer).paymentMethods.find((m) => m.type === "card" && m.isDefault) : undefined;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text">Settings</h1>
      <ProfileCard account={account} />
      <SettingsGroup title="Account">
        <SettingsRow icon={UserRound} label="Personal Information" detail="Name, phone and sign-in email" to="/business/settings/personal" />
        <SettingsRow
          icon={ShieldCheck}
          label="Verification Status"
          to="/business/settings/verification"
          trailing={<span className={cn("text-xs font-semibold", level === 3 ? "text-success" : "text-warning")}>Level {level} {level === 3 ? "Complete" : "of 3"}</span>}
        />
        <SettingsRow icon={Bell} label="Notification Preferences" detail="Deliveries, incidents, billing" to="/business/settings/notifications" />
        <SettingsRow icon={CreditCard} label="Payment Methods" detail={card ? card.label : "Invoices on net terms"} to="/business/settings/payment-methods" />
        <SettingsRow icon={MapPin} label="Saved Locations" to="/business/locations" />
      </SettingsGroup>
      <SettingsGroup title="Security">
        <SettingsRow icon={KeyRound} label="Change Password" to="/business/settings/password" />
      </SettingsGroup>
      <SettingsGroup title="About">
        <SettingsRow icon={HelpCircle} label="Support & FAQ" detail="Chat, call or browse answers" to="/business/help" />
        <SettingsRow icon={FileText} label="Terms of Service" href={TERMS_URL} />
        <SettingsRow icon={ShieldCheck} label="Privacy Policy" href={PRIVACY_URL} />
      </SettingsGroup>
      <SettingsGroup>
        <SettingsRow icon={LogOut} label="Sign Out" tone="danger" onClick={() => setConfirmSignOut(true)} />
        <SettingsRow icon={Trash2} label="Close Company Account" tone="danger" onClick={() => navigate("/business/settings/close")} />
      </SettingsGroup>
      {confirmSignOut && (
        <ConfirmModal
          title="Sign out?"
          message={`You'll need your email and password to sign back in to ${BUSINESS_BRAND}.`}
          confirmLabel="Sign Out"
          onCancel={() => setConfirmSignOut(false)}
          onConfirm={() => {
            businessLogout();
            navigate("/login", { replace: true });
          }}
        />
      )}
    </div>
  );
}
