import { claimCategoryLabels, claimStatusLabels, type ClaimCategory, type ClaimInvestigation, type ClaimStatus } from "./claimInvestigation";

export interface ClaimFilters {
  search: string;
  status: ClaimStatus | "all";
  category: ClaimCategory | "all";
  /** Only claims created within this many days — set by the "This Month" tile. */
  withinDays?: number;
}

export const EMPTY_CLAIM_FILTERS: ClaimFilters = { search: "", status: "all", category: "all" };

export function filterClaims(claims: ClaimInvestigation[], filters: ClaimFilters): ClaimInvestigation[] {
  const query = filters.search.trim().toLowerCase();
  return claims.filter(
    (claim) =>
      (filters.status === "all" || claim.status === filters.status) &&
      (filters.category === "all" || claim.category === filters.category) &&
      (filters.withinDays === undefined || claim.createdDaysAgo < filters.withinDays) &&
      (!query || `${claim.id} ${claim.customer.name} ${claim.order.ref} ${claim.driver.name}`.toLowerCase().includes(query)),
  );
}

export type ClaimSortKey = "id" | "customer" | "category" | "amount" | "created" | "status";

const statusRank: Record<ClaimStatus, number> = { escalated: 0, open: 1, "in-review": 2, draft: 3, resolved: 4 };

export function sortClaims(claims: ClaimInvestigation[], key: ClaimSortKey, direction: "asc" | "desc"): ClaimInvestigation[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...claims].sort((a, b) => {
    switch (key) {
      case "customer":
        return a.customer.name.localeCompare(b.customer.name) * sign;
      case "category":
        return a.category.localeCompare(b.category) * sign;
      case "amount":
        return (a.amount - b.amount) * sign;
      case "created":
        return (a.createdDaysAgo - b.createdDaysAgo) * sign;
      case "status":
        return (statusRank[a.status] - statusRank[b.status]) * sign;
      default:
        return a.id.localeCompare(b.id) * sign;
    }
  });
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function exportClaimsToCsv(claims: ClaimInvestigation[]): void {
  const header = ["Claim ID", "Customer", "Order", "Driver", "Category", "Type", "Amount (USD)", "Submitted", "Status"];
  const lines = claims.map((claim) =>
    [claim.id, claim.customer.name, claim.order.ref, claim.driver.name, claimCategoryLabels[claim.category], claim.type, claim.amount, claim.submitted, claimStatusLabels[claim.status]]
      .map(csvCell)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `claims-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
