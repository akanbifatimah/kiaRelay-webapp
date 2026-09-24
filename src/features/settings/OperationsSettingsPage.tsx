import { useWatch } from "react-hook-form";
import { AlertTriangle, CalendarClock, Camera, ClipboardCheck, NotebookPen, PenLine, Route, Zap } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { REGIONS } from "../reports/regions";
import { SettingsCard } from "./components/SettingsCard";
import { SettingsInput } from "./components/SettingsInput";
import { SettingsToggleRow } from "./components/SettingsToggleRow";
import { SettingsSaveBar } from "./components/SettingsSaveBar";
import { DELIVERY_STATUSES, GRACE_PERIODS } from "./settingsOptions";
import { saveOperationsSettings, useOperationsSettings, type OperationsSettings } from "./settingsStore";
import { useSettingsForm } from "./useSettingsForm";

const LABELS: Partial<Record<keyof OperationsSettings, string>> = {
  defaultDeliveryStatus: "Default delivery status", proofOfDelivery: "Proof of delivery", driverConfirmation: "Driver confirmation",
  recipientConfirmation: "Recipient confirmation", deliveryNotes: "Delivery notes", gracePeriodMinutes: "Grace period",
  multiStop: "Multi-drop", specialHandling: "Special handling", scheduledDispatch: "Scheduled dispatch", hotShot: "Hot-shot delivery",
};
const MANDATORY = { label: "Mandatory Field", tone: "danger" } as const;

// Operations Settings (2026-09-23 design). "Mandatory Field" requirements
// are locked on — the design marks them as compliance-mandatory, so letting
// them be switched off would contradict their own label.
// TODO: dispatch/order creation should read these once the Operations API exists.
export function OperationsSettingsPage() {
  const saved = useOperationsSettings();
  const { form, onSave, onCancel, isDirty } = useSettingsForm({ saved, save: saveOperationsSettings, pageName: "Operations Settings", labels: LABELS });
  const { control } = form;
  const grace = useWatch({ control, name: "gracePeriodMinutes" });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Operations Settings" subtitle="Configure core delivery and operational preferences." />

      <SettingsCard title="Delivery Defaults" subtitle="Standard parameters applied to newly created shipments." sectionNumber={1}>
        <SettingsInput control={control} name="defaultDeliveryStatus" label="Default Delivery Status" options={DELIVERY_STATUSES} helper="Initial state assigned to manifests synced via API or created manually via operator desk." />
      </SettingsCard>

      <SettingsCard title="Completion Requirements" subtitle="Mandatory driver and recipient actions required before a delivery status can be marked Completed." sectionNumber={2}>
        <div className="flex flex-col gap-3">
          <SettingsToggleRow control={control} name="proofOfDelivery" tone="dark" icon={Camera} tag={MANDATORY} locked title="Proof of Delivery (Photo)" description="Driver must capture a clear photo of delivered cargo at the unloading dock or recipient facility." />
          <SettingsToggleRow control={control} name="driverConfirmation" tone="dark" icon={ClipboardCheck} tag={{ label: "Handshake", tone: "neutral" }} title="Driver Confirmation" description="Driver must manually sign off on manifest handoff." />
          <SettingsToggleRow control={control} name="recipientConfirmation" tone="dark" icon={PenLine} tag={MANDATORY} locked title="Recipient Confirmation (Digital Signature or PIN)" description="Consignee or dock master must provide digital signature or 4-digit verification PIN." />
          <SettingsToggleRow control={control} name="deliveryNotes" tone="dark" icon={NotebookPen} tag={{ label: "Optional", tone: "neutral" }} title="Delivery Notes" description="Require driver to input staging notes or dock condition comments." />
        </div>
      </SettingsCard>

      <SettingsCard title="Waiting Time Configuration" subtitle="Grace period before detention and demurrage accounting begins at customer sites." sectionNumber={3}>
        <SettingsInput control={control} name="gracePeriodMinutes" label="On-Site Grace Period (Demurrage Trigger)" options={GRACE_PERIODS} />
        <div className="flex flex-col gap-2 rounded-lg bg-bg p-4">
          <p className="text-label text-text-muted">After grace period expiry</p>
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            <Zap className="h-3 w-3" />
            Waiting time logging applies automatically
          </span>
          <p className="text-xs text-text-muted">
            After {GRACE_PERIODS.find((option) => option.value === grace)?.label.split(" (")[0] ?? `${grace} minutes`} on site, telemetry uses driver geofence coordinates to
            timestamp arrival and start demurrage accrual.
          </p>
        </div>
      </SettingsCard>

      <SettingsCard title="Operational Capabilities" subtitle="Toggle platform-wide availability of specialized shipment configurations." sectionNumber={4}>
        <div className="grid gap-3 md:grid-cols-2">
          <SettingsToggleRow control={control} name="multiStop" tone="dark" icon={Route} title="Additional Stops / Multi-Drop" description="Allow senders to add up to 5 waypoints per delivery route." />
          <SettingsToggleRow control={control} name="specialHandling" tone="dark" icon={AlertTriangle} title="Special Handling (HazMat & Heavy Lift)" description="Enable HazMat Class 3/8 and forklift-required cargo bookings." />
          <SettingsToggleRow control={control} name="scheduledDispatch" tone="dark" icon={CalendarClock} title="Scheduled Future Dispatch" description="Allow booking deliveries up to 14 days in advance." />
          <SettingsToggleRow control={control} name="hotShot" tone="dark" icon={Zap} title="Express Hot-Shot Delivery" description="Allow instant on-demand driver assignment for high-urgency loads." />
        </div>
      </SettingsCard>

      <SettingsSaveBar isDirty={isDirty} dirtyMessage={`All modifications will propagate to live dispatcher consoles across ${REGIONS.length} zones.`} onCancel={onCancel} onSave={onSave} />
    </div>
  );
}
