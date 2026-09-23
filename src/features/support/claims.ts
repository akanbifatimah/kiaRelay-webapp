import { createStore, useStore } from "../../lib/createStore";
import { buildSeedClaims } from "./claimSeeds";
import type { ClaimInvestigation } from "./claimInvestigation";

// Session-wide claims list shared by Claims Management, Create New Claim,
// and the claim investigation page (see lib/createStore.ts).
export const claimsStore = createStore<ClaimInvestigation[]>(buildSeedClaims());

export const useClaims = () => useStore(claimsStore);

export function useClaim(id: string | undefined): ClaimInvestigation | undefined {
  return useClaims().find((claim) => claim.id === id);
}

export function saveClaim(claim: ClaimInvestigation): void {
  claimsStore.set((prev) =>
    prev.some((existing) => existing.id === claim.id)
      ? prev.map((existing) => (existing.id === claim.id ? claim : existing))
      : [claim, ...prev],
  );
}

export function removeClaim(id: string): void {
  claimsStore.set((prev) => prev.filter((claim) => claim.id !== id));
}

export function nextClaimId(): string {
  const taken = new Set(claimsStore.get().map((claim) => claim.id));
  let n = 883000 + claimsStore.get().length;
  while (taken.has(`CLM-${n}-N`)) n += 1;
  return `CLM-${n}-N`;
}

/** Drafts reopen in Create New Claim; everything else opens the investigation. */
export function claimHref(claim: ClaimInvestigation): string {
  return claim.status === "draft" ? `/support/claims/new?draft=${claim.id}` : `/support/claims/${claim.id}`;
}
