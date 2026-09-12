import { useState } from "react";
import { Avatar } from "../../../components/Avatar";
import { Button } from "../../../components/Button";
import { SuspendAccountModal } from "./SuspendAccountModal";
import type { CustomerDetail } from "../customerDetails";

type CustomerProfileHeaderProps = Pick<
  CustomerDetail,
  "name" | "status" | "accountType" | "joinedDate" | "recentOrders"
> & {
  onEditProfile: () => void;
};

export function CustomerProfileHeader({
  name,
  status,
  accountType,
  joinedDate,
  recentOrders,
  onEditProfile,
}: CustomerProfileHeaderProps) {
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar name={name} src="/profile_img.png" />
        <div>
          <p className="text-lg font-semibold text-text">{name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {status === "active" ? "Active Status" : "Suspended"}
            </span>
            <span className="text-badge rounded-full bg-tag-freight-bg px-2 py-0.5 text-tag-freight-fg">
              {accountType === "individual" ? "Individual Account" : "Company Account"}
            </span>
          </div>
          <p className="mt-1 text-xs text-text-muted">Joined {joinedDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={() => setIsSuspendOpen(true)}>
          Suspend Account
        </Button>
        <Button type="button" onClick={onEditProfile}>
          Edit Profile
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
