import { Gauge, Download } from "lucide-react";
import { downloadOperationalReport } from "../downloadOperationalReport";

interface OperationalInsightCardProps {
  driverName: string;
  percentileNote: string;
  milesDrivenMtd: number;
  milesDrivenMax: number;
  fuelEfficiencyMpg: number;
  fuelEfficiencyMax: number;
  onTimePct: number;
  rating: number;
  deliveriesCount: number;
}

// Plain styled div, not Card + a bg-sidebar override (see PerformanceHeroTile
// for why) — same dark-card template as InvoiceSummaryStats.
export function OperationalInsightCard({
  driverName,
  percentileNote,
  milesDrivenMtd,
  milesDrivenMax,
  fuelEfficiencyMpg,
  fuelEfficiencyMax,
  onTimePct,
  rating,
  deliveriesCount,
}: OperationalInsightCardProps) {
  const milesPct = milesDrivenMax === 0 ? 0 : Math.min(100, (milesDrivenMtd / milesDrivenMax) * 100);
  const fuelPct = fuelEfficiencyMax === 0 ? 0 : Math.min(100, (fuelEfficiencyMpg / fuelEfficiencyMax) * 100);

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-sidebar p-5 text-white shadow-sm">
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-white/70" />
        <h3 className="text-label text-white/70">Operational Insight</h3>
      </div>
      <p className="text-sm">{percentileNote}</p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Miles Driven (MTD)</span>
          <span className="font-medium text-white">{milesDrivenMtd.toLocaleString()} mi</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-primary" style={{ width: `${milesPct}%` }} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Fuel Efficiency</span>
          <span className="font-medium text-white">{fuelEfficiencyMpg} mpg</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-primary" style={{ width: `${fuelPct}%` }} />
        </div>
      </div>
      {/* Bordered button on a dark card — plain <button> per CLAUDE.md's own
          guidance, not Button + a conflicting className override. */}
      <button
        type="button"
        onClick={() =>
          downloadOperationalReport({
            driverName,
            percentileNote,
            milesDrivenMtd,
            fuelEfficiencyMpg,
            onTimePct,
            rating,
            deliveriesCount,
          })
        }
        className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
      >
        <Download className="h-4 w-4" />
        Download Full Report
      </button>
    </div>
  );
}
