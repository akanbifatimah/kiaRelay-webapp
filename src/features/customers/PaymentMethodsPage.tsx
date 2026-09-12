import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Info } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useToast } from "../../components/toast/ToastContext";
import { PaymentMethodCard } from "./components/PaymentMethodCard";
import { AddPaymentMethodModal } from "./components/AddPaymentMethodModal";
import { RecentBillingActivityCard } from "./components/RecentBillingActivityCard";
import { customers } from "./data";
import { getCustomerDetail } from "./customerDetails";
import type { PaymentMethod } from "./customerDetails";
import { buildBillingActivity } from "./billingActivity";

export function PaymentMethodsPage() {
  const { accountType, id } = useParams<{ accountType: string; id: string }>();
  const { showToast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const customer = customers.find((c) => c.id === id);
  const detail = customer ? getCustomerDetail(customer) : null;
  const [methods, setMethods] = useState<PaymentMethod[]>(detail?.paymentMethods ?? []);
  const activity = useMemo(() => (detail ? buildBillingActivity(detail) : []), [detail]);

  if (!customer || !detail) {
    return <Navigate to={`/customers/${accountType ?? "individual"}`} replace />;
  }

  const methodToRemove = methods.find((m) => m.id === removing);

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/customers/${detail.accountType}/${detail.id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Profile
      </Link>

      <PageHeader
        title={`Payment Methods — ${detail.name}`}
        subtitle="Manage saved cards and bank accounts for automated billing."
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add New Method
          </Button>
        }
      />

      <div className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-sidebar p-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
          <div>
            <p className="text-sm font-medium text-white">
              {detail.accountType === "individual" ? "Individual" : "Company"} accounts are charged at time of
              booking.
            </p>
            <p className="text-xs text-white/60">Payments are processed securely via encrypted gateways.</p>
          </div>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddOpen(true)} className="w-fit">
          Add New Method
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <PaymentMethodCard key={method.id} method={method} onRemove={() => setRemoving(method.id)} />
        ))}
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm font-medium text-text-muted hover:border-primary hover:text-primary"
        >
          <Plus className="h-5 w-5" />
          Add Payment Method
        </button>
      </div>

      <RecentBillingActivityCard
        activity={activity}
        historyHref={
          detail.accountType === "company"
            ? `/customers/${detail.accountType}/${detail.id}/invoices`
            : `/customers/${detail.accountType}/${detail.id}/orders`
        }
        historyLabel={detail.accountType === "company" ? "View Invoice History" : "View Order History"}
      />

      {isAddOpen && (
        <AddPaymentMethodModal
          onClose={() => setIsAddOpen(false)}
          onAdd={(method) => {
            setMethods((prev) => [...prev, method]);
            showToast("success", "Payment method added.");
          }}
        />
      )}

      {methodToRemove && (
        <ConfirmModal
          title="Remove this payment method?"
          message={`${methodToRemove.label} will no longer be available for future charges.`}
          confirmLabel="Remove Method"
          tone="danger"
          onConfirm={() => {
            setMethods((prev) => prev.filter((m) => m.id !== removing));
            showToast("success", "Payment method removed.");
            setRemoving(null);
          }}
          onCancel={() => setRemoving(null)}
        />
      )}
    </div>
  );
}
