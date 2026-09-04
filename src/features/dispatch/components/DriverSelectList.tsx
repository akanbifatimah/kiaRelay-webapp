import { Avatar } from "../../../components/Avatar";
import { cn } from "../../../lib/cn";
import type { DriverLocation } from "../data";

interface DriverSelectListProps {
  drivers: DriverLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DriverSelectList({ drivers, selectedId, onSelect }: DriverSelectListProps) {
  return (
    <div className="flex flex-col gap-2">
      {drivers.map((driver) => (
        <label
          key={driver.id}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border border-l-4 p-3 transition-colors",
            selectedId === driver.id
              ? "border-border border-l-primary bg-primary/5"
              : "border-border border-l-border hover:bg-bg",
          )}
        >
          <input
            type="radio"
            name="driver"
            checked={selectedId === driver.id}
            onChange={() => onSelect(driver.id)}
            className="h-4 w-4 accent-primary"
          />
          <Avatar name={driver.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text">{driver.name}</p>
            <p className="text-xs text-text-muted">{driver.vehicle}</p>
          </div>
          <div className="flex flex-col items-end text-xs">
            <span className="font-medium text-success">{driver.onTimeRate}% On-Time</span>
            <span className="text-text-muted">
              {driver.distanceMiles}mi · {driver.etaMinutes}min ETA
            </span>
          </div>
          {driver.recommended && (
            <span className="text-badge rounded-full bg-tag-express-bg px-2 py-0.5 text-tag-express-fg">
              Top
            </span>
          )}
        </label>
      ))}
    </div>
  );
}
