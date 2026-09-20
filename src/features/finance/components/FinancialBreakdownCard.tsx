import { Wallet } from "lucide-react";
import { Card } from "../../../components/Card";
import type { BreakdownLine } from "../transactionDetail";

function formatAmount(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

interface FinancialBreakdownCardProps {
  lines: BreakdownLine[];
  netRevenue: number;
}

export function FinancialBreakdownCard({ lines, netRevenue }: FinancialBreakdownCardProps) {
  return (
    <Card className="flex flex-col gap-3 border-l-4 border-l-primary">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
        <Wallet className="h-4 w-4 text-primary" />
        Financial Breakdown
      </h3>
      <div className="flex flex-col divide-y divide-border">
        {lines.map((line) => (
          <div key={line.label} className="flex items-center justify-between gap-2 py-2.5 text-sm">
            <div>
              <p className="text-text">{line.label}</p>
              <p className="text-xs text-text-muted">{line.sublabel}</p>
            </div>
            <span className={line.amount < 0 ? "font-medium text-danger" : "font-medium text-text"}>
              {formatAmount(line.amount)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-[var(--radius-card)] bg-sidebar px-4 py-3 text-white">
        <div>
          <p className="text-label text-white/60">KiaRelay Net Revenue</p>
          <p className="text-xs text-white/60">excluding platform commission</p>
        </div>
        <span className="text-xl font-semibold text-primary">{formatAmount(netRevenue)}</span>
      </div>
    </Card>
  );
}
