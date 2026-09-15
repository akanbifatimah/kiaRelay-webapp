import { useState } from "react";
import { BarChart3, FileText, Wallet, Truck, History, MessageCircle } from "lucide-react";
import { Card } from "../../../components/Card";
import { useToast } from "../../../components/toast/ToastContext";
import { MessageDriverModal } from "./MessageDriverModal";
import type { DriverProfileTab } from "./DriverProfileTabs";

interface DriverQuickLinksCardProps {
  driverName: string;
  onSelectTab: (tab: DriverProfileTab) => void;
}

// Performance/Payouts/Vehicle Info/Activity Log all switch this page's own
// tabs — these are per-driver detail views, not the fleet-wide Driver
// Management tabs of the same name.
export function DriverQuickLinksCard({ driverName, onSelectTab }: DriverQuickLinksCardProps) {
  const { showToast } = useToast();
  const [isMessaging, setIsMessaging] = useState(false);

  const links: { label: string; icon: typeof BarChart3; tab: DriverProfileTab }[] = [
    { label: "Driver Performance", icon: BarChart3, tab: "performance" },
    { label: "Driver Documents", icon: FileText, tab: "documents" },
    { label: "Earnings and Payouts", icon: Wallet, tab: "payouts" },
    { label: "Vehicle Info", icon: Truck, tab: "vehicle" },
    { label: "Driver Activity Log", icon: History, tab: "activity" },
  ];

  return (
    <Card className="flex flex-col gap-1">
      <h3 className="mb-2 text-label text-text-muted">Quick Links</h3>
      {links.map(({ label, icon: Icon, tab }) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelectTab(tab)}
          className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-text hover:bg-bg"
        >
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setIsMessaging(true)}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-text hover:bg-bg"
      >
        <MessageCircle className="h-4 w-4 text-primary" />
        Message Driver
      </button>

      {isMessaging && (
        <MessageDriverModal
          driverName={driverName}
          onClose={() => setIsMessaging(false)}
          onSend={() => showToast("success", `Message sent to ${driverName}.`)}
        />
      )}
    </Card>
  );
}
