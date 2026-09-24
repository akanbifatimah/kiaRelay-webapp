import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip } from "../../../components/Tooltip";
import { cn } from "../../../lib/cn";
import type { CompanySettings } from "../settingsStore";

const EIN_PATTERN = /^\d{2}-\d{7}$/;

// EIN is sensitive, so it's masked (last 4 visible) until the eye toggle
// reveals it — and only editable while revealed.
export function TaxIdField({ control }: { control: Control<CompanySettings> }) {
  const [revealed, setRevealed] = useState(false);
  const label = revealed ? "Hide tax ID" : "Show tax ID";

  return (
    <Controller
      name="ein"
      control={control}
      rules={{ required: "EIN is required.", pattern: { value: EIN_PATTERN, message: "Use the format 12-3456789." } }}
      render={({ field, fieldState }) => (
        <label className="flex flex-col gap-1.5">
          <span className="text-label text-text-muted">Tax Identification Number (EIN)</span>
          <span className={cn("flex items-center gap-2 rounded-md bg-bg px-3 py-2.5 text-sm text-text", fieldState.error && "ring-1 ring-danger")}>
            {revealed ? (
              <input {...field} className="w-full min-w-0 bg-transparent font-mono focus:outline-none" />
            ) : (
              <span className="w-full font-mono tracking-wider">{`••-•••${String(field.value).slice(-4)}`}</span>
            )}
            <Tooltip label={label}>
              <button type="button" aria-label={label} onClick={() => setRevealed((prev) => !prev)} className="text-text-muted hover:text-text">
                {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </Tooltip>
          </span>
          {fieldState.error ? (
            <span className="text-xs text-danger">{fieldState.error.message}</span>
          ) : (
            <span className="text-[11px] text-text-muted">Confidential federal tax ID registered with the IRS.</span>
          )}
        </label>
      )}
    />
  );
}
