import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Hand, Hash } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { FormField } from "../../../../components/FormField";
import { HANDLING_FLAGS } from "../../deliveries/deliveryOptions";
import type { DeliveryDraft } from "../../deliveries/deliveryTypes";
import { updateDraft } from "../bookingDraft";
import { ChipsField } from "./ChipsField";
import { LoadFields } from "./LoadFields";
import { packageFromDraft, packageToDraft, type PackageForm } from "./packageForm";
import { PhotoUploadField } from "./PhotoUploadField";

/** Step 2, "Package Details" — PO / Project / BOL are shown (Business portal). */
export function PackageStep({ draft, onBack, onNext }: { draft: DeliveryDraft; onBack: () => void; onNext: () => void }) {
  const { control, handleSubmit } = useForm<PackageForm>({ mode: "onTouched", defaultValues: packageFromDraft(draft) });
  const onSubmit = handleSubmit((values) => {
    updateDraft(packageToDraft(values, true));
    onNext();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <LoadFields control={control} />
      <Card className="grid gap-4 sm:grid-cols-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-text sm:col-span-2">
          <Hash className="h-4 w-4" />
          Reference Numbers
        </h2>
        <FormField control={control} name="declaredValue" label="Declared Value ($)" type="number" placeholder="0.00" />
        <FormField control={control} name="po" label="PO # (Optional)" placeholder="Purchase Order Number" />
        <FormField control={control} name="project" label="Project # (Optional)" placeholder="Project Number" />
        <FormField control={control} name="bol" label="BOL # (Optional)" placeholder="Bill of Lading Number" />
      </Card>
      <Card className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-text">
          <Hand className="h-4 w-4" />
          Handling Requirements
        </h2>
        <p className="-mt-1 text-sm text-text-muted">Select all that apply for safe transport.</p>
        <ChipsField control={control} name="handling" options={HANDLING_FLAGS} checkbox />
      </Card>
      <Card className="grid gap-4 sm:grid-cols-2">
        <h2 className="text-base font-semibold text-text sm:col-span-2">Instructions</h2>
        <FormField control={control} name="pickupInstructions" label="Loading (Pickup) Instructions" type="textarea" placeholder="e.g. Check in at Guard Shack 2. Require dock leveler." />
        <FormField control={control} name="dropoffInstructions" label="Unloading (Drop-off) Instructions" type="textarea" placeholder="e.g. Call 30 mins prior to arrival. Liftgate required." />
      </Card>
      <Card>
        <PhotoUploadField control={control} name="photos" title="Photographs" />
      </Card>
      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          Continue to Delivery Options <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
