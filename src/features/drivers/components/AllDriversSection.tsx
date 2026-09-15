import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { DriverFilterBar } from "./DriverFilterBar";
import { DriverRosterTable } from "./DriverRosterTable";
import { filterDrivers } from "../filterDrivers";
import { sortDrivers, type DriverSortKey, type SortDirection } from "../sortDrivers";
import { vehicleTypes, type DriverRecord, type DriverStatus } from "../driverRoster";

interface AllDriversSectionProps {
  drivers: DriverRecord[];
}

export function AllDriversSection({ drivers }: AllDriversSectionProps) {
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState("all");
  const [status, setStatus] = useState<DriverStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<DriverSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filtered = useMemo(
    () => filterDrivers(drivers, { vehicleType, status }),
    [drivers, vehicleType, status],
  );
  const sorted = useMemo(() => sortDrivers(filtered, sortKey, sortDirection), [filtered, sortKey, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateFilter<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function handleSortChange(key: string) {
    setSortDirection((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortKey(key as DriverSortKey);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      <DriverFilterBar
        vehicleType={vehicleType}
        onVehicleTypeChange={updateFilter(setVehicleType)}
        vehicleTypes={vehicleTypes}
        status={status}
        onStatusChange={updateFilter(setStatus)}
      />
      <Card className="flex flex-col gap-4">
        <DriverRosterTable
          rows={pageRows}
          onRowClick={(row) => navigate(`/drivers/${row.id}`)}
          sort={{ key: sortKey, direction: sortDirection }}
          onSortChange={handleSortChange}
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={sorted.length}
          pageSize={pageSize}
          itemLabel="drivers"
          onPageChange={setPage}
          onPageSizeChange={updateFilter(setPageSize)}
        />
      </Card>
    </div>
  );
}
