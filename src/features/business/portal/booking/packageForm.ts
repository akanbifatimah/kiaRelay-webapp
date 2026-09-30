// Mirrors the customer app's src/components/booking/packageForm.ts (2026-09-30).
import type { DeliveryDraft, DeliveryPhoto, HandlingFlag, MeasurementType, VolumeUnit } from "../../deliveries/deliveryTypes";

/** Step 2 ("Package Details") form values; numbers are edited as text. */
export interface PackageForm {
  description: string;
  category: string;
  categoryOther: string;
  packaging: string;
  packagingOther: string;
  measurement: MeasurementType;
  lengthIn: string;
  widthIn: string;
  heightIn: string;
  volume: string;
  volumeUnit: VolumeUnit;
  weightLbs: string;
  quantity: number;
  declaredValue: string;
  po: string;
  project: string;
  bol: string;
  handling: HandlingFlag[];
  pickupInstructions: string;
  dropoffInstructions: string;
  photos: DeliveryPhoto[];
}

const text = (n: number) => (n ? String(n) : "");
const num = (value: string) => Number(value.replace(/[^0-9.]/g, "")) || 0;

export function packageFromDraft(draft: DeliveryDraft): PackageForm {
  const { load, references } = draft;
  return {
    ...load,
    lengthIn: text(load.lengthIn),
    widthIn: text(load.widthIn),
    heightIn: text(load.heightIn),
    volume: text(load.volume),
    weightLbs: text(load.weightLbs),
    declaredValue: text(references.declaredValue),
    po: references.po,
    project: references.project,
    bol: references.bol,
    handling: draft.handling,
    pickupInstructions: draft.pickupInstructions,
    dropoffInstructions: draft.dropoffInstructions,
    photos: draft.photos,
  };
}

/** Back to draft shape. Values for the hidden measurement / "Other" are cleared. */
export function packageToDraft(form: PackageForm, business: boolean): Pick<DeliveryDraft, "load" | "references" | "handling" | "pickupInstructions" | "dropoffInstructions" | "photos"> {
  const liquid = form.measurement === "Liquid";
  return {
    load: {
      description: form.description.trim(),
      category: form.category,
      categoryOther: form.category === "Other" ? form.categoryOther.trim() : "",
      packaging: form.packaging,
      packagingOther: form.packaging === "Other" ? form.packagingOther.trim() : "",
      measurement: form.measurement,
      lengthIn: liquid ? 0 : num(form.lengthIn),
      widthIn: liquid ? 0 : num(form.widthIn),
      heightIn: liquid ? 0 : num(form.heightIn),
      volume: liquid ? num(form.volume) : 0,
      volumeUnit: form.volumeUnit,
      weightLbs: num(form.weightLbs),
      quantity: Math.max(1, form.quantity),
    },
    references: {
      declaredValue: num(form.declaredValue),
      // PO / Project / BOL are Business-only (agreed split, 2026-09-30).
      po: business ? form.po.trim() : "",
      project: business ? form.project.trim() : "",
      bol: business ? form.bol.trim() : "",
    },
    handling: form.handling,
    pickupInstructions: form.pickupInstructions.trim(),
    dropoffInstructions: form.dropoffInstructions.trim(),
    photos: form.photos,
  };
}

export const positive = (label: string) => (value: unknown) => num(String(value ?? "")) > 0 || `Enter the ${label}.`;
