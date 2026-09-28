import { createPersistentStore } from "../../lib/createPersistentStore";
import { useStore } from "../../lib/createStore";
import { findMemberByEmail } from "../access/teamMembers";
import { DEV_PASSWORD } from "../access/teamMembersData";

export type BusinessStatus = "pending" | "verified" | "rejected";

export interface BusinessAccount {
  /** Same id space as Customer Management (KR-#####-XX), so admins review it there. */
  id: string;
  companyName: string;
  registrationNumber: string;
  industry: string;
  monthlyVolume: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  companyPhone: string;
  contactName: string;
  contactTitle: string;
  email: string;
  contactPhone: string;
  /** TODO: never store passwords client-side — goes away with POST /business/auth. */
  password: string;
  status: BusinessStatus;
  createdAt: string;
}

export type BusinessRegistration = Omit<BusinessAccount, "id" | "status" | "createdAt">;

// KiaRelay Business web accounts (TC-15, 2026-09-28). Registration and
// sign-in are mocked like the admin login: accounts live in localStorage so
// a registration survives a reload and shows up in the admin's KiaRelay
// Business Accounts list as pending verification.
// TODO: POST /business/register, POST /business/auth/login and
// GET /business/me once the backend exists.
const store = createPersistentStore<BusinessAccount[]>("kiarelay_business_accounts_v1", [
  {
    id: "KR-77410-JW",
    companyName: "Acme Refinery LLC",
    registrationNumber: "TX-0801234567",
    industry: "Oil & Gas",
    monthlyVolume: "100-500",
    address: "800 Main St, Suite 400",
    city: "Houston",
    state: "Texas",
    postalCode: "77002",
    companyPhone: "+1 (713) 555-0142",
    contactName: "Jennifer Walsh",
    contactTitle: "Procurement Manager",
    email: "business.demo@kiarelay.com",
    contactPhone: "+1 (713) 555-0187",
    password: DEV_PASSWORD,
    status: "verified",
    createdAt: new Date(Date.now() - 400 * 86_400_000).toISOString(),
  },
]);

export const useBusinessAccounts = () => useStore(store);
export const getBusinessAccounts = () => store.get();

export function findBusinessByEmail(email: string): BusinessAccount | undefined {
  const normalized = email.trim().toLowerCase();
  return store.get().find((account) => account.email === normalized);
}

/** Business emails must be unique and can't reuse a KiaRelay admin login. */
export function isBusinessEmailAvailable(email: string): boolean {
  return !findBusinessByEmail(email) && !findMemberByEmail(email);
}

function initials(name: string): string {
  return name.split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "KB";
}

export function registerBusiness(input: BusinessRegistration): BusinessAccount {
  const random = crypto.getRandomValues(new Uint32Array(1))[0];
  const account: BusinessAccount = {
    ...input,
    email: input.email.trim().toLowerCase(),
    id: `KR-${10000 + (random % 89999)}-${initials(input.companyName)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.set((prev) => [account, ...prev]);
  return account;
}

/** Admin verification decisions flow back to the business's own account page. */
export function setBusinessStatus(id: string, status: BusinessStatus): void {
  store.set((prev) => prev.map((account) => (account.id === id ? { ...account, status } : account)));
}

export function updateBusinessPassword(email: string, password: string): void {
  const normalized = email.trim().toLowerCase();
  store.set((prev) => prev.map((account) => (account.email === normalized ? { ...account, password } : account)));
}

// A separate session from the admin one, so a business login can never open
// the admin shell (RequireAuth only reads the admin session).
const SESSION_KEY = "kiarelay_business_session";

export function getBusinessSession(): BusinessAccount | undefined {
  try {
    const email = localStorage.getItem(SESSION_KEY);
    return email ? findBusinessByEmail(email) : undefined;
  } catch {
    return undefined;
  }
}

export function businessLogin(email: string): void {
  localStorage.setItem(SESSION_KEY, email.trim().toLowerCase());
}

export function businessLogout(): void {
  localStorage.removeItem(SESSION_KEY);
}
