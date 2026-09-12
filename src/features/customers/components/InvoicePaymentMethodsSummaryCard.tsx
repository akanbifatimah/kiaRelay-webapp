import { CreditCard, Landmark, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/Card";
import type { PaymentMethod } from "../customerDetails";

const icons = { card: CreditCard, bank: Landmark, paypal: Wallet } as const;

const statusLabels: Record<PaymentMethod["status"], string> = {
  verified: "Verified",
  pending: "Pending",
  expired: "Expired",
};

interface InvoicePaymentMethodsSummaryCardProps {
  methods: PaymentMethod[];
  paymentsHref: string;
}

export function InvoicePaymentMethodsSummaryCard({ methods, paymentsHref }: InvoicePaymentMethodsSummaryCardProps) {
  return (
    <Card className="flex h-full flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Payment Methods</h3>

      <div className="flex flex-col gap-3">
        {methods.map((method) => {
          const Icon = icons[method.type];
          return (
            <div key={method.id} className="flex items-center gap-2.5 rounded-lg border border-border p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bg text-text-muted">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-text">{method.label}</p>
                <p className="text-xs text-text-muted">
                  {method.detail}
                  {method.isDefault ? " · Default" : ` · ${statusLabels[method.status]}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Link to={paymentsHref} className="mt-auto text-sm font-medium text-primary hover:underline">
        Manage Payment Methods
      </Link>
    </Card>
  );
}
