import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinned } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import { OTD_BAND_META, otdBand, REGIONS, STATE_LABELS, type Region, type RegionState } from "../regions";
import { RegionalPerformanceMap } from "./RegionalPerformanceMap";

// Clicking a region (circle, label or list row) opens the Driver Performance
// leaderboard filtered to that zone — the drivers behind the number.
export function RegionalPerformanceCard() {
  const navigate = useNavigate();
  const [state, setState] = useState<RegionState>("TX");
  const regions = useMemo(() => REGIONS.filter((region) => region.state === state), [state]);
  const openRegion = (region: Region) => navigate(`/reports/drivers?zone=${region.id}`);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
          <MapPinned className="h-4 w-4 text-primary" />
          Regional Performance
        </h2>
        <select
          aria-label="State"
          value={state}
          onChange={(event) => setState(event.target.value as RegionState)}
          className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-text"
        >
          {Object.entries(STATE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="h-72 overflow-hidden rounded-lg">
        <RegionalPerformanceMap regions={regions} onSelectRegion={openRegion} />
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-text-muted">
        {Object.values(OTD_BAND_META).map((band) => (
          <span key={band.label} className="flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-sm", band.swatch)} />
            {band.label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {regions.map((region) => {
          const band = OTD_BAND_META[otdBand(region.onTimeRate)];
          return (
            <button
              key={region.id}
              type="button"
              onClick={() => openRegion(region)}
              className="flex flex-col rounded-md border border-border px-2.5 py-1.5 text-left hover:bg-bg"
            >
              <span className="truncate text-xs text-text-muted">{region.name}</span>
              <span className={cn("font-mono text-sm font-semibold tabular-nums", band.text)}>{region.onTimeRate.toFixed(1)}%</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
