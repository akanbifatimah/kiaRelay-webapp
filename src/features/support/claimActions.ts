import { formatUsd, type ClaimInvestigation, type ClaimTimelineEntry } from "./claimInvestigation";
import type { ResolveClaimValues } from "./components/ResolveClaimModal";
import type { EscalateClaimValues } from "./components/EscalateClaimModal";
import { priorityLabels } from "./types";

// Pure claim -> claim transitions for ClaimInvestigationPage's local state.
// TODO: each becomes a real call once the Claims API exists —
// PATCH /claims/:id { status }, POST /claims/:id/resolve,
// POST /claims/:id/escalate, POST /claims/:id/evidence/validate.

function stamp(): string {
  return new Date().toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Marks every existing step done, drops the old "pending" placeholder, and
 * appends the final step — the claim's journey is over once this runs. */
function finish(claim: ClaimInvestigation, entry: Omit<ClaimTimelineEntry, "id" | "time" | "status">): ClaimTimelineEntry[] {
  return [
    ...claim.timeline.filter((step) => step.status !== "pending").map((step) => ({ ...step, status: "done" as const })),
    { ...entry, id: `t${claim.timeline.length + 1}`, time: stamp(), status: "done" },
  ];
}

export function moveToReview(claim: ClaimInvestigation): ClaimInvestigation {
  return {
    ...claim,
    status: "in-review",
    resolutionState: "Pending Review",
    timeline: claim.timeline.map((step, index) => (index === 1 ? { ...step, status: "active", time: stamp() } : step)),
  };
}

export function resolveClaim(claim: ClaimInvestigation, values: ResolveClaimValues): ClaimInvestigation {
  const amount = Number(values.amount);
  const outcome =
    values.adjustment === "none"
      ? "Resolved — No Adjustment"
      : `Resolved — ${values.adjustment === "refund" ? "Refund" : "Credit"} ${formatUsd(amount)}`;
  return {
    ...claim,
    status: "resolved",
    resolvedDaysAgo: 0,
    resolutionState: outcome,
    timeline: finish(claim, { title: "Claim Resolved", description: values.determination.trim() }),
  };
}

export function escalateClaim(claim: ClaimInvestigation, values: EscalateClaimValues): ClaimInvestigation {
  return {
    ...claim,
    status: "escalated",
    resolutionState: `Escalated — ${values.team}`,
    timeline: finish(claim, {
      title: `Escalated (${priorityLabels[values.priority]})`,
      description: `Sent to ${values.team}: ${values.reason.trim()}`,
    }),
  };
}

export function validateEvidence(claim: ClaimInvestigation): ClaimInvestigation {
  return {
    ...claim,
    evidenceValidated: true,
    timeline: claim.timeline.map((step, index) =>
      index === 1 ? { ...step, status: "done", time: step.time || stamp(), description: "Photos, GPS and signatures validated." } : step,
    ),
  };
}
