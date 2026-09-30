import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowLeft, ArrowRight, Timer } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { FormField } from "../../../../components/FormField";
import { cn } from "../../../../lib/cn";
import { DEMURRAGE, SCHEDULE_TIME_SLOTS, SPEED_OPTIONS } from "../../deliveries/deliveryOptions";
import { formatMoney, quoteDelivery } from "../../deliveries/pricing";
import type { DeliveryDraft, DeliverySpeed } from "../../deliveries/deliveryTypes";
import { OrderSummary } from "./OrderSummary";
import { PaymentPicker, type PaymentOption } from "./PaymentPicker";

export interface OptionsForm {
  speed: DeliverySpeed;
  /** Native date input value, "yyyy-mm-dd". */
  day: string;
  slot: string;
  branch: string;
  paymentId: string;
  extendedWait: boolean;
}

const SPEEDS = Object.keys(SPEED_OPTIONS) as DeliverySpeed[];
const tomorrow = () => new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

interface OptionsStepProps {
  draft: DeliveryDraft;
  branches: string[];
  payments: PaymentOption[];
  placing: boolean;
  onBack: () => void;
  onConfirm: (values: OptionsForm) => void;
}

/** Step 3, "Delivery Options": speed, price, branch, payment, demurrage. */
export function OptionsStep({ draft, branches, payments, placing, onBack, onConfirm }: OptionsStepProps) {
  const { control, handleSubmit } = useForm<OptionsForm>({
    defaultValues: { speed: draft.speed, day: "", slot: SCHEDULE_TIME_SLOTS[1], branch: draft.branch || branches[0], paymentId: payments[0]?.id ?? "", extendedWait: draft.extendedWait },
  });
  const speed = useWatch({ control, name: "speed" });
  const quote = useMemo(() => quoteDelivery({ ...draft, speed }), [draft, speed]);
  const surcharge = SPEED_OPTIONS[speed];

  return (
    <form onSubmit={handleSubmit(onConfirm)} className="flex flex-col gap-5">
      <Card className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-text">Choose delivery speed</h2>
          <p className="text-sm text-text-muted">Select when you want your package to arrive.</p>
        </div>
        <Controller
          control={control}
          name="speed"
          render={({ field: { value, onChange } }) => (
            <div role="radiogroup" aria-label="Delivery speed" className="grid grid-cols-3 gap-1 rounded-lg bg-bg p-1">
              {SPEEDS.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={value === s} onClick={() => onChange(s)} className={cn("rounded-md border py-2 text-sm font-medium", value === s ? "border-primary bg-primary/10 text-primary" : "border-transparent text-text-muted")}>
                  {SPEED_OPTIONS[s].label}
                </button>
              ))}
            </div>
          )}
        />
        {surcharge.surcharge > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-primary bg-primary/5 p-4">
            <div>
              <p className="font-semibold text-text">{surcharge.title}</p>
              <p className="text-xs text-text-muted">{surcharge.subtitle}</p>
            </div>
            <span className="text-lg font-bold text-primary">+{formatMoney(surcharge.surcharge)}</span>
          </div>
        )}
        {speed === "scheduled" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={control} name="day" label="Pickup Date *" type="date" rules={{ validate: (v) => (String(v) >= tomorrow() ? true : "Pick a date from tomorrow on.") }} />
            <FormField control={control} name="slot" label="Pickup Time *" type="select" options={SCHEDULE_TIME_SLOTS.map((s) => ({ value: s, label: s }))} />
          </div>
        )}
      </Card>
      <OrderSummary quote={quote} />
      <Card className="grid gap-4 sm:grid-cols-2">
        <FormField control={control} name="branch" label="Bill to Branch *" type="select" options={branches.map((b) => ({ value: b, label: b }))} />
        <div className="sm:col-span-2">
          <PaymentPicker control={control} options={payments} />
        </div>
      </Card>
      <Card className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-text">
          <Timer className="h-4 w-4" /> Demurrage Settings
        </h2>
        <div className="flex justify-between text-sm">
          <span className="text-text">Free wait time: {DEMURRAGE.freeMinutes} minutes</span>
          <span className="font-semibold text-primary">${DEMURRAGE.hourlyRate}/hour</span>
        </div>
        <Controller
          control={control}
          name="extendedWait"
          render={({ field: { value, onChange } }) => (
            <label className="flex items-center gap-2 text-sm text-text">
              <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-primary" />
              I may need extended wait time
            </label>
          )}
        />
        <p className="text-xs text-text-muted">Waiting beyond the free window is billed after delivery at the hourly rate.</p>
      </Card>
      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button type="submit" disabled={placing} className="flex items-center gap-2">
          {placing ? "Booking…" : "Confirm & Book"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
