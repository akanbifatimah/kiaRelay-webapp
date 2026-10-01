import { useEffect, useMemo, useState } from "react";
import { findCustomer } from "../../customers/data";
import { getCustomerDetail, type CreditTerms } from "../../customers/customerDetails";
import type { Invoice } from "../../customers/companyInvoices";
import { useCustomerDeliveries } from "../deliveries/deliveriesStore";
import { buildBilling, outstandingTotal, type InvoiceFrequency } from "../deliveries/invoices";
import { paidInvoices, useBillingState } from "../deliveries/billingStore";
import { companyFrequency, detailOf } from "../deliveries/invoiceBridge";
import type { DeliveryOrder } from "../deliveries/deliveryTypes";
import type { BusinessAccount } from "../businessAccounts";
import type { BranchUser } from "../../customers/companyBranches";
import { companyBranchesOverviews } from "../../customers/companyBranchesData";
import { useCompanyTeam } from "../../customers/companyTeamStore";

/** The current time, re-read every `intervalMs` — drives live delivery stages. */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export const usePortalDeliveries = (account: BusinessAccount | undefined): DeliveryOrder[] => useCustomerDeliveries(account?.id);

/** The company's credit terms as admin set them; new companies get Net 30
 * up to their requested limit. TODO: GET /customers/:id/credit-terms. */
export function portalTerms(account: BusinessAccount): CreditTerms {
  const customer = findCustomer(account.id);
  const terms = customer ? getCustomerDetail(customer).creditTerms : undefined;
  return (
    terms ?? {
      creditLimit: Number(account.creditApplication?.requestedLimit.replace(/\D/g, "")) || 10000,
      outstandingBalance: 0,
      paymentTerms: "net-30",
      interestRate: 1.5,
      accountStatus: account.status === "verified" ? "active" : "review-required",
    }
  );
}

export interface PortalBilling {
  invoices: Invoice[];
  terms: CreditTerms | undefined;
  frequency: InvoiceFrequency;
  unbilled: DeliveryOrder[];
  nextInvoiceOn?: number;
}

/** Invoices on the company's Invoice Frequency, payments and live terms —
 * the same rows admin sees (shared billingStore). */
export function usePortalBilling(account: BusinessAccount | undefined): PortalBilling {
  const deliveries = usePortalDeliveries(account);
  const billingState = useBillingState();
  return useMemo(() => {
    if (!account) return { invoices: [], terms: undefined, frequency: "Per Delivery", unbilled: [] };
    const base = portalTerms(account);
    const frequency = billingState.frequency[account.id] ?? companyFrequency(account.id, detailOf);
    const billing = buildBilling(deliveries, { frequency, termsDays: Number(base.paymentTerms.slice(4)), payments: paidInvoices(billingState, account.id) });
    return { ...billing, frequency, terms: { ...base, outstandingBalance: outstandingTotal(billing.invoices) } };
  }, [account, deliveries, billingState]);
}

/** The company's users (shared with admin); a new company starts with its owner. */
export function usePortalTeam(account: BusinessAccount | undefined): BranchUser[] {
  const team = useCompanyTeam(account?.id);
  return useMemo(() => {
    if (!account || team.length) return team;
    return [{ id: "bu-owner", firstName: account.owner.firstName, lastName: account.owner.lastName, email: account.owner.email, role: "admin", branchAssignment: ALL_BRANCHES, status: "active", lastActive: "Just now" }];
  }, [account, team]);
}

export const ALL_BRANCHES = "Global - All Branches";

/** Branch names for billing a delivery (admin's branch cards), or "HQ". */
export function portalBranches(account: BusinessAccount): string[] {
  const branches = companyBranchesOverviews[account.id]?.branches.map((b) => b.name);
  return branches?.length ? branches : ["HQ"];
}
