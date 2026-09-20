import { Mail, Phone, Truck, Landmark, ShieldCheck } from "lucide-react";
import { Card } from "../../../components/Card";
import { Avatar } from "../../../components/Avatar";
import { PayoutTimelineStepper } from "./PayoutTimelineStepper";
import type { PayoutDetail } from "../payoutDetail";

export function PayoutDriverProfileCard({ detail }: { detail: PayoutDetail }) {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Avatar name={detail.payout.driverName} />
        <div>
          <p className="text-sm font-semibold text-text">{detail.payout.driverName}</p>
          <p className="text-xs text-text-muted">{detail.payout.driverId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Phone className="h-3.5 w-3.5" />
          {detail.driverPhone}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Mail className="h-3.5 w-3.5" />
          {detail.driverEmail}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Truck className="h-3.5 w-3.5" />
          {detail.vehicleType}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Landmark className="h-3.5 w-3.5" />
          {detail.destinationLabel}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-text-muted sm:col-span-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          {detail.taxStatusLabel}
        </p>
      </div>

      <div className="border-t border-border pt-5">
        <PayoutTimelineStepper steps={detail.steps} />
      </div>
    </Card>
  );
}
