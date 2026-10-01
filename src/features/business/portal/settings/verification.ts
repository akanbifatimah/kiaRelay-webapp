import type { BusinessAccount } from "../../businessAccounts";

export interface VerificationStep {
  label: string;
  detail: string;
  done: boolean;
  /** Waiting on KiaRelay rather than the customer. */
  pending?: boolean;
}

// Verification levels (2026-10-01), same steps as the app's
// lib/verificationLevel.ts for a business: email → phone → company documents.
export function verificationSteps(account: BusinessAccount): VerificationStep[] {
  return [
    { label: "Email address", detail: account.owner.email, done: account.emailVerified },
    { label: "Phone number", detail: account.owner.phone, done: account.phoneVerified },
    {
      label: "Company documents",
      detail: account.status === "verified" ? "Approved by KiaRelay" : account.status === "rejected" ? "Needs attention — contact support" : `Under review (Ref ${account.reference})`,
      done: account.status === "verified",
      pending: account.status === "pending",
    },
  ];
}

export const verificationLevel = (account: BusinessAccount) => verificationSteps(account).filter((s) => s.done).length;
