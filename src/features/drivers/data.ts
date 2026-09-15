import type { IdVerificationCase } from "../../types/identityVerification";

export type OnboardingStatus = "pending" | "approved" | "rejected";

export interface DriverApplication {
  id: string;
  driverName: string;
  idNumber: string;
  submittedDate: string;
  appliedDaysAgo: number;
  documentsComplete: number;
  documentsTotal: number;
  status: OnboardingStatus;
}

// "Applied {date}" subtext — mirrors the daysAgoDate()/formatDate() helper
// pattern repeated across the other feature folders (customerOrderHistory.ts,
// supportTickets.ts, companyInvoicesData.ts) rather than a shared util.
export function daysAgoLabel(daysAgo: number): string {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "1 day ago";
  return `${daysAgo} days ago`;
}

export { driverApplications } from "./driverApplicationsData";

// TODO: replace with GET /drivers/:id/verification once the Driver
// Management / Compliance API exists. Only this one hand-authored case
// matches the Figma reference — see getVerificationCase() for the generic
// fallback used by every other pending application.
const verificationCases: Record<string, IdVerificationCase> = {
  "drv-1": {
    subjectName: "Jonathan R. Sterling",
    fullName: "Jonathan R. Sterling",
    dateOfBirth: "May 12, 1985",
    idNumber: "TX-992384-88",
    expiryLabel: "Expires in 12 days",
    expiryUrgent: true,
    frontImage: "/front.svg",
    backImage: "/back.svg",
    checklist: [
      { label: "Photo matches user profile", checked: true },
      { label: "Security holograms verified", checked: false },
      { label: "Address matches billing info", checked: false },
    ],
  },
};

export function getVerificationCase(application: DriverApplication): IdVerificationCase {
  return (
    verificationCases[application.id] ?? {
      subjectName: application.driverName,
      fullName: application.driverName,
      dateOfBirth: "—",
      idNumber: "—",
      expiryLabel: "Expiry not yet extracted",
      expiryUrgent: false,
      frontImage: "/front.svg",
      backImage: "/back.svg",
      checklist: [
        { label: "Photo matches user profile", checked: false },
        { label: "Security holograms verified", checked: false },
        { label: "Address matches billing info", checked: false },
      ],
    }
  );
}
