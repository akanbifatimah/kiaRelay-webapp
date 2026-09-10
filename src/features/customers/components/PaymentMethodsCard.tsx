import { CreditCard, Wallet, Landmark } from "lucide-react";
import { Card } from "../../../components/Card";
import type { PaymentMethod } from "../customerDetails";

const icons = [CreditCard, Wallet, Landmark];

export function PaymentMethodsCard({ methods }: { methods: PaymentMethod[] }) {
  if (methods.length === 0) return null;

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Payment Methods</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {methods.map((method, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={method.label} className="flex items-center gap-2 rounded-lg border border-border p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bg text-text-muted">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">{method.label}</p>
                <p className="truncate text-xs text-text-muted">{method.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
