import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { TagChip } from "../../../components/TagChip";
import { DriverSelectList } from "./DriverSelectList";
import { useToast } from "../../../components/toast/ToastContext";
import { driverLocations, type QueuedOrder } from "../data";
import { cn } from "../../../lib/cn";

interface AssignOrderModalProps {
  order: QueuedOrder;
  onClose: () => void;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// TODO: replace with a real assignment call (POST /orders/:id/assign, or a
// broadcast-to-eligible-drivers call) once the dispatch/matching API exists.
export function AssignOrderModal({ order, onClose }: AssignOrderModalProps) {
  const { showToast } = useToast();
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(
    driverLocations.find((driver) => driver.recommended)?.id ?? null,
  );
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [notes, setNotes] = useState("");
  const [driverSearch, setDriverSearch] = useState("");

  const canAssign = isBroadcast || selectedDriverId !== null;
  const visibleDrivers = useMemo(() => {
    const term = driverSearch.trim().toLowerCase();
    if (!term) return driverLocations;
    return driverLocations.filter(
      (driver) => driver.name.toLowerCase().includes(term) || driver.vehicle.toLowerCase().includes(term),
    );
  }, [driverSearch]);

  function handleAssign() {
    const message = isBroadcast
      ? `Broadcast request sent for order ${order.id}.`
      : `Order ${order.id} assigned to ${driverLocations.find((d) => d.id === selectedDriverId)?.name ?? "driver"}.`;
    showToast("success", message);
    onClose();
  }

  return (
    <Modal
      title={`Assign Order ${order.id}`}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" disabled={!canAssign} onClick={handleAssign}>
            Assign Order
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-y-1 rounded-lg bg-bg p-3 text-sm">
          <div className="flex items-center gap-2">
            <TagChip type={order.type} label={`${capitalize(order.type)} Delivery`} />
            {order.fragile && (
              <span className="text-badge rounded-full bg-tag-freight-bg px-2 py-0.5 text-tag-freight-fg">
                Fragile
              </span>
            )}
          </div>
          <p className="text-right text-text">{order.packageDescription}</p>
          <p className="text-danger">Risk: {order.riskLevel}</p>
          <p className="text-right text-text-muted">
            {order.distanceMiles}mi &middot; {order.etaMinutes} min ETA
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-success" />
            <div>
              <p className="text-label text-text-muted">Pickup</p>
              <p className="text-text">{order.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="text-label text-text-muted">Dropoff</p>
              <p className="text-text">{order.dropoffAddress}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-label text-text-muted">Select Driver</h3>
            <span className="text-xs text-text-muted">{driverLocations.length} drivers available</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-text-muted" />
            <input
              type="search"
              value={driverSearch}
              onChange={(event) => setDriverSearch(event.target.value)}
              placeholder="Search by name or vehicle..."
              className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <label
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
              isBroadcast ? "border-2 border-dashed border-primary bg-primary/5" : "border-border hover:bg-bg",
            )}
          >
            <input
              type="radio"
              name="driver"
              checked={isBroadcast}
              onChange={() => {
                setIsBroadcast(true);
                setSelectedDriverId(null);
              }}
              className="h-4 w-4 accent-primary"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text">Broadcast Request</p>
                <span className="text-badge rounded-full bg-tag-express-bg px-2 py-0.5 text-tag-express-fg">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Notifies all eligible drivers in range. First to accept gets the order.
              </p>
            </div>
          </label>
          <DriverSelectList
            drivers={visibleDrivers}
            selectedId={isBroadcast ? null : selectedDriverId}
            onSelect={(id) => {
              setIsBroadcast(false);
              setSelectedDriverId(id);
            }}
          />
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">Assignment Notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            placeholder="Add instructions for driver..."
            className="rounded-md border border-border px-2 py-1.5 text-sm text-text"
          />
        </label>
      </div>
    </Modal>
  );
}
