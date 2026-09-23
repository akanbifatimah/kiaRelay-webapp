import { cn } from "../../../lib/cn";
import { reassignReasonLabels, type ReassignReason } from "../types";

interface ReassignReasonGridProps {
  value: ReassignReason | "";
  onChange: (reason: ReassignReason) => void;
}

export function ReassignReasonGrid({ value, onChange }: ReassignReasonGridProps) {
  return (
    <div role="radiogroup" className="grid grid-cols-2 gap-2">
      {(Object.keys(reassignReasonLabels) as ReassignReason[]).map((reason) => {
        const selected = reason === value;
        return (
          <label
            key={reason}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
              selected ? "border-sidebar bg-bg font-medium text-text" : "border-border text-text-muted hover:bg-bg",
            )}
          >
            <input
              type="radio"
              name="reassign-reason"
              checked={selected}
              onChange={() => onChange(reason)}
              className="h-4 w-4 accent-sidebar"
            />
            {reassignReasonLabels[reason]}
          </label>
        );
      })}
    </div>
  );
}
