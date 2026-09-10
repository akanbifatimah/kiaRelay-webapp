import { CreditCard, Landmark, Wallet, Trash2 } from "lucide-react";
import { Tooltip } from "../../../components/Tooltip";
import { cn } from "../../../lib/cn";
import type { PaymentMethod } from "../customerDetails";

const icons = { card: CreditCard, bank: Landmark, paypal: Wallet } as const;

const statusClasses: Record<PaymentMethod["status"], string> = {
  verified: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  expired: "bg-danger/10 text-danger",
};

const statusLabels: Record<PaymentMethod["status"], string> = {
  verified: "Verified",
  pending: "Pending",
  expired: "Expired",
};

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onRemove: () => void;
}

export function PaymentMethodCard({ method, onRemove }: PaymentMethodCardProps) {
  const Icon = icons[method.type];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg text-text-muted">
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex items-center gap-2">
          {method.isDefault && (
            <span className="text-badge rounded-full bg-tag-freight-bg px-2 py-0.5 text-tag-freight-fg">
              Default
            </span>
          )}
          <span className={cn("text-badge rounded-full px-2 py-0.5", statusClasses[method.status])}>
            {statusLabels[method.status]}
          </span>
          <Tooltip label="Remove payment method">
            <button type="button" aria-label="Remove payment method" onClick={onRemove} className="text-text-muted hover:text-danger">
              <Trash2 className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-text">{method.label}</p>
        <p className="text-xs text-text-muted">{method.detail}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        {method.type === "card" && (
          <>
            <dt className="text-text-muted">Cardholder</dt>
            <dd className="text-right text-text">{method.cardholderName}</dd>
            <dt className="text-text-muted">Expiry</dt>
            <dd className="text-right text-text">{method.expiry}</dd>
          </>
        )}
        {method.type === "bank" && (
          <>
            <dt className="text-text-muted">Bank</dt>
            <dd className="text-right text-text">{method.bankName}</dd>
            <dt className="text-text-muted">Account Type</dt>
            <dd className="text-right text-text">{method.accountType}</dd>
          </>
        )}
        {method.type === "paypal" && (
          <>
            <dt className="text-text-muted">Email</dt>
            <dd className="text-right text-text">{method.email}</dd>
            <dt className="text-text-muted">Connected</dt>
            <dd className="text-right text-text">{method.connectedDate}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
