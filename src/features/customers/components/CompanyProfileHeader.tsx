import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Hash, Factory, MapPin } from "lucide-react";
import { Button } from "../../../components/Button";
import { SuspendAccountModal } from "./SuspendAccountModal";
import type { RecentOrder } from "../customerDetails";

interface CompanyProfileHeaderProps {
  name: string;
  registrationNumber?: string;
  industry?: string;
  location?: string;
  recentOrders: RecentOrder[];
}

export function CompanyProfileHeader({
  name,
  registrationNumber,
  industry,
  location,
  recentOrders,
}: CompanyProfileHeaderProps) {
  const navigate = useNavigate();
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-sidebar text-white">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-text">{name}</h1>
            <span className="text-badge rounded-full bg-tag-freight-bg px-2 py-0.5 text-tag-freight-fg">
              Corporate Account
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            {registrationNumber && (
              <span className="inline-flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" />
                {registrationNumber}
              </span>
            )}
            {industry && (
              <span className="inline-flex items-center gap-1">
                <Factory className="h-3.5 w-3.5" />
                {industry}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={() => setIsSuspendOpen(true)}>
          Suspend Account
        </Button>
        <Button type="button" onClick={() => navigate("/orders")}>
          Place Order
        </Button>
      </div>

      {isSuspendOpen && (
        <SuspendAccountModal
          customerName={name}
          orders={recentOrders}
          onClose={() => setIsSuspendOpen(false)}
          onSuspended={() => setIsSuspendOpen(false)}
        />
      )}
    </div>
  );
}
