import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { SuspendAccountModal } from "./SuspendAccountModal";
import { getCustomerDetail } from "../customerDetails";
import type { Customer, CustomerStatus } from "../data";

export interface StatusChange {
  customer: Customer;
  action: "suspend" | "reactivate";
}

interface CustomerStatusDialogsProps {
  change: StatusChange | null;
  onClose: () => void;
  onStatusChange: (customer: Customer, status: CustomerStatus) => void;
}

// Suspend / Reactivate from the Customers list's row menu (TC-11,
// 2026-09-28). Suspend reuses the profile's full SuspendAccountModal;
// reactivating is a simple confirmation.
// TODO: POST /customers/:id/{suspend,reactivate} once the API exists.
export function CustomerStatusDialogs({ change, onClose, onStatusChange }: CustomerStatusDialogsProps) {
  const { showToast } = useToast();
  if (!change) return null;
  const { customer, action } = change;

  if (action === "suspend") {
    return (
      <SuspendAccountModal
        customerName={customer.name}
        orders={getCustomerDetail(customer).recentOrders}
        onClose={onClose}
        onSuspended={() => {
          onStatusChange(customer, "suspended");
          onClose();
        }}
      />
    );
  }

  return (
    <ConfirmModal
      title="Reactivate Account"
      message={`${customer.name} will be able to sign in and place orders again.`}
      confirmLabel="Reactivate"
      onCancel={onClose}
      onConfirm={() => {
        onStatusChange(customer, "active");
        showToast("success", `${customer.name}'s account was reactivated.`);
        onClose();
      }}
    />
  );
}
