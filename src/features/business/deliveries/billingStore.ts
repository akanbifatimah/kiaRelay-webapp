import { createStore, useStore } from "../../../lib/createStore";
import type { InvoiceFrequency } from "./invoices";

// Company billing state shared by admin and the KiaRelay Business portal
// (2026-10-01): the Invoice Frequency admin sets in Billing Configuration,
// and invoice payments (portal Pay Now or admin Mark Paid). Session-only.
// TODO: GET/PUT /customers/:id/billing-config, POST /invoices/:id/payments.

export interface InvoicePayment {
  paidAt: string;
  methodLabel: string;
}

interface BillingState {
  frequency: Record<string, InvoiceFrequency>;
  /** `${customerId}:${invoiceId}` → payment. */
  payments: Record<string, InvoicePayment>;
}

const store = createStore<BillingState>({ frequency: {}, payments: {} });

export const useBillingState = () => useStore(store);
export const getBillingState = () => store.get();

const FREQUENCIES: InvoiceFrequency[] = ["Per Delivery", "Weekly", "Monthly", "Quarterly"];
export const toFrequency = (value: string | undefined): InvoiceFrequency => (FREQUENCIES as string[]).includes(value ?? "") ? (value as InvoiceFrequency) : "Per Delivery";

export function setInvoiceFrequency(customerId: string, value: string): void {
  store.set((s) => ({ ...s, frequency: { ...s.frequency, [customerId]: toFrequency(value) } }));
}

export function recordInvoicePayment(customerId: string, invoiceId: string, methodLabel: string): void {
  store.set((s) => ({ ...s, payments: { ...s.payments, [`${customerId}:${invoiceId}`]: { paidAt: new Date().toISOString(), methodLabel } } }));
}

/** invoiceId → paidAt for one company, as buildBilling() takes it. */
export function paidInvoices(state: BillingState, customerId: string): Record<string, string> {
  const prefix = `${customerId}:`;
  return Object.fromEntries(Object.entries(state.payments).filter(([k]) => k.startsWith(prefix)).map(([k, p]) => [k.slice(prefix.length), p.paidAt]));
}

export const paymentFor = (state: BillingState, customerId: string, invoiceId: string) => state.payments[`${customerId}:${invoiceId}`];
