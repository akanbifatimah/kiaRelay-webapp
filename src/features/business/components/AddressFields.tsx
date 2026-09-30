import { useMemo } from "react";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import { ComboboxField } from "../../../components/ComboboxField";
import { FormField } from "../../../components/FormField";
import { US_STATES } from "../../../constants/usStates";
import { useUsCities } from "../../../hooks/useUsCities";
import type { CompanyDetails } from "../businessTypes";

const STATE_NAMES = US_STATES.map((s) => s.name);

interface AddressFieldsProps {
  control: Control<CompanyDetails>;
  setValue: UseFormSetValue<CompanyDetails>;
}

// Business Address (2026-09-30, user request): State → City → ZIP are picked
// from the US lookup with type-to-search, so there are no typos or
// mismatched city/ZIP pairs. Changing the state clears the city and ZIP;
// picking a city with a single ZIP fills it in.
// TODO: the backend should still validate against USPS/Google Places — the
// GeoNames data lists each ZIP's primary city only.
export function AddressFields({ control, setValue }: AddressFieldsProps) {
  const state = useWatch({ control, name: "state" });
  const city = useWatch({ control, name: "city" });
  const { rows, loading, error } = useUsCities(state);
  const cities = useMemo(() => rows.map(([name]) => name), [rows]);
  const zips = useMemo(() => rows.find(([name]) => name === city)?.[1] ?? [], [rows, city]);
  const clear = { shouldDirty: true, shouldValidate: false };

  return (
    <>
      <FormField control={control} name="street" label="Street Address *" placeholder="e.g. 800 Main St, Suite 400" rules={{ required: "Street address is required." }} />
      <div className="grid gap-4 sm:grid-cols-3">
        <ComboboxField
          control={control}
          name="state"
          label="State *"
          placeholder="Search state"
          options={STATE_NAMES}
          rules={{ required: "Choose a state." }}
          onPick={(value) => {
            if (value === state) return;
            setValue("city", "", clear);
            setValue("zip", "", clear);
          }}
        />
        <ComboboxField
          control={control}
          name="city"
          label="City *"
          placeholder={state ? "Search city" : "Choose a state first"}
          options={cities}
          disabled={!state || error}
          loading={loading}
          rules={{ required: "Choose a city." }}
          onPick={(value) => {
            const cityZips = rows.find(([name]) => name === value)?.[1] ?? [];
            setValue("zip", cityZips.length === 1 ? cityZips[0] : "", { shouldDirty: true, shouldValidate: cityZips.length === 1 });
          }}
        />
        <ComboboxField
          control={control}
          name="zip"
          label="ZIP Code *"
          placeholder={city ? "Search ZIP" : "Choose a city first"}
          options={zips}
          disabled={!city}
          rules={{ required: "Choose a ZIP code." }}
        />
      </div>
      {error && <p className="text-xs text-danger">Couldn't load cities for {state}. Check your connection and pick the state again.</p>}
    </>
  );
}
