import type { CustomerDetail } from "./customerDetails";

export type ChecklistItemStatus = "verified" | "pending" | "not-started" | "rejected";

export interface VerificationChecklistItem {
  label: string;
  status: ChecklistItemStatus;
}

export interface VerificationHistoryEntry {
  id: string;
  description: string;
  timestamp: string;
  tone: "success" | "warning";
}

export interface CompanyVerificationDocument {
  name: string;
  fileId: string;
  sizeLabel: string;
  registrationNumber: string;
  submissionDate: string;
  reviewer: string;
  lastUpdated: string;
  previewSrc: string;
}

export interface CompanyVerificationDetail {
  companyLegalName: string;
  entityType: string;
  jurisdiction: string;
  contactEmail: string;
  phoneNumber: string;
  registeredAddress: string;
  checklist: VerificationChecklistItem[];
  document: CompanyVerificationDocument;
  history: VerificationHistoryEntry[];
}

// TODO: replace with GET /customers/:id/verification once the Compliance
// API exists. Only KR-11029-NX (Atlas Global Logistics Ltd) is hand-authored
// to match the Figma reference — every other pending company falls back to
// the generic shape in getCompanyVerificationDetail() below.
const companyVerifications: Record<string, CompanyVerificationDetail> = {
  "KR-11029-NX": {
    companyLegalName: "Atlas Global Logistics Ltd",
    entityType: "Private Limited",
    jurisdiction: "United Kingdom",
    contactEmail: "compliance@atlasglobal.co.uk",
    phoneNumber: "+44 20 7946 0123",
    registeredAddress: "128 Canary Wharf, Level 14, London, E14 5AA",
    checklist: [
      { label: "Business Identity", status: "verified" },
      { label: "Business Registration", status: "pending" },
      { label: "Authorised Signatory", status: "verified" },
      { label: "Email Verification", status: "verified" },
      { label: "Phone Verification", status: "not-started" },
    ],
    document: {
      name: "Certificate of Incorporation",
      fileId: "REG-000-2023-08NZ-LM",
      sizeLabel: "1.4 MB",
      registrationNumber: "UK-8842-XPL",
      submissionDate: "Oct 24, 2023",
      reviewer: "M. Henderson",
      lastUpdated: "2 hours ago",
      previewSrc: "/Background.svg",
    },
    history: [
      {
        id: "vh-1",
        description: "Email Address successfully verified via automated SMTP challenge.",
        timestamp: "Oct 24, 2023 • 1:42 AM",
        tone: "success",
      },
      {
        id: "vh-2",
        description: "Business Registration document uploaded by James Wilson (Client Admin).",
        timestamp: "Oct 24, 2023 • 1:41 AM",
        tone: "warning",
      },
      {
        id: "vh-3",
        description: "Authorised Signatory identity confirmed via KYC provider integration.",
        timestamp: "Oct 24, 2023 • 12:30 PM",
        tone: "success",
      },
    ],
  },
};

export function getCompanyVerificationDetail(detail: CustomerDetail): CompanyVerificationDetail {
  return (
    companyVerifications[detail.id] ?? {
      companyLegalName: detail.name,
      entityType: "—",
      jurisdiction: "—",
      contactEmail: detail.email,
      phoneNumber: detail.phone,
      registeredAddress: "—",
      checklist: [
        { label: "Business Identity", status: "not-started" },
        { label: "Business Registration", status: "not-started" },
        { label: "Authorised Signatory", status: "not-started" },
        { label: "Email Verification", status: detail.emailVerified ? "verified" : "not-started" },
        { label: "Phone Verification", status: detail.phoneVerified ? "verified" : "not-started" },
      ],
      document: {
        name: "Certificate of Incorporation",
        fileId: "—",
        sizeLabel: "—",
        registrationNumber: "—",
        submissionDate: "—",
        reviewer: "—",
        lastUpdated: "—",
        previewSrc: "/Background.svg",
      },
      history: [],
    }
  );
}
