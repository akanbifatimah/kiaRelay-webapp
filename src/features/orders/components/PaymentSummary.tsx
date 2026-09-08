import { Banknote, CheckCircle2 } from "lucide-react";
import type { OrderDetail } from "../orderDetails";

interface PaymentSummaryProps {
  payment: OrderDetail["payment"];
  totalPaid: string;
  invoiceNote: string;
}

export function PaymentSummary({ payment, totalPaid, invoiceNote }: PaymentSummaryProps) {
  return (
    <section className="flex flex-col gap-2 rounded-lg bg-sidebar p-4 text-white">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-white/70">Payment Summary</h3>
        <Banknote className="h-4 w-4 text-white/50" />
      </div>
      {payment.map((line) => (
        <div key={line.label} className="flex items-center justify-between text-sm">
          <span className="text-white/80">{line.label}</span>
          <span>{line.amount}</span>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-white/10 pt-2 text-sm font-semibold">
        <span>Total Paid</span>
        <span className="text-primary">{totalPaid}</span>
      </div>
      {invoiceNote && (
        <p className="flex items-center gap-1.5 border-t border-white/10 pt-2 text-xs text-white/60">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
          {invoiceNote}
        </p>
      )}
    </section>
  );
}
