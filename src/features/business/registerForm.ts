import type { CompanyDetails } from "./businessTypes";

// Option lists and defaults for KiaRelay Business registration — kept in
// sync with the mobile app's src/constants/business.ts.
export const INDUSTRIES = ["Oil & Gas", "Construction", "Healthcare & Pharma", "Manufacturing", "Retail & Wholesale", "Commercial Freight", "Other"];

export const COMPANY_TYPES = ["LLC", "Corporation (C-Corp)", "S-Corp", "Partnership", "Sole Proprietorship", "Non-profit", "Other"];

/** Stepper labels, as in the design: Account → Details → Documents. */
export const REGISTER_STEPS = ["Account", "Details", "Documents"] as const;

export type RegisterStage = "account" | "verify" | "details" | "documents";

/** Which stepper step a stage belongs to (phone verification is part of Account). */
export const STAGE_STEP: Record<RegisterStage, number> = { account: 0, verify: 0, details: 1, documents: 2 };

export interface AccountValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export const ACCOUNT_DEFAULTS: AccountValues = { firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", agree: false };

export const DETAILS_DEFAULTS: CompanyDetails = {
  legalName: "",
  dba: "",
  ein: "",
  industry: "",
  industryOther: "",
  companyType: "",
  companyTypeOther: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  contactFirstName: "",
  contactLastName: "",
  contactTitle: "",
  contactEmail: "",
  contactPhone: "",
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EIN_PATTERN = /^\d{2}-?\d{7}$/;
export const PHONE_RULE = { validate: (value: unknown) => String(value).replace(/\D/g, "").length >= 10 || "Enter a full number, incl. area code." };

/** "+1 (555) 123-4567" from US-style input; anything else passes through trimmed. */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return local.length === 10 ? `+1 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}` : value.trim();
}

export const toOptions = (values: string[], placeholder?: string) => [
  ...(placeholder ? [{ value: "", label: placeholder }] : []),
  ...values.map((value) => ({ value, label: value })),
];
