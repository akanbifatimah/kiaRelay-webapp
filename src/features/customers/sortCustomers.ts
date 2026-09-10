import type { Customer } from "./data";

export type CustomerSortKey = "name" | "accountType" | "status" | "verification" | "orders";
export type SortDirection = "asc" | "desc";

// Client-side only, mirrors filterCustomerOrders.ts. "Last Activity" is
// deliberately not sortable here — it's a relative-time string ("2 hours
// ago") with no reliable chronological ordering without a real timestamp
// from the backend.
export function sortCustomers(customers: Customer[], key: CustomerSortKey, direction: SortDirection): Customer[] {
  const sorted = [...customers].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "accountType":
        cmp = a.accountType.localeCompare(b.accountType);
        break;
      case "status":
        cmp = a.status.localeCompare(b.status);
        break;
      case "verification":
        cmp = a.verification.localeCompare(b.verification);
        break;
      case "orders":
        cmp = a.orders - b.orders;
        break;
    }
    return direction === "asc" ? cmp : -cmp;
  });

  return sorted;
}
