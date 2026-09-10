import type { Customer } from "./data";
import type { IdVerificationCase } from "../../types/identityVerification";

// TODO: replace with GET /customers/:id/verification once the Customer
// Management / Compliance API exists. Fully generic for now — reuses the
// same shared review modal built for Driver Onboarding (front.svg/back.svg
// placeholders, blank OCR fields) since no Figma reference exists yet for
// the customer side of this flow.
export function getCustomerVerificationCase(customer: Customer): IdVerificationCase {
  return {
    subjectName: customer.name,
    fullName: customer.name,
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
  };
}
