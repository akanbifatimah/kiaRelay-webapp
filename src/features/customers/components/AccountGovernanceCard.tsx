import { useState } from "react";
import { KeyRound, UserX, Trash2, ChevronRight, CreditCard } from "lucide-react";
import { Card } from "../../../components/Card";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { cn } from "../../../lib/cn";
import { EditCreditTermsModal } from "./EditCreditTermsModal";
import type { CreditTerms } from "../customerDetails";

type GovernanceAction = "reset-password" | "suspend" | "delete";

function GovernanceRow({
  icon: Icon,
  label,
  danger,
  onClick,
}: {
  icon: typeof KeyRound;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-bg",
        danger ? "text-danger" : "text-text",
      )}
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-text-muted" />
    </button>
  );
}

interface AccountGovernanceCardProps {
  customerName: string;
  creditTerms?: CreditTerms;
}

// TODO: replace with real POST /customers/:id/reset-password,
// /suspend, /delete calls once the Customer Management API exists.
export function AccountGovernanceCard({ customerName, creditTerms }: AccountGovernanceCardProps) {
  const { showToast } = useToast();
  const [confirming, setConfirming] = useState<GovernanceAction | null>(null);
  const [isCreditTermsOpen, setIsCreditTermsOpen] = useState(false);

  function handleConfirm() {
    if (confirming === "suspend") showToast("success", "Customer access suspended.");
    if (confirming === "delete") showToast("success", "Customer profile deleted.");
    setConfirming(null);
  }

  return (
    <Card className="flex flex-col gap-1">
      <h3 className="text-label mb-1 text-text-muted">Account Governance</h3>
      <GovernanceRow
        icon={KeyRound}
        label="Reset Password"
        onClick={() => showToast("success", "Password reset email sent.")}
      />
      {creditTerms && (
        <GovernanceRow icon={CreditCard} label="Edit Credit Terms" onClick={() => setIsCreditTermsOpen(true)} />
      )}
      <GovernanceRow icon={UserX} label="Suspend Access" onClick={() => setConfirming("suspend")} />
      <GovernanceRow icon={Trash2} label="Delete Profile" danger onClick={() => setConfirming("delete")} />

      {confirming && (
        <ConfirmModal
          title={confirming === "suspend" ? "Suspend this customer?" : "Delete this profile?"}
          message={
            confirming === "suspend"
              ? "They'll immediately lose access to their account until reinstated."
              : "This permanently removes the customer's profile and order history. This can't be undone."
          }
          confirmLabel={confirming === "suspend" ? "Suspend Access" : "Delete Profile"}
          tone="danger"
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(null)}
        />
      )}

      {isCreditTermsOpen && creditTerms && (
        <EditCreditTermsModal
          customerName={customerName}
          terms={creditTerms}
          onClose={() => setIsCreditTermsOpen(false)}
          onUpdated={() => setIsCreditTermsOpen(false)}
        />
      )}
    </Card>
  );
}
