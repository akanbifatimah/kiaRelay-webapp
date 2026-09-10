export interface ComplianceCheckItem {
  label: string;
  checked: boolean;
}

// Shared by Driver Onboarding (document review) and Customer Management
// (individual account ID verification) — promoted 2026-09-08 once both
// features needed the same review-modal shape. `subjectName` is whoever's
// ID is under review (a driver applicant or a customer), separate from
// `fullName`, which is the OCR-extracted legal name off the document.
export interface IdVerificationCase {
  subjectName: string;
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  expiryLabel: string;
  expiryUrgent: boolean;
  frontImage: string;
  backImage: string;
  checklist: ComplianceCheckItem[];
}
