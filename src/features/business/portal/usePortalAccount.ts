import { getBusinessSession, useBusinessAccounts, type BusinessAccount } from "../businessAccounts";

/** The signed-in KiaRelay Business account, live against the accounts store. */
export function usePortalAccount(): BusinessAccount | undefined {
  const accounts = useBusinessAccounts();
  const session = getBusinessSession();
  return accounts.find((account) => account.id === session?.id);
}

/** Booking opens once KiaRelay approves the company (user decision, 2026-09-30). */
export const canBook = (account: BusinessAccount) => account.status === "verified";
