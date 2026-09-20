import { useMemo, useState } from "react";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { useToast } from "../../../components/toast/ToastContext";
import { AdjustmentsFilterBar } from "./AdjustmentsFilterBar";
import { AdjustmentsTable } from "./AdjustmentsTable";
import { adjustments, filterAdjustments, exportAdjustmentsToCsv, type AdjustmentFilters } from "../adjustments";

const PAGE_SIZE = 10;
const DEFAULT_FILTERS: AdjustmentFilters = { search: "", type: "all", status: "all" };

export function AdjustmentsSection() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<AdjustmentFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const filtered = useMemo(() => filterAdjustments(adjustments, filters), [filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="flex flex-col gap-4">
      <AdjustmentsFilterBar
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        onExport={() => {
          if (filtered.length === 0) {
            showToast("error", "No adjustments match the current filters — nothing to export.");
            return;
          }
          exportAdjustmentsToCsv(filtered);
          showToast("success", `Exported ${filtered.length} adjustment${filtered.length === 1 ? "" : "s"} to CSV.`);
        }}
      />
      <AdjustmentsTable rows={pageRows} />
      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        pageSize={pageSize}
        itemLabel="adjustments"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </Card>
  );
}
