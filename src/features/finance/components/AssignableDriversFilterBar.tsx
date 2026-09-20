import { Search } from "lucide-react";
import { payoutSchedules } from "../payoutSchedules";
import { assignableFleetOptions, assignableRegionOptions, type AssignableDriverFilters } from "../scheduleAssignableDrivers";

interface AssignableDriversFilterBarProps {
  filters: AssignableDriverFilters;
  onChange: (filters: AssignableDriverFilters) => void;
}

export function AssignableDriversFilterBar({ filters, onChange }: AssignableDriversFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:max-w-xs">
        <Search className="h-4 w-4 shrink-0 text-text-muted" />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Filter by driver…"
          className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <select
        value={filters.fleet}
        onChange={(event) => onChange({ ...filters, fleet: event.target.value })}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">All Fleets</option>
        {assignableFleetOptions.map((fleet) => (
          <option key={fleet} value={fleet}>
            {fleet}
          </option>
        ))}
      </select>
      <select
        value={filters.region}
        onChange={(event) => onChange({ ...filters, region: event.target.value })}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">All Regions</option>
        {assignableRegionOptions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <select
        value={filters.scheduleId}
        onChange={(event) => onChange({ ...filters, scheduleId: event.target.value })}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">Show All</option>
        {payoutSchedules.map((schedule) => (
          <option key={schedule.id} value={schedule.id}>
            {schedule.name}
          </option>
        ))}
      </select>
    </div>
  );
}
