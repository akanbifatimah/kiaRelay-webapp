import type { Column } from "../../../components/DataTable";
import type { ExportColumn } from "../../../lib/exportTable";
import { cn } from "../../../lib/cn";
import { claimTone, formatMoneyExact, formatPct, otdTone } from "../formatReport";
import { industryLabels } from "../customerPerformanceData";
import type { CohortSummary, CustomerAccount } from "../customerPerformance";
import type { TotalsCell } from "./TotalsRow";
import { AccountAvatar, IndustryChip } from "./AccountBadges";

export type DirectorySortKey = "name" | "industry" | "orders" | "spend" | "avgOrder" | "otdRate" | "claimRate";

export const DIRECTORY_SORTERS: Record<DirectorySortKey, (row: CustomerAccount) => string | number> = {
  name: (row) => row.name,
  industry: (row) => industryLabels[row.industry],
  orders: (row) => row.orders,
  spend: (row) => row.spend,
  avgOrder: (row) => row.avgOrder,
  otdRate: (row) => row.otdRate,
  claimRate: (row) => row.claimRate,
};

const mono = "whitespace-nowrap font-mono tabular-nums";

export const directoryColumns: Column<CustomerAccount>[] = [
  {
    header: "Customer / Account ID",
    sortKey: "name",
    accessor: (row) => (
      <div className="flex items-center gap-3 whitespace-nowrap">
        <AccountAvatar name={row.name} industry={row.industry} />
        <div>
          <p className="font-medium text-text">{row.name}</p>
          <p className="font-mono text-xs text-text-muted">{row.id}</p>
        </div>
      </div>
    ),
  },
  { header: "Industry", sortKey: "industry", accessor: (row) => <IndustryChip industry={row.industry} /> },
  { header: "Orders", sortKey: "orders", align: "right", accessor: (row) => <span className={mono}>{row.orders.toLocaleString()}</span> },
  { header: "Total Spend", sortKey: "spend", align: "right", accessor: (row) => <span className={cn(mono, "font-semibold")}>{formatMoneyExact(row.spend)}</span> },
  { header: "Avg Order", sortKey: "avgOrder", align: "right", accessor: (row) => <span className={cn(mono, "text-text-muted")}>{formatMoneyExact(row.avgOrder)}</span> },
  { header: "OTD Rate", sortKey: "otdRate", align: "right", accessor: (row) => <span className={cn(mono, "font-semibold", otdTone(row.otdRate))}>{formatPct(row.otdRate)}</span> },
  { header: "Claim %", sortKey: "claimRate", align: "right", accessor: (row) => <span className={cn(mono, claimTone(row.claimRate))}>{formatPct(row.claimRate)}</span> },
];

export const directoryExportColumns: ExportColumn<CustomerAccount>[] = [
  { header: "Account ID", value: (row) => row.id },
  { header: "Customer", value: (row) => row.name },
  { header: "Industry", value: (row) => industryLabels[row.industry] },
  { header: "Orders", value: (row) => row.orders, align: "right" },
  { header: "Total Spend", value: (row) => row.spend.toFixed(2), align: "right" },
  { header: "Avg Order", value: (row) => row.avgOrder.toFixed(2), align: "right" },
  { header: "OTD Rate %", value: (row) => row.otdRate.toFixed(1), align: "right" },
  { header: "Claim %", value: (row) => row.claimRate.toFixed(2), align: "right" },
];

export function directoryTotalsCells(summary: CohortSummary): TotalsCell[] {
  return [
    { content: <span className="font-sans">Cohort Aggregates / Average</span> },
    { content: <span className="font-sans text-xs font-normal text-text-muted">{summary.accounts.toLocaleString()} Represented Accounts</span> },
    { content: summary.orders.toLocaleString(), align: "right" },
    { content: formatMoneyExact(summary.spend), align: "right" },
    { content: formatMoneyExact(summary.avgOrder), align: "right" },
    { content: formatPct(summary.otdRate), align: "right", className: "text-success" },
    { content: formatPct(summary.claimRate, 2), align: "right" },
  ];
}

export function directoryExportFooter(summary: CohortSummary): string[] {
  return [
    "COHORT",
    `${summary.accounts} accounts`,
    "",
    String(summary.orders),
    summary.spend.toFixed(2),
    summary.avgOrder.toFixed(2),
    summary.otdRate.toFixed(1),
    summary.claimRate.toFixed(2),
  ];
}
