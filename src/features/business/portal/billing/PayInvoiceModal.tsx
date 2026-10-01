import { useState } from "react";
import { CheckCircle2, CreditCard, Landmark } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Modal } from "../../../../components/Modal";
import { cn } from "../../../../lib/cn";
import type { Invoice } from "../../../customers/companyInvoices";
import type { PaymentMethod } from "../../../customers/customerDetails";

interface PayInvoiceModalProps {
  invoice: Invoice;
  methods: PaymentMethod[];
  onClose: () => void;
  onPay: (methodLabel: string) => void;
}

// Pay Now (2026-10-01; the design shows the button, not the payment step —
// first pass): ACH or a card on file (PRD §5). Admin sees the payment.
// TODO: POST /invoices/:id/payments via the payment processor.
export function PayInvoiceModal({ invoice, methods, onClose, onPay }: PayInvoiceModalProps) {
  const usable = methods.filter((m) => m.status === "verified" && m.type !== "paypal");
  const [methodId, setMethodId] = useState(usable.find((m) => m.type === "bank")?.id ?? usable[0]?.id);
  const method = usable.find((m) => m.id === methodId);

  return (
    <Modal
      title={`Pay ${invoice.id}`}
      subtitle={`Amount due ${invoice.amount} · due ${invoice.dueDate}`}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!method} onClick={() => method && onPay(method.label)}>Pay {invoice.amount}</Button>
        </div>
      }
    >
      <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-2">
        {usable.length === 0 && <p className="text-sm text-text-muted">No bank account or card on file. Email billing to set one up.</p>}
        {usable.map((m) => {
          const Icon = m.type === "bank" ? Landmark : CreditCard;
          const on = m.id === methodId;
          return (
            <button key={m.id} type="button" role="radio" aria-checked={on} onClick={() => setMethodId(m.id)} className={cn("flex items-center gap-3 rounded-lg border p-3 text-left", on ? "border-2 border-primary" : "border-border hover:bg-bg")}>
              <Icon className="h-5 w-5 text-sidebar" />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-text">{m.label}</span>
                <span className="block text-xs text-text-muted">{m.type === "bank" ? `ACH · ${m.accountType ?? m.detail}` : m.detail}</span>
              </span>
              {on && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
