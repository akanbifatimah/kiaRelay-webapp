import { useMemo, useState } from "react";
import { Controller, useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import { ChevronDown, ChevronUp, CirclePlus } from "lucide-react";
import { Card } from "../../../../components/Card";
import { ComboboxField } from "../../../../components/ComboboxField";
import { FormField } from "../../../../components/FormField";
import { US_STATES } from "../../../../constants/usStates";
import { useUsCities } from "../../../../hooks/useUsCities";
import { PROVISIONS } from "../../deliveries/deliveryOptions";
import type { StopAddress } from "../../deliveries/deliveryTypes";
import { isComplete, type LocationsForm } from "./locationsForm";
import { AddressSearch } from "./AddressSearch";
import { ChipsField } from "./ChipsField";

const STATE_NAMES = US_STATES.map((s) => s.name);

interface StopCardProps {
  control: Control<LocationsForm>;
  setValue: UseFormSetValue<LocationsForm>;
  stop: "pickup" | "dropoff";
  places: StopAddress[];
}

/** LOADING / UNLOADING LOCATION: search, optional details, provisions. */
export function StopCard({ control, setValue, stop, places }: StopCardProps) {
  const [details, setDetails] = useState(false);
  const loading = stop === "pickup";
  const label = loading ? "Loading Location" : "Unloading Location";
  const state = useWatch({ control, name: `${stop}.address.state` });
  const city = useWatch({ control, name: `${stop}.address.city` });
  const { rows, loading: citiesLoading } = useUsCities(state);
  const cities = useMemo(() => rows.map(([name]) => name), [rows]);
  const zips = useMemo(() => rows.find(([name]) => name === city)?.[1] ?? [], [rows, city]);

  return (
    <Card className="flex flex-col gap-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
        <span className="h-2 w-2 rounded-full bg-primary" />
        {label}
      </p>
      <Controller
        control={control}
        name={`${stop}.address`}
        rules={{ validate: (a) => isComplete(a as StopAddress) || `Pick the ${label.toLowerCase()}.` }}
        render={({ field, fieldState }) => (
          <AddressSearch label={label} value={field.value as StopAddress} places={places} error={fieldState.error?.message} onPick={(a) => setValue(`${stop}.address`, a, { shouldValidate: true, shouldDirty: true })} />
        )}
      />
      <div className="rounded-lg border border-border">
        <button type="button" aria-expanded={details} onClick={() => setDetails((d) => !d)} className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-text">
          <span className="flex items-center gap-2">
            <CirclePlus className="h-4 w-4" />
            Add Details
          </span>
          {details ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
        </button>
        {details && (
          <div className="grid gap-3 border-t border-border p-3 sm:grid-cols-2">
            <FormField control={control} name={`${stop}.address.name`} label="Facility / Company (optional)" placeholder="e.g. Regional Distribution Center" />
            <FormField control={control} name={`${stop}.address.street`} label="Street Address *" placeholder="e.g. 4521 Industrial Blvd" rules={{ required: "Street address is required." }} />
            <ComboboxField
              control={control}
              name={`${stop}.address.state`}
              label="State *"
              placeholder="Search state"
              options={STATE_NAMES}
              rules={{ required: "Choose a state." }}
              onPick={(value) => {
                if (value === state) return;
                setValue(`${stop}.address.city`, "");
                setValue(`${stop}.address.zip`, "");
              }}
            />
            <ComboboxField
              control={control}
              name={`${stop}.address.city`}
              label="City *"
              placeholder={state ? "Search city" : "Choose a state first"}
              options={cities}
              disabled={!state}
              loading={citiesLoading}
              rules={{ required: "Choose a city." }}
              onPick={(value) => {
                const cityZips = rows.find(([name]) => name === value)?.[1] ?? [];
                setValue(`${stop}.address.zip`, cityZips.length === 1 ? cityZips[0] : "");
              }}
            />
            <ComboboxField control={control} name={`${stop}.address.zip`} label="ZIP Code *" placeholder={city ? "Search ZIP" : "Choose a city first"} options={zips} disabled={!city} rules={{ required: "Choose a ZIP code." }} />
            <FormField control={control} name={`${stop}.contactPhone`} label="Contact Phone" placeholder="(555) 123-4567" rules={{ validate: (v) => !v || String(v).replace(/\D/g, "").length >= 10 || "Enter a full number, incl. area code." }} />
            <FormField control={control} name={`${stop}.contactFirstName`} label="Contact First Name" placeholder="First" />
            <FormField control={control} name={`${stop}.contactLastName`} label="Contact Last Name" placeholder="Last" />
            <div className="sm:col-span-2">
              <FormField control={control} name={`${stop}.notes`} label="Gate / Dock Notes" type="textarea" placeholder="e.g. Dock doors 42–48 only" />
            </div>
          </div>
        )}
      </div>
      <ChipsField control={control} name={`${stop}.provisions`} options={PROVISIONS} label={loading ? "Loading Provisions Available?" : "Unloading Provisions Needed?"} />
    </Card>
  );
}
