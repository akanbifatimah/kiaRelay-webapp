import { ArrowUpRight } from "lucide-react";
import { Card } from "../../../components/Card";

interface CompanyInvoiceStatsRowProps {
  totalReceivables: string;
  receivablesDeltaLabel: string;
  paidInvoicesTotal: string;
  paidInvoicesWindowLabel: string;
  overdueTotal: string;
  overdueCountLabel: string;
}

export function CompanyInvoiceStatsRow({
  totalReceivables,
  receivablesDeltaLabel,
  paidInvoicesTotal,
  paidInvoicesWindowLabel,
  overdueTotal,
  overdueCountLabel,
}: CompanyInvoiceStatsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="flex flex-col gap-3">
        <span className="text-label text-text-muted">Total Receivables</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-text">{totalReceivables}</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {receivablesDeltaLabel}
          </span>
        </div>
      </Card>
      <Card className="flex flex-col gap-3">
        <span className="text-label text-text-muted">Paid Invoices</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-text">{paidInvoicesTotal}</span>
          <span className="text-xs font-medium text-text-muted">{paidInvoicesWindowLabel}</span>
        </div>
      </Card>
      <Card className="flex flex-col gap-3">
        <span className="text-label text-text-muted">Overdue</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-danger">{overdueTotal}</span>
          <span className="text-xs font-medium text-danger">{overdueCountLabel}</span>
        </div>
      </Card>
    </div>
  );
}
