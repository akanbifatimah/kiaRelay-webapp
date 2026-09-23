import { createStore, useStore } from "../../lib/createStore";
import { customers, type Customer } from "../customers/data";
import { getCustomerDetail, paymentTermsLabel, type CustomerDetail } from "../customers/customerDetails";
import { getCompanyBranchesOverview } from "../customers/companyBranches";
import { getCompanyInvoicingOverview } from "../customers/companyInvoices";
import { getCompanyOverview } from "../customers/companyOverview";
import type { LatLng } from "../../types/geo";

export interface ActiveDelivery {
  id: string;
  eta: string;
  path: LatLng[];
  progress: number;
}

export interface CustomerSupportProfile {
  customer: Customer;
  detail: CustomerDetail;
  tier: string;
  primaryContact: string;
  contactEmail: string;
  /** Tickets from before this session's mock window — added to the live count. */
  historicalTickets: number;
  deliveries: ActiveDelivery[];
  hub: LatLng;
  locations: { name: string; address: string; kind: "hq" | "branch" }[];
  account: { hasPastDue: boolean; pastDue: string; pastDueNote: string; nextInvoice: string; paymentTerms: string } | null;
  activity: { title: string; detail: string; time: string; tone: "primary" | "muted" }[];
}

const CHICAGO_HQ: LatLng = { lat: 41.8781, lng: -87.6298 };

// Two in-flight Chicago-metro deliveries (matching the screenshot's
// DEL-9921/DEL-9922 cards) plotted along real expressways out of the HQ.
const DELIVERIES: ActiveDelivery[] = [
  { id: "DEL-9921", eta: "ETA: 14:30 EST", progress: 0.6, path: [CHICAGO_HQ, { lat: 41.8527, lng: -87.7047 }, { lat: 41.8347, lng: -87.8409 }, { lat: 41.8023, lng: -87.9723 }, { lat: 41.7508, lng: -88.1535 }] },
  { id: "DEL-9922", eta: "ETA: 16:15 EST", progress: 0.35, path: [CHICAGO_HQ, { lat: 41.9294, lng: -87.6431 }, { lat: 41.9965, lng: -87.6671 }, { lat: 42.0451, lng: -87.6877 }, { lat: 42.1103, lng: -87.7337 }] },
];

// TODO: replace with GET /support/customers/:id once the Support API exists.
// Built on the customer's real Customer Management records — branches,
// invoices, billing config — so "View Full Profile" opens the same account.
export function getCustomerSupportProfile(id: string | undefined): CustomerSupportProfile | null {
  const customer = customers.find((candidate) => candidate.id === id);
  if (!customer) return null;
  const detail = getCustomerDetail(customer);
  const isCompany = customer.accountType === "company";
  const isAcme = customer.id === "KR-77410-JW";
  const overview = isCompany ? getCompanyOverview(detail) : null;
  const invoicing = isCompany ? getCompanyInvoicingOverview(detail) : null;
  const branches = isCompany ? getCompanyBranchesOverview(detail).branches : [];
  const overdue = invoicing?.invoices.find((invoice) => invoice.status === "overdue");

  return {
    customer,
    detail,
    tier: isAcme ? "Tier 1" : isCompany ? "Tier 2" : "Individual",
    primaryContact: overview && overview.billingConfig.billingContactName !== "—" ? `${overview.billingConfig.billingContactName} (Billing)` : detail.fullName,
    contactEmail: detail.email,
    historicalTickets: isAcme ? 137 : 12,
    deliveries: DELIVERIES,
    hub: CHICAGO_HQ,
    locations: [
      { name: "HQ & Main Hub", address: "1200 Logistics Blvd, Chicago, IL", kind: "hq" },
      ...branches.map((branch) => ({ name: branch.name, address: `${branch.city}, ${branch.state} · ${branch.hubCode}`, kind: "branch" as const })),
    ],
    account: invoicing && overview
      ? {
          hasPastDue: Boolean(overdue),
          pastDue: invoicing.overdueTotal,
          pastDueNote: overdue ? `Invoice ${overdue.id} was due ${overdue.dueDate}.` : "No invoices are past due.",
          nextInvoice: overview.billingConfig.nextInvoiceDate,
          paymentTerms: paymentTermsLabel(overview.billingConfig.paymentTerms),
        }
      : null,
    activity: isAcme
      ? [
          { title: "Ticket Escalated", detail: "TKT-1042 flagged by System", time: "Today, 10:42 AM", tone: "primary" },
          { title: "Delivery Completed", detail: "DEL-9918 signed by R. Smith", time: "Yesterday, 4:15 PM", tone: "muted" },
          { title: "Note Added", detail: "Agent J. Doe logged call regarding invoice #449.", time: "2 days ago, 11:30 AM", tone: "muted" },
          { title: "Ticket Resolved", detail: "TKT-0988 closed", time: "8 days ago, 9:15 AM", tone: "muted" },
        ]
      : [{ title: "Account Opened", detail: `Joined ${detail.joinedDate}`, time: detail.joinedDate, tone: "muted" }],
  };
}

export interface CustomerSupportState {
  reminderSent?: boolean;
}

// TODO: POST /customers/:id/payment-reminders once the billing API exists.
const customerSupportStateStore = createStore<Record<string, CustomerSupportState>>({});

export function useCustomerSupportState(id: string): CustomerSupportState {
  return useStore(customerSupportStateStore)[id] ?? {};
}

export function updateCustomerSupportState(id: string, changes: CustomerSupportState): void {
  customerSupportStateStore.set((prev) => ({ ...prev, [id]: { ...prev[id], ...changes } }));
}
