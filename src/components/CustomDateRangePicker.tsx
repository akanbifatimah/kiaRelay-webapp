import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

export interface CustomRange {
  from: string;
  to: string;
}

interface CustomDateRangePickerProps {
  initial: CustomRange;
  onApply: (range: CustomRange) => void;
  onCancel: () => void;
}

// Promoted from features/dashboard/components/ once a second feature
// (Finance's date range tabs) needed the same custom-range popover — same
// promotion precedent as CurrentPositionMarker/LatLng.
export function CustomDateRangePicker({ initial, onApply, onCancel }: CustomDateRangePickerProps) {
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onCancel();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  const isValid = from !== "" && to !== "" && from <= to;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-border bg-surface p-4 text-left shadow-lg"
    >
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-xs text-text-muted">
          From
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(event) => setFrom(event.target.value)}
            className="rounded-md border border-border px-2 py-1.5 text-sm text-text"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-text-muted">
          To
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(event) => setTo(event.target.value)}
            className="rounded-md border border-border px-2 py-1.5 text-sm text-text"
          />
        </label>
        {!isValid && <p className="text-xs text-danger">Pick a valid start and end date.</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={() => isValid && onApply({ from, to })} disabled={!isValid}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
