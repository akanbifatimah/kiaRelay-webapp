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
      name: "Nexus Logistics Co",
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
      name: "Jennifer Walsh",
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

// Overview stats shown regardless of which sub-page (Individual/Company)
// is active — flavor numbers matching the Figma reference, not derived
// from the (much smaller) mock array above. TODO: replace with real
// aggregate counts once the backend exists.
export const customerOverviewStats = {
  totalCustomers: 12482,
  individualAccounts: 8920,
  companyAccounts: 3562,
  pendingVerification: 142,
  activeAccounts: 11902,
  suspendedAccounts: 58,
};
