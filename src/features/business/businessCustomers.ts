import type { Customer, VerificationStatus } from "../customers/data";
import { getBusinessAccounts, setBusinessStatus, type BusinessAccount } from "./businessAccounts";

const TO_VERIFICATION: Record<BusinessAccount["status"], VerificationStatus> = { pending: "pending", verified: "verified", rejected: "failed" };

/**
 * Adds web-registered KiaRelay Business accounts (TC-15) to the admin's
 * company customer list, so a new registration lands in the existing
 * "Review Verification" flow. Accounts already in the list keep their row.
 * TODO: unnecessary once GET /customers returns registrations server-side.
 */
export function withRegisteredBusinesses(customers: Customer[]): Customer[] {
  const known = new Set(customers.map((customer) => customer.id));
  const registered = getBusinessAccounts()
    .filter((account) => !known.has(account.id))
    .map<Customer>((account) => ({
      id: account.id,
      name: account.company.legalName,
      accountType: "company",
      status: "active",
      verification: TO_VERIFICATION[account.status],
      orders: 0,
      lastActivity: "Registered on the web",
    }));
  return [...registered, ...customers];
}

/** An admin's verification decision updates the business's own account page. */
export function recordBusinessVerification(customerId: string, verification: VerificationStatus): void {
  if (!getBusinessAccounts().some((account) => account.id === customerId)) return;
  setBusinessStatus(customerId, verification === "verified" ? "verified" : verification === "failed" ? "rejected" : "pending");
}
