import type { IdVerificationCase } from "../../types/identityVerification";

export type OnboardingStatus = "pending" | "approved" | "rejected";

export interface DriverApplication {
  id: string;
  driverName: string;
  submittedDate: string;
  status: OnboardingStatus;
}

// TODO: replace with GET /drivers/onboarding-queue once the Driver
// Management / Compliance API exists.
export const driverApplications: DriverApplication[] = [
  { id: "drv-1", driverName: "Jonathan R. Sterling", submittedDate: "Sep 5, 2026", status: "pending" },
  { id: "drv-2", driverName: "Maria Gonzalez", submittedDate: "Sep 4, 2026", status: "approved" },
  { id: "drv-3", driverName: "Kevin Walsh", submittedDate: "Sep 3, 2026", status: "pending" },
  { id: "drv-4", driverName: "Aisha Bello", submittedDate: "Sep 2, 2026", status: "rejected" },
  { id: "drv-5", driverName: "Tom Harrington", submittedDate: "Sep 1, 2026", status: "approved" },
  { id: "drv-6", driverName: "Priya Shah", submittedDate: "Aug 30, 2026", status: "pending" },
];

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
