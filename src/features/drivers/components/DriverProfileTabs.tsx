import { cn } from "../../../lib/cn";

export type DriverProfileTab = "overview" | "documents" | "performance" | "vehicle" | "payouts" | "activity";

const tabs: { key: DriverProfileTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "documents", label: "Documents" },
  { key: "performance", label: "Performance" },
  { key: "vehicle", label: "Vehicle Info" },
  { key: "payouts", label: "Payouts & Earnings" },
  { key: "activity", label: "Activity Log" },
];

interface DriverProfileTabsProps {
  active: DriverProfileTab;
  onChange: (tab: DriverProfileTab) => void;
}

// Same underline-tab visual language as DriverManagementTabs.
export function DriverProfileTabs({ active, onChange }: DriverProfileTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
            active === tab.key
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
