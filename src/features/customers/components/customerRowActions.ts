import type { DropdownMenuItem } from "../../../components/DropdownMenu";
import type { Customer } from "../data";

export interface CustomerRowHandlers {
  onNavigate: (path: string) => void;
  onReviewVerification: (row: Customer) => void;
  onSuspend: (row: Customer) => void;
  onReactivate: (row: Customer) => void;
}

// Every row has actions (TC-11, 2026-09-28). Individual rows used to get an
// empty menu, so no ⋯ rendered at all and the Actions column looked dead.
// Each entry opens a screen or dialog that already exists.
export function customerRowActions(row: Customer, handlers: CustomerRowHandlers): DropdownMenuItem[] {
  const base = `/customers/${row.accountType}/${row.id}`;
  const isCompany = row.accountType === "company";
  const items: DropdownMenuItem[] = [
    { label: "View Profile", onClick: () => handlers.onNavigate(base) },
    { label: "Order History", onClick: () => handlers.onNavigate(`${base}/orders`) },
    { label: "Payment Methods", onClick: () => handlers.onNavigate(`${base}/payments`) },
  ];
  if (isCompany) {
    items.push(
      { label: "Invoices", onClick: () => handlers.onNavigate(`${base}/invoices`) },
      { label: "Users & Branches", onClick: () => handlers.onNavigate(`${base}/branches`) },
    );
  }
  items.push({ label: "Support & Audit Log", onClick: () => handlers.onNavigate(`${base}/support`) });
  if (isCompany && row.verification === "pending") {
    items.push({ label: "Review Verification", onClick: () => handlers.onReviewVerification(row) });
  }
  items.push(
    row.status === "suspended"
      ? { label: "Reactivate Account", onClick: () => handlers.onReactivate(row) }
      : { label: "Suspend Account", onClick: () => handlers.onSuspend(row), tone: "danger" },
  );
  return items;
}
