import { createPersistentStore } from "../../lib/createPersistentStore";
import { useStore } from "../../lib/createStore";
import { findMemberByEmail } from "../access/teamMembers";
import { DEV_PASSWORD } from "../access/teamMembersData";
import type { BusinessAccount, BusinessRegistration, BusinessStatus } from "./businessTypes";

export type { BusinessAccount, BusinessRegistration, BusinessStatus } from "./businessTypes";

// KiaRelay Business web accounts. Registration and sign-in are mocked like
// the admin login: accounts live in localStorage, so a registration survives
// a reload and shows up in the admin's KiaRelay Business Accounts list as
// pending verification.
// v4 (2026-09-30): emailVerified added. v3 (2026-09-30): first/last names split. v2 (2026-09-29): Figma sign-up shape (owner / company details /
// documents), matching the mobile app; v1 data is dropped.
// TODO: POST /business/register, POST /auth/login and GET /business/me.
const store = createPersistentStore<BusinessAccount[]>("kiarelay_business_accounts_v4", [
  {
    id: "KR-77410-JW",
    reference: "RLY-7741",
    owner: { firstName: "Jennifer", lastName: "Walsh", email: "business.demo@kiarelay.com", phone: "+1 (713) 555-0187" },
    password: DEV_PASSWORD,
    emailVerified: true,
    phoneVerified: true,
    company: {
      legalName: "Acme Refinery LLC",
      dba: "",
      ein: "74-2984912",
      industry: "Oil & Gas",
      industryOther: "",
      companyType: "LLC",
      companyTypeOther: "",
      street: "800 Main St, Suite 400",
      city: "Houston",
      state: "Texas",
      zip: "77002",
      contactFirstName: "Jennifer",
      contactLastName: "Walsh",
      contactTitle: "Procurement Manager",
      contactEmail: "business.demo@kiarelay.com",
      contactPhone: "+1 (713) 555-0187",
    },
    documents: {},
    status: "verified",
    createdAt: new Date(Date.now() - 400 * 86_400_000).toISOString(),
  },
]);

export const useBusinessAccounts = () => useStore(store);
export const getBusinessAccounts = () => store.get();

export function findBusinessByEmail(email: string): BusinessAccount | undefined {
  const normalized = email.trim().toLowerCase();
  return store.get().find((account) => account.owner.email === normalized);
}

/** Business emails must be unique and can't reuse a KiaRelay admin login. */
export function isBusinessEmailAvailable(email: string): boolean {
  return !findBusinessByEmail(email) && !findMemberByEmail(email);
}

function initials(name: string): string {
  return name.split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "KB";
}

function randomDigits(count: number): string {
  return Array.from(crypto.getRandomValues(new Uint32Array(count)), (v) => String(v % 10)).join("");
}

export function registerBusiness(input: BusinessRegistration): BusinessAccount {
  const account: BusinessAccount = {
    ...input,
    owner: { ...input.owner, email: input.owner.email.trim().toLowerCase() },
    id: `KR-${randomDigits(5)}-${initials(input.company.legalName)}`,
    reference: `RLY-${randomDigits(4)}`,
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

/** My Account (2026-10-01): profile photo, owner name and phone. A changed
 * phone needs verifying again. TODO: PUT /business/me. */
export function updateBusinessAccount(id: string, patch: Partial<Pick<BusinessAccount, "photoUri" | "phoneVerified">> & { owner?: Partial<BusinessAccount["owner"]> }): void {
  store.set((prev) => prev.map((account) => (account.id === id ? { ...account, ...patch, owner: { ...account.owner, ...patch.owner } } : account)));
}

/** The seeded demo company; it can't be closed, so testers keep it. */
export const isDemoBusiness = (email: string) => email.trim().toLowerCase() === "business.demo@kiarelay.com";

/** Settings → Close Company Account (2026-10-01). TODO: DELETE /business/me —
 * the server keeps what tax/legal records require (invoices). */
export function removeBusinessAccount(id: string): void {
  store.set((prev) => prev.filter((account) => account.id !== id));
}

export function updateBusinessPassword(email: string, password: string): void {
  const normalized = email.trim().toLowerCase();
  store.set((prev) => prev.map((account) => (account.owner.email === normalized ? { ...account, password } : account)));
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
