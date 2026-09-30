// KiaRelay Business account shapes (2026-09-29), matching the customer
// mobile app's src/types/account.ts field-for-field, so one backend
// contract can serve both.

export type BusinessStatus = "pending" | "verified" | "rejected";

/** Step 1, "Account": who signs in. Names are always split (user rule, 2026-09-30). */
export interface BusinessOwner {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** The industry to display: the typed-in one when "Other" was picked. */
export const industryLabel = (company: { industry: string; industryOther?: string }) =>
  company.industry === "Other" && company.industryOther ? company.industryOther : company.industry;

/** The company type to display: the typed-in one when "Other" was picked. */
export const companyTypeLabel = (company: { companyType: string; companyTypeOther?: string }) =>
  company.companyType === "Other" && company.companyTypeOther ? company.companyTypeOther : company.companyType;

/** "Jennifer Walsh" from split name fields. */
export const fullName = (first: string, last: string) => `${first} ${last}`.trim();

/** Step 2, "Details". */
export interface CompanyDetails {
  legalName: string;
  dba: string;
  ein: string;
  industry: string;
  /** Filled only when industry is "Other" (2026-09-30). */
  industryOther: string;
  companyType: string;
  /** Filled only when companyType is "Other" (2026-09-30). */
  companyTypeOther: string;
  street: string;
  /** City, state and ZIP are picked from the US lookup (public/geo/us). */
  city: string;
  /** Full state name, e.g. "Texas". */
  state: string;
  zip: string;
  contactFirstName: string;
  contactLastName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
}

export type BusinessDocumentKey = "registration" | "taxId" | "insurance";

export interface UploadedDocument {
  name: string;
  /** Bytes. */
  size: number;
  mimeType: string;
  /** Kept only for small files so admins can open them in the mock.
   * TODO: replace with a server URL once documents upload to the API. */
  dataUrl?: string;
}

/** Optional "Credit Application" for Net-30 terms. */
export interface CreditApplication {
  requestedLimit: string;
  annualRevenue: string;
  yearsInBusiness: string;
  bankName: string;
  bankContact: string;
  tradeReference: string;
}

export interface BusinessAccount {
  /** Same KR-#####-XX id space as Customer Management. */
  id: string;
  /** Application reference shown on "Application Submitted", e.g. RLY-8492. */
  reference: string;
  owner: BusinessOwner;
  /** TODO: never store passwords client-side — goes away with the auth API. */
  password: string;
  phoneVerified: boolean;
  company: CompanyDetails;
  documents: Partial<Record<BusinessDocumentKey, UploadedDocument>>;
  creditApplication?: CreditApplication;
  status: BusinessStatus;
  createdAt: string;
}

export type BusinessRegistration = Omit<BusinessAccount, "id" | "reference" | "status" | "createdAt">;
