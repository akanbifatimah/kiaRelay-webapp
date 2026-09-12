import type { BranchUser, BranchUserRole, CompanyBranchesOverview } from "./companyBranches";

const fillerNames = ["Elena Vance", "Priya Shah", "David Osei", "Lucas Bennett", "Amara Lee", "Noah Fischer", "Grace Liu", "Omar Haddad", "Tara Patel"];
const fillerRoles: BranchUserRole[] = ["viewer", "manager", "viewer"];
const fillerBranches = ["Houston Central Terminal", "Midland Logistics Hub", "Global - All Branches"];

function buildFillerUsers(): BranchUser[] {
  return fillerNames.map((name, i) => ({
    id: `bu-filler-${i}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@acmerefinery.com`,
    role: fillerRoles[i % fillerRoles.length],
    branchAssignment: fillerBranches[i % fillerBranches.length],
    status: i % 4 === 0 ? "inactive" : "active",
    lastActive: `${(i % 12) + 1} hours ago`,
  }));
}

// TODO: replace with GET /customers/:id/branches once the Customer
// Management API exists. Only KR-77410-JW (Acme Refinery) is hand-authored
// to match the Figma reference — see getCompanyBranchesOverview() in
// companyBranches.ts for the generic fallback used by every other company.
export const companyBranchesOverviews: Record<string, CompanyBranchesOverview> = {
  "KR-77410-JW": {
    totalActiveHubs: 12,
    hubsDeltaLabel: "+2 this Q",
    globalDispatchRate: "94.2%",
    activeOperationalUsers: 482,
    operationalUserCap: 500,
    totalNetworkSpend: "$1.2M",
    networkSpendDeltaLabel: "-3.1% YoY",
    users: [
      {
        id: "bu-1",
        name: "Jameson Dekker",
        email: "j.dekker@acmerefinery.com",
        role: "admin",
        branchAssignment: "Houston Central Terminal",
        status: "active",
        lastActive: "2 mins ago",
      },
      {
        id: "bu-2",
        name: "Sarah Rodriguez",
        email: "s.rodriguez@acmerefinery.com",
        role: "manager",
        branchAssignment: "Midland Logistics Hub",
        status: "active",
        lastActive: "1 hour ago",
      },
      {
        id: "bu-3",
        name: "Marcus Thorne",
        email: "m.thorne@contractor.com",
        role: "viewer",
        branchAssignment: "Global - All Branches",
        status: "inactive",
        lastActive: "14 Oct 2023",
      },
      ...buildFillerUsers(),
    ],
    branches: [
      {
        id: "br-1",
        name: "North Region Logistics",
        city: "Chicago",
        state: "IL",
        hubCode: "Hub 04",
        primaryContact: "Sarah Jenkins",
        operatorsActive: 42,
        liveOrders: 128,
        delivered: 14209,
        ytdSpend: 240500,
        teamNames: ["Sarah Jenkins", "Mike Kim"],
        teamOverflow: 6,
      },
      {
        id: "br-2",
        name: "Western Distribution",
        city: "Phoenix",
        state: "AZ",
        hubCode: "Hub 07",
        primaryContact: "Marcus Thorne",
        operatorsActive: 86,
        liveOrders: 342,
        delivered: 52118,
        ytdSpend: 412890,
        teamNames: ["Marcus Thorne", "Amara Lee"],
        teamOverflow: 15,
      },
      {
        id: "br-3",
        name: "Coastal Express Hub",
        city: "Miami",
        state: "FL",
        hubCode: "Hub 12",
        primaryContact: "Elena Rodriguez",
        operatorsActive: 24,
        liveOrders: 54,
        delivered: 8443,
        ytdSpend: 185200,
        teamNames: ["Elena Rodriguez"],
        teamOverflow: 4,
      },
      {
        id: "br-4",
        name: "Metro Northeast",
        city: "Jersey City",
        state: "NJ",
        hubCode: "Hub 02",
        primaryContact: "Kevin Wu",
        operatorsActive: 115,
        liveOrders: 892,
        delivered: 182401,
        ytdSpend: 1045600,
        teamNames: ["Kevin Wu", "Tara Patel"],
        teamOverflow: 22,
      },
    ],
  },
};
