import type { BusinessRegistration } from "./businessAccounts";

export interface RegisterValues extends BusinessRegistration {
  confirmPassword: string;
  agree: boolean;
}

export const REGISTER_DEFAULTS: RegisterValues = {
  companyName: "",
  registrationNumber: "",
  industry: "",
  monthlyVolume: "20-100",
  address: "",
  city: "",
  state: "Texas",
  postalCode: "",
  companyPhone: "",
  contactName: "",
  contactTitle: "",
  email: "",
  contactPhone: "",
  password: "",
  confirmPassword: "",
  agree: false,
};

export const PHONE_RULE = { validate: (value: unknown) => String(value).replace(/\D/g, "").length >= 10 || "Enter a full number, incl. area code." };

/** Registration steps and the fields each one validates before moving on. */
export const REGISTER_STEPS: { title: string; subtitle: string; fields: (keyof RegisterValues)[] }[] = [
  { title: "Company", subtitle: "Your legal entity", fields: ["companyName", "registrationNumber", "industry", "monthlyVolume"] },
  { title: "Address", subtitle: "Where you operate", fields: ["address", "city", "state", "postalCode", "companyPhone"] },
  { title: "Account Admin", subtitle: "The authorized signatory who signs in", fields: ["contactName", "contactTitle", "email", "contactPhone", "password", "confirmPassword", "agree"] },
  { title: "Review", subtitle: "Check and submit", fields: [] },
];
