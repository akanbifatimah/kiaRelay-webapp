import { Controller, useWatch, type Control } from "react-hook-form";
import { Camera, MapPinned, PenLine } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { CreateClaimValues } from "../buildNewClaim";
import { EvidenceUploadZone } from "./EvidenceUploadZone";

type EvidenceField = "evidencePhoto" | "evidenceGps" | "evidenceSignature";

const ARTIFACTS: { name: EvidenceField; label: string; icon: typeof Camera; detail: (orderId: string) => string }[] = [
  { name: "evidencePhoto", label: "Drop-off Photo", icon: Camera, detail: (id) => `POD-${id.replace(/\D/g, "")}.jpg` },
  { name: "evidenceGps", label: "GPS Telemetry", icon: MapPinned, detail: (id) => `Track-Log-${id.replace(/\D/g, "")}` },
  { name: "evidenceSignature", label: "Digital Signature", icon: PenLine, detail: () => "E-Sign_Confirm" },
];

// Section 3. The three artifact tiles belong to the linked order, so they
// stay disabled until one is picked in section 1.
export function ClaimEvidenceFields({ control, onRejected }: { control: Control<CreateClaimValues>; onRejected: (message: string) => void }) {
  const orderId = useWatch({ control, name: "orderId" });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-muted">
        {orderId ? `Select artifacts from ${orderId}'s logistics record to attach as evidence for this claim.` : "Link an order above to attach its logistics artifacts."}
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {ARTIFACTS.map(({ name, label, icon: Icon, detail }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <label
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-3",
                  !orderId ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-bg",
                  field.value && orderId ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-text-muted" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-text">{label}</span>
                  <span className="block truncate text-xs text-text-muted">{orderId ? detail(orderId) : "—"}</span>
                </span>
                <input
                  type="checkbox"
                  checked={field.value && Boolean(orderId)}
                  disabled={!orderId}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
              </label>
            )}
          />
        ))}
      </div>
      <Controller
        name="attachments"
        control={control}
        render={({ field }) => <EvidenceUploadZone value={field.value} onChange={field.onChange} onRejected={onRejected} />}
      />
    </div>
  );
}
