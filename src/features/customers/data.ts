export type CustomerAccountType = "individual" | "company";
export type CustomerStatus = "active" | "suspended";
export type VerificationStatus = "verified" | "pending" | "failed";

export interface Customer {
  id: string;
  name: string;
  accountType: CustomerAccountType;
  status: CustomerStatus;
  verification: VerificationStatus;
  orders: number;
  lastActivity: string;
}

const individualNames = [
  "Elena Rodriguez",
  "Marcus Chen",
  "Priya Nair",
  "James O'Connor",
  "Sofia Alvarez",
  "David Kim",
  "Amara Okafor",
  "Lucas Bennett",
];

const companyNames = [
  "Nexus Logistics Co",
  "Titan Manufacturing",
  "Vertex Energy",
  "Marathon Petroleum",
  "Phillips 66",
  "ConocoPhillips",
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function buildCustomers(): Customer[] {
  // TODO: replace with the real Customer Management API once it exists
  // (paginated, filterable by status/verification/date range, searchable).
  const explicit: Customer[] = [
    {
      id: "KR-89210-ER",
      name: "Elena Rodriguez",
      accountType: "individual",
      status: "active",
      verification: "verified",
      orders: 42,
      lastActivity: "2 mins ago",
    },
    {
      id: "KR-11029-NX",
      name: "Atlas Global Logistics Ltd",
      accountType: "company",
      status: "active",
      verification: "pending",
      orders: 1204,
      lastActivity: "15 mins ago",
    },
    {
      id: "KR-44582-MC",
      name: "Marcus Chen",
      accountType: "individual",
      status: "suspended",
      verification: "failed",
      orders: 0,
      lastActivity: "2 days ago",
    },
    {
      id: "KR-00234-TM",
      name: "Titan Manufacturing",
      accountType: "company",
      status: "active",
      verification: "verified",
      orders: 854,
      lastActivity: "1 hour ago",
    },
    {
      id: "KR-77410-JW",
      name: "Acme Refinery LLC",
      accountType: "company",
      status: "active",
      verification: "verified",
      orders: 318,
      lastActivity: "20 mins ago",
    },
  ];

  const verifications: VerificationStatus[] = ["verified", "verified", "pending", "verified", "failed"];
  const generated: Customer[] = Array.from({ length: 26 }, (_, i) => {
    const isIndividual = i % 2 === 0;
    const name = isIndividual
      ? individualNames[i % individualNames.length]
      : companyNames[i % companyNames.length];
    return {
      id: `KR-${(10000 + i * 137) % 99999}-${initials(name).slice(0, 2)}`,
      name,
      accountType: isIndividual ? "individual" : "company",
      status: i % 9 === 0 ? "suspended" : "active",
      verification: verifications[i % verifications.length],
      orders: isIndividual ? (i * 7) % 120 : 200 + ((i * 53) % 1500),
      lastActivity: `${(i % 12) + 1} ${i % 2 === 0 ? "hours" : "days"} ago`,
    };
  });

  return [...explicit, ...generated];
}

export const customers: Customer[] = buildCustomers();

// Per-account-type overview stats (2026-09-11: split from one combined row
// after the user pointed out Individual and Company shouldn't both show
// each other's counts) — flavor numbers matching the Figma reference, not
// derived from the (much smaller) mock array above. Pending Verification
// is company-only, matching the company-only ID review flow.
// TODO: replace with real aggregate counts once the backend exists.
export const customerOverviewStats = {
  individual: { total: 8920, active: 8654, suspended: 266 },
  company: { total: 3562, pendingVerification: 142, active: 3248, suspended: 314 },
};
