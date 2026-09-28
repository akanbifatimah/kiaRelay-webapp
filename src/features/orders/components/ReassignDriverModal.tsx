import { Controller, useForm } from "react-hook-form";
import { UserRoundCog } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { useToast } from "../../../components/toast/ToastContext";
import { RosterDriverPicker } from "../../drivers/components/RosterDriverPicker";
import { drivers } from "../../drivers/driverRoster";
import { useCurrentUser } from "../../access/permissions";
import { REASSIGN_REASONS, reassignOrder } from "../ordersStore";
import type { Order } from "../data";

interface ReassignDriverModalProps {
  order: Order;
  onClose: () => void;
}

interface ReassignValues {
  driverId: string;
  reason: string;
  notes: string;
}

// Reassign Driver (TC-13, 2026-09-28): the order panel's button used to have
// no handler at all. Picks a roster driver, records why, and updates the
// order everywhere through ordersStore.
export function ReassignDriverModal({ order, onClose }: ReassignDriverModalProps) {
  const { showToast } = useToast();
  const user = useCurrentUser();
  const { control, handleSubmit } = useForm<ReassignValues>({ defaultValues: { driverId: "", reason: "driver-unavailable", notes: "" } });

  function onSubmit(values: ReassignValues) {
    const driver = drivers.find((d) => d.id === values.driverId);
    if (!driver) return;
    reassignOrder(order.id, driver, values.reason, user?.name ?? "Admin");
    showToast("success", `${order.id} reassigned to ${driver.name}.`);
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <UserRoundCog className="h-5 w-5 text-primary" />
          Reassign Driver · {order.id}
        </>
      }
      subtitle={`${order.pickup} → ${order.dropoff} · currently with ${order.driver}`}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Reassign Driver
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Controller
          name="driverId"
          control={control}
          rules={{ required: "Choose the driver who takes this ride." }}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <p className="text-label text-text-muted">New Driver</p>
              <RosterDriverPicker value={field.value} onChange={field.onChange} excludeId={order.driverId} excludeName={order.driver} />
              {fieldState.error && <p className="text-xs text-danger">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <FormField control={control} name="reason" label="Reason" type="select" options={REASSIGN_REASONS} />
        <FormField control={control} name="notes" label="Notes for the new driver (optional)" type="textarea" placeholder="e.g. Pick up from the original driver at Exit 24 truck stop" />
      </div>
    </Modal>
  );
}
