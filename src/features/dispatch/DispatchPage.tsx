import { useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { DispatchMap } from "./components/DispatchMap";
import { MapStatsOverlay } from "./components/MapStatsOverlay";
import { OrderQueue } from "./components/OrderQueue";
import { AssignOrderModal } from "./components/AssignOrderModal";
import { driverLocations, queuedOrders, dispatchOverview, type QueuedOrder } from "./data";

export function DispatchPage() {
  const [assigningOrder, setAssigningOrder] = useState<QueuedOrder | null>(null);

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader title="Dispatch — Live Operations" subtitle="Live map, order queue, and driver assignment." />
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[var(--radius-card)] border border-border">
          <DispatchMap drivers={driverLocations} orders={queuedOrders} />
          <MapStatsOverlay {...dispatchOverview} />
        </div>
        <OrderQueue orders={queuedOrders} onAssign={setAssigningOrder} />
      </div>
      {assigningOrder && <AssignOrderModal order={assigningOrder} onClose={() => setAssigningOrder(null)} />}
    </div>
  );
}
