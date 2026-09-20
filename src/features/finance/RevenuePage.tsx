import { useMemo, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { FinanceStatTile } from "./components/FinanceStatTile";
import { RevenueFilterBar } from "./components/RevenueFilterBar";
import { RevenueSnapshotChart } from "./components/RevenueSnapshotChart";
import { RevenueBySegmentCard } from "./components/RevenueBySegmentCard";
import { CommissionOutlookCard } from "./components/CommissionOutlookCard";
import { RevenueDetailsSection } from "./components/RevenueDetailsSection";
import { revenueStats, revenueSegments, commissionOutlook } from "./revenueDetail";
import { revenueDetailRows, exportRevenueDetailsToCsv } from "./revenueDetailRows";
import { financeByRange } from "./financeSnapshots";

export function RevenuePage() {
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [segment, setSegment] = useState("All Segments");
  const [deliveryType, setDeliveryType] = useState("All Types");
  const [region, setRegion] = useState("Global");
  const [vertical, setVertical] = useState("All Verticals");

  const grossRevenueTotal = revenueStats.find((s) => s.type === "revenue")?.value ?? 0;
  const netRevenueTotal = revenueStats.find((s) => s.type === "net")?.value ?? 0;
  // Memoized so RevenueDetailsSection can reset its own pagination by
  // reference-comparing this object, instead of a new object identity
  // (and therefore a false "changed") on every render.
  const detailFilters = useMemo(
    () => ({ dateRange, segment, deliveryType, region, vertical }),
    [dateRange, segment, deliveryType, region, vertical],
  );

  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Finance
      </Link>

      <PageHeader
        title="Revenue"
        subtitle="Analyze KiaRelay revenue across delivery periods, customer segments and delivery types."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              exportRevenueDetailsToCsv(revenueDetailRows);
              showToast("success", "Revenue details exported to CSV.");
            }}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {revenueStats.map((stat) => (
          <FinanceStatTile key={stat.type} {...stat} />
        ))}
      </div>

      <RevenueFilterBar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        segment={segment}
        onSegmentChange={setSegment}
        deliveryType={deliveryType}
        onDeliveryTypeChange={setDeliveryType}
        region={region}
        onRegionChange={setRegion}
        vertical={vertical}
        onVerticalChange={setVertical}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueSnapshotChart
            title="Revenue Trend"
            revenue={financeByRange.month.revenue}
            grossRevenueTotal={grossRevenueTotal}
            netRevenueTotal={netRevenueTotal}
            deltaAmount={financeByRange.month.revenueDeltaAmount}
            deltaPct={financeByRange.month.revenueDeltaPct}
          />
        </div>
        <div className="flex flex-col gap-4">
          <RevenueBySegmentCard segments={revenueSegments} />
          <CommissionOutlookCard outlook={commissionOutlook} />
        </div>
      </div>

      <RevenueDetailsSection filters={detailFilters} />
    </div>
  );
}
