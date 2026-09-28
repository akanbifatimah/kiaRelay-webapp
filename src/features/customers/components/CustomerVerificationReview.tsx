import { useNavigate } from "react-router-dom";
import { IdVerificationReviewModal } from "../../../components/IdVerificationReviewModal";
import { getCustomerVerificationCase } from "../identityVerification";
import type { Customer, VerificationStatus } from "../data";

interface CustomerVerificationReviewProps {
  customer: Customer | null;
  onClose: () => void;
  onResult: (customer: Customer, verification: VerificationStatus) => void;
}

// The list's "Review Verification" flow, split out of CustomersListPage
// (2026-09-28) to keep it under 150 lines. Approving a company continues to
// its document-level verification page.
export function CustomerVerificationReview({ customer, onClose, onResult }: CustomerVerificationReviewProps) {
  const navigate = useNavigate();
  if (!customer) return null;

  return (
    <IdVerificationReviewModal
      caseData={getCustomerVerificationCase(customer)}
      onClose={onClose}
      onApprove={() => {
        onResult(customer, "verified");
        navigate(`/customers/${customer.accountType}/${customer.id}/verification`);
      }}
      onReject={() => onResult(customer, "failed")}
    />
  );
}
