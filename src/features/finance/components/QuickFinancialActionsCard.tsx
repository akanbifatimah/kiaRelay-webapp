import { Eye, Truck, FileText, RotateCcw, CalendarClock, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/Button";
import { downloadFinanceReport } from "../downloadFinanceReport";
import type { FinanceSnapshot } from "../data";

interface QuickFinancialActionsCardProps {
  snapshot: FinanceSnapshot;
  rangeLabel: string;
}

// Dark card, same bg-sidebar template as OperationalInsightCard/
// InvoiceSummaryStats — plain <button>s for the bordered rows (see
// PerformanceHeroTile for why, not Card/Button + a conflicting className).
// All five actions have real destinations now.
export function QuickFinancialActionsCard({ snapshot, rangeLabel }: QuickFinancialActionsCardProps) {
  const navigate = useNavigate();

  const actions = [
    { label: "View Revenue", icon: Eye, onClick: () => navigate("/finance/revenue") },
    { label: "Driver Payouts", icon: Truck, onClick: () => navigate("/finance/payouts") },
    { label: "Company Invoices", icon: FileText, onClick: () => navigate("/finance/invoices") },
    { label: "Refunds & Adjustments", icon: RotateCcw, onClick: () => navigate("/finance/refunds") },
    { label: "Payout Schedules", icon: CalendarClock, onClick: () => navigate("/finance/payout-schedules") },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-sidebar p-5 text-white shadow-sm">
      <h3 className="text-label text-white/70">Quick Financial Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-left text-sm font-medium text-white hover:bg-white/10"
          >
            <Icon className="h-4 w-4 text-primary" />
            {label}
          </button>
        ))}
      </div>
      <Button onClick={() => downloadFinanceReport(snapshot, rangeLabel)}>
        <Download className="h-4 w-4" />
        Export Finance Report
      </Button>
    </div>
  );
}
