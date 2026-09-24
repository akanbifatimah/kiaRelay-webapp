import { createPersistentStore } from "../../lib/createPersistentStore";
import { useStore } from "../../lib/createStore";

export const DEFAULT_LOGO = "/kia-relay-logo.svg";

export interface CompanySettings {
  companyName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  registrationNumber: string;
  ein: string;
  dotAuthority: string;
  /** DEFAULT_LOGO, an uploaded data URL, or null once removed. */
  logoUrl: string | null;
}

export interface FinanceSettings {
  invoicePrefix: string;
  paymentTerms: string;
  dueDateCalculation: string;
  autoBilling: boolean;
  methodAch: boolean;
  methodCard: boolean;
  methodCredit: boolean;
  methodDirectHandoff: boolean;
  payoutSchedule: string;
  minPayout: number;
  instantCashout: boolean;
  payoutApproval: boolean;
}

export interface OperationsSettings {
  defaultDeliveryStatus: string;
  proofOfDelivery: boolean;
  driverConfirmation: boolean;
  recipientConfirmation: boolean;
  deliveryNotes: boolean;
  gracePeriodMinutes: string;
  multiStop: boolean;
  specialHandling: boolean;
  scheduledDispatch: boolean;
  hotShot: boolean;
}

// Defaults are the values shown in the Settings designs (2026-09-23).
// TODO: replace with GET/PUT /admin/settings/{company,finance,operations}
// once the backend exists — pages only talk to the save functions below.
const companyStore = createPersistentStore<CompanySettings>("kiarelay_settings_company_v1", {
  companyName: "KiaRelay Logistics Inc.",
  email: "corporate@kiarelay.com",
  phone: "+1 (713) 555-0100",
  website: "https://www.kiarelay.com",
  address: "1400 Smith Street, Suite 2200",
  country: "United States",
  state: "Texas",
  city: "Houston",
  postalCode: "77002",
  registrationNumber: "TX-CORP-8849281",
  ein: "74-2984912",
  dotAuthority: "US DOT #3984102 / MC-849102",
  logoUrl: DEFAULT_LOGO,
});

const financeStore = createPersistentStore<FinanceSettings>("kiarelay_settings_finance_v1", {
  invoicePrefix: "INV-",
  paymentTerms: "net-30",
  dueDateCalculation: "after-issue-30",
  autoBilling: true,
  methodAch: true,
  methodCard: true,
  methodCredit: true,
  methodDirectHandoff: false,
  payoutSchedule: "weekly-tue",
  minPayout: 50,
  instantCashout: true,
  payoutApproval: true,
});

const operationsStore = createPersistentStore<OperationsSettings>("kiarelay_settings_operations_v1", {
  defaultDeliveryStatus: "confirmed",
  proofOfDelivery: true,
  driverConfirmation: true,
  recipientConfirmation: true,
  deliveryNotes: false,
  gracePeriodMinutes: "30",
  multiStop: true,
  specialHandling: true,
  scheduledDispatch: true,
  hotShot: true,
});

export const useCompanySettings = () => useStore(companyStore);
export const useFinanceSettings = () => useStore(financeStore);
export const useOperationsSettings = () => useStore(operationsStore);

export const saveCompanySettings = (values: CompanySettings) => companyStore.set(values);
export const saveFinanceSettings = (values: FinanceSettings) => financeStore.set(values);
export const saveOperationsSettings = (values: OperationsSettings) => operationsStore.set(values);

/** Human-readable list of fields that differ — the audit log's "detail". */
export function describeChanges<T extends object>(before: T, after: T, labels: Partial<Record<keyof T, string>>): string {
  const changed = (Object.keys(after) as (keyof T)[]).filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
  return changed.map((key) => labels[key] ?? String(key)).join(", ") || "No field changes";
}
