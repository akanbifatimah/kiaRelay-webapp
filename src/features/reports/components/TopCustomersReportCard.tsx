import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Card } from "../../../components/Card";
import { DataTable, type Column } from "../../../components/DataTable";
import { ExportMenuButton } from "../../../components/ExportMenuButton";
import { cn } from "../../../lib/cn";
import { accountsForRange, type CustomerAccount } from "../customerPerformance";
import { industryLabels } from "../customerPerformanceData";
import { DEFAULT_RANGE, rangeBounds, rangeLabel } from "../reportRange";
import { formatMoney, formatPct, otdTone } from "../formatReport";
import { AccountAvatar, IndustryChip } from "./AccountBadges";

type Ranking = "spend" | "orders";
const mono = "whitespace-nowrap font-mono tabular-nums";

const columns: Column<CustomerAccount>[] = [
  {
    header: "Customer / Company",
    accessor: (row) => (
      <span className="flex items-center gap-2 whitespace-nowrap font-medium">
        <AccountAvatar name={row.name} industry={row.industry} />
        {row.name}
      </span>
    ),
  },
  { header: "Vertical", accessor: (row) => <IndustryChip industry={row.industry} /> },
  { header: "Orders", align: "right", accessor: (row) => <span className={mono}>{row.orders.toLocaleString()}</span> },
  { header: "Total Spend", align: "right", accessor: (row) => <span className={cn(mono, "font-semibold")}>{formatMoney(row.spend)}</span> },
  { header: "OTD", align: "right", accessor: (row) => <span className={cn(mono, "font-semibold", otdTone(row.otdRate))}>{formatPct(row.otdRate)}</span> },
];

// Same accounts and 30-day figures as the Customer Performance directory; a
// row opens that account's scorecard there.
export function TopCustomersReportCard() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState<Ranking>("spend");
  const accounts = useMemo(() => accountsForRange(rangeBounds(DEFAULT_RANGE)), []);
  const top = useMemo(() => [...accounts].sort((a, b) => b[ranking] - a[ranking]).slice(0, 5), [accounts, ranking]);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
          <Trophy className="h-4 w-4 text-primary" />
          Top 5 Customers
        </h2>
        <div className="flex items-center gap-2">
          <select
            aria-label="Rank customers by"
            value={ranking}
            onChange={(event) => setRanking(event.target.value as Ranking)}
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-text"
          >
            <option value="spend">By Gross Billing</option>
            <option value="orders">By Order Volume</option>
          </select>
          <ExportMenuButton
            label="Export top customers"
            getExport={() => ({
              title: "Top 5 Customers",
              subtitle: `${rangeLabel(DEFAULT_RANGE)} · ranked ${ranking === "spend" ? "by gross billing" : "by order volume"}`,
              columns: [
                { header: "Account ID", value: (row) => row.id },
                { header: "Customer", value: (row) => row.name },
                { header: "Vertical", value: (row) => industryLabels[row.industry] },
                { header: "Orders", value: (row) => row.orders, align: "right" },
                { header: "Total Spend", value: (row) => row.spend.toFixed(2), align: "right" },
                { header: "OTD %", value: (row) => row.otdRate.toFixed(1), align: "right" },
              ],
              rows: top,
            })}
          />
        </div>
      </div>
      <DataTable columns={columns} rows={top} rowKey={(row) => row.id} onRowClick={(row) => navigate(`/reports/customers?account=${encodeURIComponent(row.id)}`)} />
    </Card>
  );
}
