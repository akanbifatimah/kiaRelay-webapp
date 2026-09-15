import type { DriverApplication } from "./data";

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// TODO: replace with GET /drivers/onboarding-queue once the Driver
// Management / Compliance API exists. Split out from data.ts once it passed
// the 150-line limit (same split already done for customers/drivers roster).
const handAuthored: DriverApplication[] = [
  {
    id: "drv-1",
    driverName: "Jonathan R. Sterling",
    idNumber: "DRV-99201",
    submittedDate: formatDate(daysAgoDate(16)),
    appliedDaysAgo: 16,
    documentsComplete: 3,
    documentsTotal: 4,
    status: "pending",
  },
  {
    id: "drv-2",
    driverName: "Maria Gonzalez",
    idNumber: "DRV-99310",
    submittedDate: formatDate(daysAgoDate(20)),
    appliedDaysAgo: 20,
    documentsComplete: 4,
    documentsTotal: 4,
    status: "approved",
  },
  {
    id: "drv-3",
    driverName: "Kevin Walsh",
    idNumber: "DRV-99412",
    submittedDate: formatDate(daysAgoDate(8)),
    appliedDaysAgo: 8,
    documentsComplete: 4,
    documentsTotal: 4,
    status: "pending",
  },
  {
    id: "drv-4",
    driverName: "Aisha Bello",
    idNumber: "DRV-99488",
    submittedDate: formatDate(daysAgoDate(25)),
    appliedDaysAgo: 25,
    documentsComplete: 2,
    documentsTotal: 4,
    status: "rejected",
  },
  {
    id: "drv-5",
    driverName: "Tom Harrington",
    idNumber: "DRV-99502",
    submittedDate: formatDate(daysAgoDate(30)),
    appliedDaysAgo: 30,
    documentsComplete: 4,
    documentsTotal: 4,
    status: "approved",
  },
  {
    id: "drv-6",
    driverName: "Priya Shah",
    idNumber: "DRV-99550",
    submittedDate: formatDate(daysAgoDate(2)),
    appliedDaysAgo: 2,
    documentsComplete: 2,
    documentsTotal: 4,
    status: "pending",
  },
];

const fillerApplicantNames = [
  "Alex Rivera",
  "Nina Petrova",
  "Chris Okafor",
  "Lena Fischer",
  "Marco Ruiz",
  "Grace Lindqvist",
];

function buildFillerApplications(count: number): DriverApplication[] {
  return Array.from({ length: count }, (_, i) => {
    const name = fillerApplicantNames[i % fillerApplicantNames.length];
    const docsComplete = 1 + (i % 4);
    const daysAgo = 1 + (i % 28);
    return {
      id: `drv-filler-${i}`,
      driverName: `${name} ${Math.floor(i / fillerApplicantNames.length) + 1}`,
      idNumber: `DRV-9${9600 + i}`,
      submittedDate: formatDate(daysAgoDate(daysAgo)),
      appliedDaysAgo: daysAgo,
      documentsComplete: docsComplete,
      documentsTotal: 4,
      status: docsComplete === 4 ? "approved" : i % 5 === 0 ? "rejected" : "pending",
    };
  });
}

export const driverApplications: DriverApplication[] = [...handAuthored, ...buildFillerApplications(16)];
