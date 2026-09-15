import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, UserPlus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { DriverManagementTabs, type DriverManagementTab } from "./components/DriverManagementTabs";
import { DriverStatsRow } from "./components/DriverStatsRow";
import { AllDriversSection } from "./components/AllDriversSection";
import { OnboardingQueueSection } from "./components/OnboardingQueueSection";
import { PerformanceSection } from "./components/PerformanceSection";
import { PayoutsSection } from "./components/PayoutsSection";
import { AddDriverModal } from "./components/AddDriverModal";
import { exportDriversToCsv } from "./filterDrivers";
import { drivers as initialDrivers, vehicleTypes, type DriverRecord } from "./driverRoster";

const validTabs: DriverManagementTab[] = ["all", "onboarding", "performance", "payouts"];

export function DriverManagementPage() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [tab, setTab] = useState<DriverManagementTab>(
    validTabs.includes(initialTab as DriverManagementTab) ? (initialTab as DriverManagementTab) : "all",
  );
  const [drivers, setDrivers] = useState<DriverRecord[]>(initialDrivers);
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Driver Management"
        subtitle="Monitor the fleet, review onboarding, and manage driver performance."
        actions={
          <>
            {/* Exports the full roster, not just AllDriversSection's current filtered
                page — its filter/sort state is local to that tab, and this action sits
                in the shared page header above the tabs. */}
            <Button
              variant="secondary"
              onClick={() => {
                exportDriversToCsv(drivers);
                showToast("success", `Exported ${drivers.length} driver${drivers.length === 1 ? "" : "s"} to CSV.`);
              }}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setIsAddOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Add New Driver
            </Button>
          </>
        }
      />

      <DriverManagementTabs active={tab} onChange={setTab} />

      {/* Performance and Payouts each show their own distinct stats row
          instead of the fleet-wide one (per their screenshots). */}
      {(tab === "all" || tab === "onboarding") && <DriverStatsRow />}

      {tab === "all" && <AllDriversSection drivers={drivers} />}
      {tab === "onboarding" && <OnboardingQueueSection />}
      {tab === "performance" && <PerformanceSection />}
      {tab === "payouts" && <PayoutsSection />}

      {isAddOpen && (
        <AddDriverModal
          vehicleTypes={vehicleTypes}
          onClose={() => setIsAddOpen(false)}
          onAdd={(driver) => {
            setDrivers((prev) => [driver, ...prev]);
            showToast("success", `${driver.name} was added.`);
          }}
        />
      )}
    </div>
  );
}
