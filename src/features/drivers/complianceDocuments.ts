export type DocumentStatus = "approved" | "pending";

export type DocAction = "view" | "flag" | "approveNow" | "reject" | "requestUpdate" | "fullReport" | "approve";

export interface ComplianceDocument {
  id: string;
  title: string;
  thumbnail: string;
  expiryLabel: string;
  expiryUrgent: boolean;
  uploadedBy?: string;
  note?: string;
  status: DocumentStatus;
  actions: DocAction[];
}

export const documentTitles = [
  "Driver License",
  "Govt ID (Passport)",
  "Vehicle Registration",
  "Commercial Insurance",
  "Vehicle Inspection",
  "Criminal Background",
  "TWIC Card",
];

export const portfolioMeta = {
  totalMandatory: 7,
  lastScanLabel: "3h ago",
};

// TODO: replace with GET /drivers/:id/background-check once the Compliance
// Management API exists (PRD §9.6). Matches the Checkr-style summary shown
// on Marcus Thorne's (DR-08190) Documents tab.
export const backgroundVerification = {
  provider: "Checkr Integrated Services",
  status: "cleared" as const,
  resultSummary: "No criminal history found in 7-year records search.",
  scopeNote: "Includes National Criminal Database, Sex Offender Registry, and Global Watchlist checks across all known jurisdictions of residence.",
  reportId: "CHK-77420-XT",
  ssnTraceStatus: "Valid",
  completedOn: "Oct 12, 2023",
  checks: [
    { label: "National Criminal Database", status: "Clear" },
    { label: "Sex Offender Registry", status: "Clear" },
    { label: "Global Watchlist", status: "Clear" },
    { label: "Motor Vehicle Record", status: "Clear" },
    { label: "Employment Verification", status: "Clear" },
    { label: "SSN Trace", status: "Valid" },
  ],
};

// TODO: replace with GET /drivers/:id/documents once the Compliance
// Management API exists. Only Marcus Thorne (DR-08190) has a full mock
// portfolio — matches the Figma reference.
export const complianceDocuments: ComplianceDocument[] = [
  {
    id: "doc-1",
    title: "Driver License",
    thumbnail: "/front.svg",
    expiryLabel: "Expires: 12/04/2026",
    expiryUrgent: false,
    uploadedBy: "Sarah Jenkins",
    status: "approved",
    actions: ["view", "flag"],
  },
  {
    id: "doc-2",
    title: "Govt ID (Passport)",
    thumbnail: "/back.svg",
    expiryLabel: "Expires: 09/09/2028",
    expiryUrgent: false,
    uploadedBy: "Sarah Jenkins",
    status: "approved",
    actions: ["view", "flag"],
  },
  {
    id: "doc-3",
    title: "Vehicle Registration",
    thumbnail: "/Background.svg",
    expiryLabel: "Expires: 01/01/2025",
    expiryUrgent: false,
    note: "Awaiting assignment",
    status: "pending",
    actions: ["approveNow", "reject"],
  },
  {
    id: "doc-4",
    title: "Commercial Insurance",
    thumbnail: "/Background.svg",
    expiryLabel: "Expires: 12/31/2024",
    expiryUrgent: true,
    uploadedBy: "Mike Ross",
    status: "approved",
    actions: ["requestUpdate"],
  },
  {
    id: "doc-5",
    title: "Vehicle Inspection",
    thumbnail: "/front.svg",
    expiryLabel: "Expires: 10/10/2025",
    expiryUrgent: false,
    uploadedBy: "Sarah Jenkins",
    status: "approved",
    actions: ["view"],
  },
  {
    id: "doc-6",
    title: "Criminal Background",
    thumbnail: "/Background.svg",
    expiryLabel: "Next Check: 10/2026",
    expiryUrgent: false,
    note: "System Verified",
    status: "approved",
    actions: ["fullReport"],
  },
  {
    id: "doc-7",
    title: "TWIC Card",
    thumbnail: "/back.svg",
    expiryLabel: "Expires: 02/11/2027",
    expiryUrgent: false,
    note: "Pending Admin Review",
    status: "pending",
    actions: ["view", "approve", "reject"],
  },
];
