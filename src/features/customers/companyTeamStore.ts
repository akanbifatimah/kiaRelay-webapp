import { createStore, useStore } from "../../lib/createStore";
import type { BranchUser } from "./companyBranches";
import { companyBranchesOverviews } from "./companyBranchesData";

// A company's users (2026-09-30), shared by admin's Company Users & Branches
// page and the KiaRelay Business portal's Team page, so a member invited in
// the portal shows up for admins (and removing access reaches the portal).
// Session-only, seeded from the hand-authored overviews.
// TODO: GET/POST/PATCH /customers/:id/users.
const store = createStore<Record<string, BranchUser[]>>({});

const seedFor = (customerId: string): BranchUser[] => companyBranchesOverviews[customerId]?.users ?? [];

export function useCompanyTeam(customerId: string | undefined): BranchUser[] {
  const all = useStore(store);
  if (!customerId) return [];
  return all[customerId] ?? seedFor(customerId);
}

export const getCompanyTeam = (customerId: string) => store.get()[customerId] ?? seedFor(customerId);

export function setCompanyTeam(customerId: string, update: (team: BranchUser[]) => BranchUser[]): void {
  store.set((prev) => ({ ...prev, [customerId]: update(prev[customerId] ?? seedFor(customerId)) }));
}
