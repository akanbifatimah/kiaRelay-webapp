import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Link2, ShieldAlert, TrendingUp, UserRound, UsersRound, type LucideIcon } from "lucide-react";
import { Card } from "../../components/Card";
import { cn } from "../../lib/cn";
import { ReportPageHeader, ReportStatusPill } from "./components/ReportPageHeader";
import { ReportStatCard } from "./components/ReportStatCard";
import { DeliveryVolumeByDayCard, HubRevenueTrendCard } from "./components/HubChartCards";
import { RegionalPerformanceCard } from "./components/RegionalPerformanceCard";
import { TopCustomersReportCard } from "./components/TopCustomersReportCard";
import { buildHubKpis } from "./reportsHub";
import { formatMoney, formatPct } from "./formatReport";

const QUICK_LINKS: { to: string; label: string; icon: LucideIcon; tone: string }[] = [
  { to: "/reports/drivers", label: "Driver Performance", icon: UserRound, tone: "bg-success/10 text-success" },
  { to: "/reports/customers", label: "Customer Performance", icon: UsersRound, tone: "bg-tag-overnight-bg text-tag-overnight-fg" },
  { to: "/reports/revenue", label: "Revenue Reports", icon: TrendingUp, tone: "bg-tag-express-bg text-tag-express-fg" },
  { to: "/reports/claims", label: "Claims Analytics", icon: ShieldAlert, tone: "bg-tag-danger-bg text-tag-danger-fg" },
];

export function ReportsDashboardPage() {
  const navigate = useNavigate();
  const kpis = useMemo(() => buildHubKpis(), []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
        <span>Reports</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-text">KPI Dashboards</span>
        <ReportStatusPill label="Live Syncing" />
      </div>
      <ReportPageHeader
        showBackLink={false}
        title="Reports and Analytics"
        subtitle="Design, arrange, and monitor executive logistics metrics and real-time operational telemetry."
      />

      <Card className="flex flex-col gap-3">
        <h2 className="text-label flex items-center gap-2 text-primary">
          <Link2 className="h-3.5 w-3.5" />
          Quick Links
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-text hover:bg-bg">
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-full", link.tone)}>
                <link.icon className="h-3.5 w-3.5" />
              </span>
              {link.label}
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStatCard label="Daily Revenue" hint="7-day average gross" value={formatMoney(kpis.dailyRevenue)} onClick={() => navigate("/reports/revenue")} />
        <ReportStatCard label="On-Time Rate" hint="Delivery-weighted, all regions" value={formatPct(kpis.onTimeRate)} onClick={() => navigate("/reports/drivers")} />
        <ReportStatCard label="Active Drivers" hint="Online, in transit or delivering" value={kpis.activeDrivers.toLocaleString()} onClick={() => navigate("/reports/drivers")} />
        <ReportStatCard label="Fleet Utilization" hint="Active drivers currently on a job" value={formatPct(kpis.fleetUtilization, 0)} onClick={() => navigate("/dispatch")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <HubRevenueTrendCard />
        <DeliveryVolumeByDayCard />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RegionalPerformanceCard />
        <TopCustomersReportCard />
      </div>
    </div>
  );
}
