import { Controller, useWatch, type Control } from "react-hook-form";
import { cssVar } from "../../../lib/cssVar";
import type { MarketingSettings } from "../settingsStore";

type ColorField = "brandPrimary" | "brandAccent";

function ColorField({ control, name, label, themeToken }: { control: Control<MarketingSettings>; name: ColorField; label: string; themeToken: string }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <label className="flex flex-col gap-1.5">
          <span className="text-label text-text-muted">{label}</span>
          <span className="flex items-center gap-3 rounded-md bg-bg px-3 py-2">
            {/* Native color picker; "" means "follow the platform theme". */}
            <input type="color" value={value || cssVar(themeToken)} onChange={(event) => onChange(event.target.value)} className="h-7 w-10 cursor-pointer rounded border border-border bg-transparent" />
            <span className="font-mono text-sm text-text">{value ? value.toUpperCase() : "Platform default"}</span>
            {value && (
              <button type="button" onClick={() => onChange("")} className="ml-auto text-xs text-text-muted hover:text-text">
                Reset
              </button>
            )}
          </span>
        </label>
      )}
    />
  );
}

// Brand color pickers plus a live mini-preview of how the header, button
// and footer of a campaign email will look with the current (unsaved) values.
export function MarketingBrandPreview({ control }: { control: Control<MarketingSettings> }) {
  const [primary, accent, senderName, footerText] = useWatch({ control, name: ["brandPrimary", "brandAccent", "senderName", "footerText"] });
  const headerColor = primary || "var(--color-sidebar)";
  const buttonColor = accent || "var(--color-primary)";
  const [footerBody, afterLink] = footerText.split("{unsubscribe_link}");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <ColorField control={control} name="brandPrimary" label="Header Color" themeToken="--color-sidebar" />
        <ColorField control={control} name="brandAccent" label="Button / Accent Color" themeToken="--color-primary" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <p className="text-label bg-bg px-3 py-1.5 text-text-muted">Email preview</p>
        <div className="px-4 py-3 text-sm font-semibold text-white" style={{ background: headerColor }}>
          {senderName || "Sender name"}
        </div>
        <div className="flex flex-col gap-3 bg-surface px-4 py-4">
          <span className="h-2 w-3/4 rounded bg-border" />
          <span className="h-2 w-1/2 rounded bg-border" />
          <span className="w-fit rounded-md px-3 py-1.5 text-xs font-semibold text-white" style={{ background: buttonColor }}>
            Book a delivery
          </span>
        </div>
        <p className="whitespace-pre-line border-t border-border bg-bg px-4 py-3 text-[11px] text-text-muted">
          {footerBody}
          {afterLink !== undefined && (
            <>
              <span className="underline" style={{ color: buttonColor }}>
                Unsubscribe
              </span>
              {afterLink}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
