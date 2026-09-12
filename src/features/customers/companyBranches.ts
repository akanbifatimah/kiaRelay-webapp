import type { CustomerDetail } from "./customerDetails";
import { companyBranchesOverviews } from "./companyBranchesData";

export type BranchUserRole = "admin" | "manager" | "viewer";
export type BranchUserStatus = "active" | "inactive";

export interface BranchUser {
  id: string;
  name: string;
  email: string;
  role: BranchUserRole;
  branchAssignment: string;
  status: BranchUserStatus;
  lastActive: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  state: string;
  hubCode: string;
  primaryContact: string;
  operatorsActive: number;
  liveOrders: number;
  delivered: number;
  ytdSpend: number;
  teamNames: string[];
  teamOverflow: number;
  // Set only for branches created via "Add New Node" (auto-provisioned) —
  // manually created branches (the "Add Branch" flow) leave these unset.
  nodeType?: string;
  capacityTier?: string;
}

export interface CompanyBranchesOverview {
  totalActiveHubs: number;
  hubsDeltaLabel: string;
  globalDispatchRate: string;
  activeOperationalUsers: number;
  operationalUserCap: number;
  totalNetworkSpend: string;
  networkSpendDeltaLabel: string;
  users: BranchUser[];
  branches: Branch[];
}

// TODO: replace with GET /customers/:id/branches once the Customer
// Management API exists. Only KR-77410-JW (Acme Refinery) is hand-authored
// to match the Figma reference — see companyBranchesData.ts.
export function getCompanyBranchesOverview(detail: CustomerDetail): CompanyBranchesOverview {
  return (
    companyBranchesOverviews[detail.id] ?? {
      totalActiveHubs: 0,
      hubsDeltaLabel: "—",
      globalDispatchRate: "—",
      activeOperationalUsers: 0,
      operationalUserCap: 0,
      totalNetworkSpend: "—",
      networkSpendDeltaLabel: "—",
      users: [],
      branches: [],
    }
  );
}
