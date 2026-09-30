import { Controller, useWatch, type Control } from "react-hook-form";
import { Minus, Package, Plus } from "lucide-react";
import { Card } from "../../../../components/Card";
import { FormField } from "../../../../components/FormField";
import { Tooltip } from "../../../../components/Tooltip";
import { cn } from "../../../../lib/cn";
import { CARGO_CATEGORIES, MEASUREMENT_TYPES, PACKAGING_TYPES } from "../../deliveries/deliveryOptions";
import { positive, type PackageForm } from "./packageForm";

const options = (list: readonly string[], placeholder: string) => [{ value: "", label: placeholder }, ...list.map((v) => ({ value: v, label: v }))];

function Title({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-text">
      <Package className="h-4 w-4" />
      {children}
    </h2>
  );
}

/** "Load Description" + "Load Dimensions" (Solid/Dry or Liquid variant). */
export function LoadFields({ control }: { control: Control<PackageForm> }) {
  const category = useWatch({ control, name: "category" });
  const packaging = useWatch({ control, name: "packaging" });
  const liquid = useWatch({ control, name: "measurement" }) === "Liquid";
  return (
    <>
      <Card className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Title>Load Description</Title></div>
        <div className="sm:col-span-2">
          <FormField control={control} name="description" label="Describe the Cargo *" type="textarea" placeholder="e.g. 8 drums of industrial solvent" rules={{ required: "Describe what we're moving." }} />
        </div>
        <FormField control={control} name="category" label="Category *" type="select" options={options(CARGO_CATEGORIES, "Select Category")} rules={{ required: "Choose a category." }} />
        <FormField control={control} name="packaging" label="Packaging Type *" type="select" options={options(PACKAGING_TYPES, "Select Packaging")} rules={{ required: "Choose a packaging type." }} />
        {category === "Other" && <FormField control={control} name="categoryOther" label="Specify Category *" placeholder="e.g. Artwork" rules={{ required: "Tell us the category." }} />}
        {packaging === "Other" && <FormField control={control} name="packagingOther" label="Specify Packaging *" placeholder="e.g. Spools" rules={{ required: "Tell us the packaging." }} />}
      </Card>
      <Card className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3"><Title>Load Dimensions</Title></div>
        <FormField control={control} name="measurement" label="Measurement Type" type="select" options={MEASUREMENT_TYPES.map((v) => ({ value: v, label: v }))} />
        {liquid ? (
          <div className="flex items-end gap-2 sm:col-span-2">
            <div className="flex-1">
              <FormField control={control} name="volume" label="Volume *" type="number" placeholder="0.00" rules={{ validate: positive("volume") }} />
            </div>
            <Controller
              control={control}
              name="volumeUnit"
              render={({ field: { value, onChange } }) => (
                <div role="radiogroup" aria-label="Volume unit" className="mb-px flex overflow-hidden rounded-md border border-border">
                  {(["gal", "L"] as const).map((unit) => (
                    <button key={unit} type="button" role="radio" aria-checked={value === unit} onClick={() => onChange(unit)} className={cn("px-3 py-2 text-sm font-semibold", value === unit ? "bg-primary text-primary-foreground" : "bg-surface text-text-muted")}>
                      {unit}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:col-span-2">
            <FormField control={control} name="lengthIn" label="Length (in) *" type="number" placeholder="L" rules={{ validate: positive("length") }} />
            <FormField control={control} name="widthIn" label="Width (in) *" type="number" placeholder="W" rules={{ validate: positive("width") }} />
            <FormField control={control} name="heightIn" label="Height (in) *" type="number" placeholder="H" rules={{ validate: positive("height") }} />
          </div>
        )}
        <FormField control={control} name="weightLbs" label="Weight per Unit (lbs) *" type="number" placeholder="0.0" rules={{ validate: positive("weight") }} />
        <Controller
          control={control}
          name="quantity"
          render={({ field: { value, onChange } }) => (
            <div className="flex flex-col gap-1 text-sm">
              <span className="text-text-muted">Quantity</span>
              <div className="flex w-fit items-center overflow-hidden rounded-md border border-border">
                <Tooltip label="Decrease quantity">
                  <button type="button" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))} className="px-3 py-2 text-text disabled:text-text-muted">
                    <Minus className="h-4 w-4" />
                  </button>
                </Tooltip>
                <input aria-label="Quantity" value={value} onChange={(e) => onChange(Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))} className="w-12 text-center font-semibold text-text focus:outline-none" />
                <Tooltip label="Increase quantity">
                  <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)} className="px-3 py-2 text-text">
                    <Plus className="h-4 w-4" />
                  </button>
                </Tooltip>
              </div>
            </div>
          )}
        />
      </Card>
    </>
  );
}
