import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useToast } from "../../components/toast/ToastContext";
import { DriverProfileHeader } from "./components/DriverProfileHeader";
import { DriverProfileTabs, type DriverProfileTab } from "./components/DriverProfileTabs";
import { ContactInformationCard } from "./components/ContactInformationCard";
import { AssignedVehicleCard } from "./components/AssignedVehicleCard";
import { LicenseExpiryBanner } from "./components/LicenseExpiryBanner";
import { DriverRecentOrdersCard } from "./components/DriverRecentOrdersCard";
import { DriverActivityLogCard } from "./components/DriverActivityLogCard";
import { DriverQuickLinksCard } from "./components/DriverQuickLinksCard";
import { EditDriverProfileModal } from "./components/EditDriverProfileModal";
import { AssignVehicleModal } from "./components/AssignVehicleModal";
import { DocumentsSection } from "./components/DocumentsSection";
import { PerformanceDetailSection } from "./components/PerformanceDetailSection";
import { VehicleInfoSection } from "./components/VehicleInfoSection";
import { DriverPayoutsSection } from "./components/DriverPayoutsSection";
import { FullActivityLogSection } from "./components/FullActivityLogSection";
import { getDriverDetail, type DriverDetail } from "./driverDetails";

export function DriverProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [tab, setTab] = useState<DriverProfileTab>("overview");
  const [detail, setDetail] = useState<DriverDetail | null>(() => (id ? getDriverDetail(id) : null));
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAssigningVehicleOpen, setIsAssigningVehicleOpen] = useState(false);

  if (!detail) return <Navigate to="/drivers" replace />;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/drivers" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Drivers
      </Link>

      <DriverProfileHeader detail={detail} onEdit={() => setIsEditProfileOpen(true)} />
      <DriverProfileTabs active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ContactInformationCard contact={detail.contact} onEdit={() => setIsEditProfileOpen(true)} />
              <AssignedVehicleCard vehicle={detail.vehicle} onAssign={() => setIsAssigningVehicleOpen(true)} />
            </div>
            <LicenseExpiryBanner license={detail.license} />
            <DriverRecentOrdersCard detail={detail} />
          </div>
          <div className="flex flex-col gap-4">
            <DriverActivityLogCard steps={detail.activityLog} onViewFull={() => setTab("activity")} />
            <DriverQuickLinksCard driverName={detail.name} onSelectTab={setTab} />
          </div>
        </div>
      )}
      {tab === "documents" && <DocumentsSection onViewHistory={() => setTab("activity")} />}
      {tab === "performance" && (
        <PerformanceDetailSection
          driverId={detail.id}
          driverName={detail.name}
          onViewFullActivity={() => setTab("activity")}
        />
      )}
      {tab === "vehicle" && <VehicleInfoSection driverId={detail.id} />}
      {tab === "payouts" && <DriverPayoutsSection driverId={detail.id} driverName={detail.name} />}
      {tab === "activity" && <FullActivityLogSection driverId={detail.id} />}

      {isEditProfileOpen && (
        <EditDriverProfileModal
          detail={detail}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updates) => {
            setDetail((prev) => (prev ? { ...prev, ...updates } : prev));
            showToast("success", "Profile updated.");
          }}
        />
      )}

      {isAssigningVehicleOpen && (
        <AssignVehicleModal
          driverName={detail.name}
          vehicle={detail.vehicle}
          onClose={() => setIsAssigningVehicleOpen(false)}
          onAssign={(vehicle) => {
            setDetail((prev) => (prev ? { ...prev, vehicle } : prev));
            showToast("success", `${vehicle.name} assigned to ${detail.name}.`);
          }}
        />
      )}
    </div>
  );
}
