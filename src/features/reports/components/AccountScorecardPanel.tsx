import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, FileText } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SlideOverPanel } from "../../../components/SlideOverPanel";
import { Button } from "../../../components/Button";
import { useToast } from "../../../components/toast/ToastContext";
import { printRowsAsPdf } from "../../../lib/exportTable";
import { cn } from "../../../lib/cn";
import { accountMonthlyHistory, type CustomerAccount, type ScorecardMonth } from "../customerPerformance";
import { industryLabels } from "../customerPerformanceData";
import { claimTone, formatMoneyCompact, formatMoneyExact, formatPct, otdTone } from "../formatReport";
import { AccountAvatar, IndustryChip } from "./AccountBadges";

interface AccountScorecardPanelProps {
  account: CustomerAccount;
  rangeText: string;
  onClose: () => void;
}

// Not in the shared designs (2026-09-23) — built so a directory row leads
// somewhere, per the "build screens, not stubs" direction: the account's
// period KPIs plus a six-month spend/OTD history, exportable as a PDF.
export function AccountScorecardPanel({ account, rangeText, onClose }: AccountScorecardPanelProps) {
  const { showToast } = useToast();
  const history = useMemo(() => accountMonthlyHistory(account), [account]);
  const kpis = [
    { label: "Orders", value: account.orders.toLocaleString() },
    { label: "Total Spend", value: formatMoneyExact(account.spend) },
    { label: "Avg Order", value: formatMoneyExact(account.avgOrder) },
    { label: "OTD Rate", value: formatPct(account.otdRate), tone: otdTone(account.otdRate) },
    { label: "Claim Rate", value: formatPct(account.claimRate, 2), tone: claimTone(account.claimRate) },
  ];

  function exportScorecard() {
    const opened = printRowsAsPdf<ScorecardMonth>({
      title: `Account Scorecard — ${account.name}`,
      subtitle: `${account.id} · ${industryLabels[account.industry]} · ${rangeText}: ${kpis.map((k) => `${k.label} ${k.value}`).join(" · ")}`,
      columns: [
        { header: "Month", value: (row) => row.label },
        { header: "Orders", value: (row) => row.orders, align: "right" },
        { header: "Spend", value: (row) => formatMoneyExact(row.spend), align: "right" },
        { header: "OTD Rate", value: (row) => formatPct(row.otdRate), align: "right" },
      ],
      rows: history,
    });
    if (!opened) showToast("error", "Your browser blocked the report window — allow pop-ups to export PDF.");
  }

  return (
    <SlideOverPanel
      title="Account Scorecard"
      onClose={onClose}
      footer={
        <>
          {account.customerId && (
            <Link
              to={`/customers/${account.accountType}/${account.customerId}`}
              className="flex items-center justify-center gap-2 rounded-lg bg-sidebar px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <ExternalLink className="h-4 w-4" />
              View Full Profile
            </Link>
          )}
          <Button variant="secondary" onClick={exportScorecard}>
            <FileText className="h-4 w-4" />
            Export Scorecard (PDF)
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <AccountAvatar name={account.name} industry={account.industry} size="lg" />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-text">{account.name}</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-muted">{account.id}</span>
              <IndustryChip industry={account.industry} />
            </div>
          </div>
        </div>
        <div>
          <p className="text-label mb-2 text-text-muted">{rangeText}</p>
          <div className="grid grid-cols-2 gap-2">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-border p-3">
                <p className="text-xs text-text-muted">{kpi.label}</p>
                <p className={cn("font-mono text-base font-semibold tabular-nums text-text", kpi.tone)}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-text">Six-Month Spend &amp; OTD</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={history} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                <YAxis yAxisId="spend" tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} tickFormatter={formatMoneyCompact} />
                <YAxis yAxisId="otd" orientation="right" domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  formatter={(value, name) => (name === "Spend" ? formatMoneyExact(Number(value)) : formatPct(Number(value)))}
                  contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 12 }}
                />
                <Bar yAxisId="spend" dataKey="spend" name="Spend" fill="var(--color-chart-bar)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="otd" dataKey="otdRate" name="OTD Rate" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-primary)" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        {!account.customerId && (
          <p className="rounded-lg bg-bg p-3 text-xs text-text-muted">
            This reporting account isn't linked to a Customer Management record yet, so there's no profile to open.
          </p>
        )}
      </div>
    </SlideOverPanel>
  );
}
