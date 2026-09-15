import { cn } from "../../../lib/cn";

export type DriverManagementTab = "all" | "onboarding" | "performance" | "payouts";

const tabs: { key: DriverManagementTab; label: string }[] = [
  { key: "all", label: "All Drivers" },
  { key: "onboarding", label: "Onboarding Queue" },
  { key: "performance", label: "Performance" },
  { key: "payouts", label: "Payouts" },
];

interface DriverManagementTabsProps {
  active: DriverManagementTab;
  onChange: (tab: DriverManagementTab) => void;
}

// Plain underline tabs — distinct from the pill-style DateRangeTabs, matching
// the screenshot's text-tab treatment for this screen specifically.
export function DriverManagementTabs({ active, onChange }: DriverManagementTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "border-b-2 pb-3 text-sm font-medium transition-colors",
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
