import type { Control } from "react-hook-form";
import { FormField } from "../../../components/FormField";
import { REGIONS_BY_COUNTRY } from "../../settings/settingsOptions";
import { PHONE_RULE, type RegisterValues } from "../registerForm";

const INDUSTRIES = ["Oil & Gas", "Construction", "Healthcare & Pharma", "Manufacturing", "Retail & Wholesale", "Commercial Freight", "Other"];
const VOLUMES = [
  { value: "1-20", label: "1–20 deliveries / month" },
  { value: "20-100", label: "20–100 deliveries / month" },
  { value: "100-500", label: "100–500 deliveries / month" },
  { value: "500+", label: "500+ deliveries / month" },
];

/** Step 1: the legal entity (TC-15). */
export function RegisterCompanyStep({ control }: { control: Control<RegisterValues> }) {
  return (
    <div className="flex flex-col gap-4">
      <FormField control={control} name="companyName" label="Legal Company Name *" placeholder="e.g. Acme Refinery LLC" rules={{ required: "Company name is required." }} />
      <FormField
        control={control}
        name="registrationNumber"
        label="Business Registration Number / EIN *"
        placeholder="e.g. 74-2984912"
        rules={{ required: "Registration number is required.", minLength: { value: 5, message: "Enter the full registration number." } }}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField control={control} name="industry" label="Industry *" type="select" options={[{ value: "", label: "Select..." }, ...INDUSTRIES.map((v) => ({ value: v, label: v }))]} rules={{ required: "Choose an industry." }} />
        <FormField control={control} name="monthlyVolume" label="Expected Volume" type="select" options={VOLUMES} />
      </div>
    </div>
  );
}

/** Step 2: operating address and company phone. */
export function RegisterAddressStep({ control }: { control: Control<RegisterValues> }) {
  return (
    <div className="flex flex-col gap-4">
      <FormField control={control} name="address" label="Business Address *" placeholder="Street and suite" rules={{ required: "Address is required." }} />
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField control={control} name="city" label="City *" rules={{ required: "City is required." }} />
        <FormField control={control} name="state" label="State *" type="select" options={REGIONS_BY_COUNTRY["United States"]} />
        <FormField control={control} name="postalCode" label="ZIP *" rules={{ required: "ZIP is required.", pattern: { value: /^\d{5}(-\d{4})?$/, message: "5-digit ZIP." } }} />
      </div>
      <FormField control={control} name="companyPhone" label="Company Phone *" placeholder="+1 (713) 555-0100" rules={{ required: "Phone is required.", ...PHONE_RULE }} />
    </div>
  );
}
