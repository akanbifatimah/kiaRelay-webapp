import { Avatar } from "../../../components/Avatar";
import type { OrderDetail } from "../orderDetails";

type DriverRowProps = Pick<OrderDetail, "driverName" | "driverVehicle" | "driverRating">;

export function DriverRow({ driverName, driverVehicle, driverRating }: DriverRowProps) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <Avatar name={driverName} src="/profile_img.png" size="sm" />
        <div>
          <p className="text-sm font-medium text-text">{driverName}</p>
          <p className="text-xs text-text-muted">
            {driverVehicle} &middot; {driverRating.toFixed(1)}★
          </p>
        </div>
      </div>
      <button
        type="button"
        className="rounded-full bg-tag-freight-bg px-3 py-1.5 text-sm font-medium text-tag-freight-fg hover:opacity-90"
      >
        Track Live
      </button>
    </div>
  );
}
