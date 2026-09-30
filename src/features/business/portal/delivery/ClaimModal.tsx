import { useForm, useWatch } from "react-hook-form";
import { Button } from "../../../../components/Button";
import { FormField } from "../../../../components/FormField";
import { Modal } from "../../../../components/Modal";
import { CLAIM_REASONS } from "../../deliveries/deliveryOptions";
import { orderTotal } from "../../deliveries/invoices";
import { submitPortalClaim } from "../../deliveries/portalClaim";
import { formatMoney } from "../../deliveries/pricing";
import type { DeliveryOrder, DeliveryPhoto } from "../../deliveries/deliveryTypes";
import { PhotoUploadField } from "../booking/PhotoUploadField";

interface ClaimForm {
  reason: string;
  reasonOther: string;
  description: string;
  amount: string;
  photos: DeliveryPhoto[];
}

// Submit Claim / Report an Issue (2026-09-30, no design — first pass). It
// lands on the delivery and as an open claim in admin Claims Management.
export function ClaimModal({ order, companyName, onClose, onSubmitted }: { order: DeliveryOrder; companyName: string; onClose: () => void; onSubmitted: (claimId: string) => void }) {
  const { control, handleSubmit } = useForm<ClaimForm>({ mode: "onTouched", defaultValues: { reason: "", reasonOther: "", description: "", amount: "", photos: [] } });
  const reason = useWatch({ control, name: "reason" });
  const declared = order.references.declaredValue;

  const onSubmit = handleSubmit((values) => {
    const id = submitPortalClaim(
      order,
      {
        reason: values.reason,
        reasonOther: values.reason === "Other" ? values.reasonOther.trim() : "",
        description: values.description.trim(),
        amount: Number(values.amount) || 0,
        photos: values.photos,
      },
      companyName,
    );
    onSubmitted(id);
  });

  return (
    <Modal
      title="Submit Claim"
      subtitle={`Order ${order.id} · Paid ${formatMoney(orderTotal(order))}${declared ? ` · Declared ${formatMoney(declared)}` : ""}`}
      size="lg"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Submit Claim</Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField control={control} name="reason" label="Reason *" type="select" options={[{ value: "", label: "Select a reason" }, ...CLAIM_REASONS.map((r) => ({ value: r, label: r }))]} rules={{ required: "Choose a reason." }} />
        {reason === "Other" && <FormField control={control} name="reasonOther" label="Specify Reason *" placeholder="Tell us the issue" rules={{ required: "Tell us what went wrong." }} />}
        <FormField control={control} name="description" label="Details *" type="textarea" placeholder="Describe the damage, missing items or delay" rules={{ required: "Describe the issue.", minLength: { value: 10, message: "Add a little more detail." } }} />
        <FormField
          control={control}
          name="amount"
          label="Claimed Amount ($) *"
          type="number"
          placeholder="0.00"
          rules={{ validate: (v) => (!Number(v) ? "Enter the amount you're claiming." : !declared || Number(v) <= declared || `Can't exceed the declared value (${formatMoney(declared)}).`) }}
        />
        <PhotoUploadField control={control} name="photos" title="Evidence Photos" />
      </form>
    </Modal>
  );
}
