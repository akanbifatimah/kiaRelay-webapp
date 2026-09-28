import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { Avatar } from "../../../components/Avatar";
import { cn } from "../../../lib/cn";
import { drivers, type DriverRecord } from "../driverRoster";
import { DriverStatusBadge } from "./DriverStatusBadge";

interface RosterDriverPickerProps {
  value: string;
  onChange: (driverId: string) => void;
  /** The order's current driver (by id or display name), left out of the list. */
  excludeId?: string;
  excludeName?: string;
}

// Available drivers first: online or just finished a drop, then the rest.
const RANK: Record<DriverRecord["status"], number> = { online: 0, delivered: 1, "in-transit": 2, offline: 3, suspended: 9 };

// Searchable, radio-style driver list over the real roster (2026-09-28),
// shared by Reassign Driver (order panel) and anything else that hands a
// ride to a driver. Suspended drivers can't take rides, so they're hidden.
export function RosterDriverPicker({ value, onChange, excludeId, excludeName }: RosterDriverPickerProps) {
  const [search, setSearch] = useState("");
  const candidates = useMemo(() => {
    const term = search.trim().toLowerCase();
    return drivers
      .filter((d) => d.status !== "suspended" && d.id !== excludeId && d.name !== excludeName)
      .filter((d) => !term || `${d.name} ${d.id} ${d.vehicle} ${d.vehicleType}`.toLowerCase().includes(term))
      .sort((a, b) => RANK[a.status] - RANK[b.status] || b.onTimeRate - a.onTimeRate);
  }, [search, excludeId, excludeName]);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-text-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, ID or vehicle..."
          aria-label="Search drivers"
          className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </label>
      <div role="radiogroup" aria-label="Drivers" className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
        {candidates.length === 0 && <p className="py-4 text-center text-sm text-text-muted">No drivers match "{search}".</p>}
        {candidates.map((driver) => (
          <label
            key={driver.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border border-l-4 p-3 transition-colors",
              value === driver.id ? "border-border border-l-primary bg-primary/5" : "border-border border-l-border hover:bg-bg",
            )}
          >
            <input type="radio" name="roster-driver" checked={value === driver.id} onChange={() => onChange(driver.id)} className="h-4 w-4 accent-primary" />
            <Avatar name={driver.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{driver.name}</p>
              <p className="truncate text-xs text-text-muted">
                {driver.vehicle} · {driver.vehicleType}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-xs">
              <DriverStatusBadge status={driver.status} />
              <span className="inline-flex items-center gap-1 text-text-muted">
                <Star className="h-3 w-3 fill-warning text-warning" />
                {driver.rating.toFixed(1)} · {driver.onTimeRate}% on-time
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
