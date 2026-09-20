import { useMemo, useState } from "react";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { useToast } from "../../../components/toast/ToastContext";
import { DriverPayoutsFilterBar } from "./DriverPayoutsFilterBar";
import { PayoutRegisterTable } from "./PayoutRegisterTable";
import {
  payoutRegister,
  filterPayoutRegister,
  exportPayoutRegisterToCsv,
  type PayoutRegisterFilters,
} from "../driverPayoutsOverview";

const PAGE_SIZE = 10;
const DEFAULT_FILTERS: PayoutRegisterFilters = { search: "", status: "all", schedule: "all" };

export function PayoutRegisterSection() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<PayoutRegisterFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const filtered = useMemo(() => filterPayoutRegister(payoutRegister, filters), [filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-text">Payout Register</h3>
      <DriverPayoutsFilterBar
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        onExport={() => {
          if (filtered.length === 0) {
            showToast("error", "No payouts match the current filters — nothing to export.");
            return;
          }
          exportPayoutRegisterToCsv(filtered);
          showToast("success", `Exported ${filtered.length} payout${filtered.length === 1 ? "" : "s"} to CSV.`);
        }}
      />
      <PayoutRegisterTable rows={pageRows} />
      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        pageSize={pageSize}
        itemLabel="payouts"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </Card>
  );
}
