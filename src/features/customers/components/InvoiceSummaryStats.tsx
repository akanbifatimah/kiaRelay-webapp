import { CreditCard } from "lucide-react";
import { Card } from "../../../components/Card";
import type { InvoiceDetail } from "../invoiceDetail";

export function InvoiceSummaryStats({ detail }: { detail: InvoiceDetail }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="flex flex-col gap-2">
        <span className="text-label text-text-muted">Invoice Date</span>
        <span className="text-xl font-semibold text-text">{detail.invoiceDate}</span>
        <span className="text-xs text-text-muted">{detail.invoiceGeneratedAt}</span>
      </Card>
      <Card className="flex flex-col gap-2">
        <span className="text-label text-text-muted">Due Date</span>
        <span className="text-xl font-semibold text-text">{detail.dueDate}</span>
        <span className="text-xs text-text-muted">{detail.termsLabel}</span>
      </Card>
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] bg-sidebar p-5 text-white">
        <div>
          <span className="text-label text-white/60">Total Invoice Amount</span>
          <p className="mt-1 text-2xl font-semibold">{detail.totalDue}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <CreditCard className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
