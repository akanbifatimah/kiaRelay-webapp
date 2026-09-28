import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Route, Search } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { StatusBadge } from "../../../components/StatusBadge";
import { useToast } from "../../../components/toast/ToastContext";
import { cn } from "../../../lib/cn";
import { useCurrentUser } from "../../access/permissions";
import { isReassignable, REASSIGN_REASONS, reassignOrder, useOrders } from "../../orders/ordersStore";

interface AssignRideModalProps {
  driver: { id: string; name: string; vehicle: string };
  onClose: () => void;
}

interface AssignRideValues {
  orderId: string;
  reason: string;
  notes: string;
}

// Assign Ride (TC-12, 2026-09-28) replaces "Assign Vehicle". When another
// driver has a problem, the admin hands their ride (or a waiting order) to
// this driver. It uses the same ordersStore transition as the order panel's
// Reassign Driver, so both places stay in sync.
export function AssignRideModal({ driver, onClose }: AssignRideModalProps) {
  const { showToast } = useToast();
  const user = useCurrentUser();
  const orders = useOrders();
  const [search, setSearch] = useState("");
  const { control, handleSubmit } = useForm<AssignRideValues>({ defaultValues: { orderId: "", reason: "driver-unavailable", notes: "" } });

  const rides = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders
      .filter((o) => isReassignable(o) && o.driverId !== driver.id && o.driver !== driver.name)
      .filter((o) => !term || `${o.id} ${o.customer} ${o.pickup} ${o.dropoff} ${o.driver}`.toLowerCase().includes(term))
      .sort((a, b) => (a.status === b.status ? 0 : a.status === "in-transit" ? -1 : 1));
  }, [orders, search, driver]);

  function onSubmit(values: AssignRideValues) {
    reassignOrder(values.orderId, driver, values.reason, user?.name ?? "Admin");
    showToast("success", `${values.orderId} assigned to ${driver.name}.`);
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <Route className="h-5 w-5 text-primary" />
          Assign Ride
        </>
      }
      subtitle={`Hand a ride to ${driver.name}, for example when another driver can't complete it.`}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Assign Ride
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order ID, customer, route or current driver..."
            aria-label="Search rides"
            className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
        </label>
        <Controller
          name="orderId"
          control={control}
          rules={{ required: "Choose the ride to assign." }}
          render={({ field, fieldState }) => (
            <div role="radiogroup" aria-label="Rides" className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
              {rides.length === 0 && <p className="py-4 text-center text-sm text-text-muted">No pending or in-transit rides match.</p>}
              {rides.map((ride) => (
                <label
                  key={ride.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border border-l-4 p-3 text-sm transition-colors",
                    field.value === ride.id ? "border-border border-l-primary bg-primary/5" : "border-border border-l-border hover:bg-bg",
                  )}
                >
                  <input type="radio" name="ride" checked={field.value === ride.id} onChange={() => field.onChange(ride.id)} className="mt-0.5 h-4 w-4 accent-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text">
                      {ride.id} · {ride.customer}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {ride.pickup} → {ride.dropoff}
                    </p>
                    <p className="text-xs text-text-muted">{ride.status === "in-transit" ? `Currently with ${ride.driver}` : "Waiting for a driver"}</p>
                  </div>
                  <StatusBadge status={ride.status} />
                </label>
              ))}
              {fieldState.error && <p className="text-xs text-danger">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <FormField control={control} name="reason" label="Reason" type="select" options={REASSIGN_REASONS} />
        <FormField control={control} name="notes" label="Notes for the driver (optional)" type="textarea" placeholder="Handover location, contact, special instructions..." />
      </div>
    </Modal>
  );
}
