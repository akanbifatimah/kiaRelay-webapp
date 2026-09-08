import { Phone, CheckCircle2 } from "lucide-react";
import { Card } from "../../../components/Card";
import type { OrderDetail } from "../orderDetails";

type CustomerRecipientCardProps = Pick<OrderDetail, "customer" | "accountNumber" | "verified" | "phone">;

export function CustomerRecipientCard({ customer, accountNumber, verified, phone }: CustomerRecipientCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Customer &amp; Recipient</h3>
      <div className="flex items-start justify-between border-b border-border pb-3">
        <div>
          <p className="text-sm font-medium text-text">{customer}</p>
          <p className="text-xs text-text-muted">Account: {accountNumber}</p>
        </div>
        {verified && (
          <span className="text-badge inline-flex items-center gap-1 rounded-full bg-tag-healthcare-bg px-2 py-0.5 text-tag-healthcare-fg">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-text">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg text-text-muted">
          <Phone className="h-3.5 w-3.5" />
        </span>
        {phone}
      </div>
    </Card>
  );
}
