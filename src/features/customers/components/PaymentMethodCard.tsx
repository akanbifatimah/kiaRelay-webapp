import { CreditCard, Landmark, Wallet } from "lucide-react";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { cn } from "../../../lib/cn";
import type { PaymentMethod } from "../customerDetails";

const icons = { card: CreditCard, bank: Landmark, paypal: Wallet } as const;

const typeLabels: Record<PaymentMethod["type"], string> = {
  card: "Card",
  bank: "ACH Bank Transfer",
  paypal: "PayPal",
};

const statusClasses: Record<PaymentMethod["status"], string> = {
  verified: "text-success",
  pending: "text-warning",
  expired: "text-danger",
};

const statusDotClasses: Record<PaymentMethod["status"], string> = {
  verified: "bg-success",
  pending: "bg-warning",
  expired: "bg-danger",
};

const statusLabels: Record<PaymentMethod["status"], string> = {
  verified: "Active",
  pending: "Pending",
  expired: "Expired",
};

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onRemove: () => void;
}

export function PaymentMethodCard({ method, onRemove }: PaymentMethodCardProps) {
  const Icon = icons[method.type];
  const displayName = method.type === "card" ? method.label : typeLabels[method.type];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg text-text-muted">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text">{displayName}</p>
              {method.isDefault && (
                <span className="text-badge rounded-full bg-tag-express-bg px-2 py-0.5 text-tag-express-fg">
                  Default
                </span>
              )}
            </div>
            <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", statusClasses[method.status])}>
              <span className={cn("h-1.5 w-1.5 rounded-full", statusDotClasses[method.status])} />
              {statusLabels[method.status]}
            </span>
          </div>
        </div>
        <DropdownMenu
          ariaLabel={`Actions for ${displayName}`}
          items={[{ label: "Remove", onClick: onRemove, tone: "danger" }]}
        />
      </div>

      <dl className="flex flex-col gap-1.5 text-sm">
        {method.type === "card" && (
          <>
            <div className="flex items-center justify-between">
              <dt className="text-text-muted">Cardholder</dt>
              <dd className="text-text">{method.cardholderName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-muted">Expires</dt>
              <dd className="text-text">{method.expiry}</dd>
            </div>
          </>
        )}
        {method.type === "bank" && (
          <>
            <div className="flex items-center justify-between">
              <dt className="text-text-muted">Bank Name</dt>
              <dd className="text-text">{method.bankName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-muted">Account Type</dt>
              <dd className="text-text">{method.accountType}</dd>
            </div>
          </>
        )}
        {method.type === "paypal" && (
          <>
            <div className="flex items-center justify-between">
              <dt className="text-text-muted">Email</dt>
              <dd className="text-text">{method.email}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-muted">Connected On</dt>
              <dd className="text-text">{method.connectedDate}</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
}
