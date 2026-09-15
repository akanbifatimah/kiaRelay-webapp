import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { DriverRecord } from "../driverRoster";

interface AddDriverFormValues {
  name: string;
  vehicle: string;
  plate: string;
  vehicleType: string;
}

interface AddDriverModalProps {
  vehicleTypes: string[];
  onClose: () => void;
  onAdd: (driver: DriverRecord) => void;
}

// TODO: replace with real POST /drivers once the Driver Management API exists.
export function AddDriverModal({ vehicleTypes, onClose, onAdd }: AddDriverModalProps) {
  const { control, handleSubmit } = useForm<AddDriverFormValues>({
    defaultValues: { name: "", vehicle: "", plate: "", vehicleType: vehicleTypes[0] ?? "" },
  });

  function onSubmit(values: AddDriverFormValues) {
    const name = values.name.trim();
    if (!name) return;

    onAdd({
      id: `DR-0${Math.floor(9000 + Math.random() * 900)}`,
      name,
      vehicle: values.vehicle.trim() || "Unassigned",
      plate: values.plate.trim() || "—",
      vehicleType: values.vehicleType,
      status: "online",
      rating: 5.0,
      deliveries: 0,
      onTimeRate: 100,
      earnings: 0,
      earningsDeltaPct: 0,
    });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <UserPlus className="h-5 w-5 text-primary" />
          Add New Driver
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Add Driver
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="name" label="Full Name" rules={{ required: "This field is required" }} />
        <FormField control={control} name="vehicle" label="Vehicle" placeholder="e.g. Ford Transit (2022)" />
        <FormField control={control} name="plate" label="Plate Number" />
        <FormField
          control={control}
          name="vehicleType"
          label="Vehicle Type"
          type="select"
          options={vehicleTypes.map((type) => ({ value: type, label: type }))}
        />
      </div>
    </Modal>
  );
}
