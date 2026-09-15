import { Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { DriverVehicleAssignment } from "../driverDetails";

interface AssignVehicleModalProps {
  driverName: string;
  vehicle: DriverVehicleAssignment;
  onClose: () => void;
  onAssign: (vehicle: DriverVehicleAssignment) => void;
}

// Edits exactly what AssignedVehicleCard displays — same "edit exactly what
// the card shows" precedent as EditDriverProfileModal/ContactInformationCard.
// TODO: replace with a real PATCH /drivers/:id/vehicle once the Driver
// Management API exists.
export function AssignVehicleModal({ driverName, vehicle, onClose, onAssign }: AssignVehicleModalProps) {
  const isUnassigned = vehicle.name === "Unassigned";
  const { control, handleSubmit } = useForm<DriverVehicleAssignment>({
    defaultValues: isUnassigned ? { name: "", vin: "", plate: "", payloadCapacity: "" } : vehicle,
  });

  function onSubmit(values: DriverVehicleAssignment) {
    onAssign(values);
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <Truck className="h-5 w-5 text-primary" />
          {isUnassigned ? "Assign Vehicle" : "Reassign Vehicle"}
        </>
      }
      subtitle={`${isUnassigned ? "Assign" : "Update"} the vehicle ${driverName} drives.`}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            {isUnassigned ? "Assign Vehicle" : "Save Changes"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="name"
          label="Vehicle Name / Model"
          placeholder="e.g. Freightliner M2"
          rules={{ required: "Vehicle name is required" }}
        />
        <FormField control={control} name="vin" label="VIN" placeholder="e.g. 1FUJGHDV8CLBP1234" />
        <FormField control={control} name="plate" label="Plate Number" placeholder="e.g. OH-9KR-FR6" />
        <FormField control={control} name="payloadCapacity" label="Payload Capacity" placeholder="e.g. 26,000 lb" />
      </div>
    </Modal>
  );
}
