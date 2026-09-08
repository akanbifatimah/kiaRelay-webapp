import type { Control } from "react-hook-form";
import { UserRoundPlus, Route, Archive, Search } from "lucide-react";
import { FormField } from "../../../components/FormField";

export interface NewOrderFormValues {
  customerName: string;
  accountNumber: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupWindow: string;
  priorityType: string;
  cargoType: string;
  estimatedWeightKg: string;
  handlingInstructions: string;
}

const priorityOptions = [
  { value: "standard", label: "Standard (3-5 Days)" },
  { value: "express", label: "Express (1-2 Days)" },
  { value: "scheduled", label: "Scheduled" },
];

const cargoOptions = [
  { value: "general", label: "General Freight" },
  { value: "hazardous", label: "Hazardous Material" },
  { value: "temperature-controlled", label: "Temperature Controlled" },
  { value: "fragile", label: "Fragile" },
];

function SectionLegend({ icon: Icon, label }: { icon: typeof UserRoundPlus; label: string }) {
  return (
    <legend className="mb-1 flex items-center gap-1.5 text-sm font-medium text-text">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </legend>
  );
}

export function NewOrderFormFields({ control }: { control: Control<NewOrderFormValues> }) {
  return (
    <form className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <SectionLegend icon={UserRoundPlus} label="Customer Selection" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField
            control={control}
            name="customerName"
            label="Customer Name"
            placeholder="Start typing customer name..."
            icon={<Search className="h-4 w-4" />}
            rules={{ required: "Customer name is required" }}
          />
          {/* TODO: auto-populate from the selected customer once a real
              customer lookup exists — for now this just shows a mock value. */}
          <FormField control={control} name="accountNumber" label="Account Number" readOnly />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <SectionLegend icon={Route} label="Routing Details" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField
            control={control}
            name="pickupAddress"
            label="Pickup Address"
            type="textarea"
            placeholder="Enter full pickup location details..."
            rules={{ required: "Pickup address is required" }}
          />
          <FormField
            control={control}
            name="dropoffAddress"
            label="Drop-off Address"
            type="textarea"
            placeholder="Enter full destination details..."
            rules={{ required: "Drop-off address is required" }}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField control={control} name="pickupWindow" label="Pickup Window" type="datetime-local" />
          <FormField
            control={control}
            name="priorityType"
            label="Priority Type"
            type="select"
            options={priorityOptions}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <SectionLegend icon={Archive} label="Shipment Logistics" />
        <div className="grid grid-cols-1 gap-3 rounded-lg bg-bg p-3 sm:grid-cols-3">
          <FormField control={control} name="cargoType" label="Cargo Type" type="select" options={cargoOptions} />
          <FormField
            control={control}
            name="estimatedWeightKg"
            label="Estimated Weight (kg)"
            type="number"
            placeholder="1200"
          />
          <FormField
            control={control}
            name="handlingInstructions"
            label="Handling Instructions"
            placeholder="e.g. Fragile"
          />
        </div>
      </fieldset>
    </form>
  );
}
