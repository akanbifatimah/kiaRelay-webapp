import { useMemo, useState } from "react";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { useToast } from "../../../components/toast/ToastContext";
import { FinanceActivityFilterBar } from "./FinanceActivityFilterBar";
import { RecentFinancialActivityTable } from "./RecentFinancialActivityTable";
import { financeTransactions, filterFinanceTransactions, exportFinanceTransactionsToCsv } from "../financeTransactions";

const PAGE_SIZE = 10;

export function RecentFinancialActivitySection() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const filtered = useMemo(() => filterFinanceTransactions(financeTransactions, search), [search]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-text">Recent Financial Activity</h2>
      </div>
      <FinanceActivityFilterBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onExport={() => {
          if (filtered.length === 0) {
            showToast("error", "No transactions match the current filter — nothing to export.");
            return;
          }
          exportFinanceTransactionsToCsv(filtered);
          showToast("success", `Exported ${filtered.length} transaction${filtered.length === 1 ? "" : "s"} to CSV.`);
        }}
      />
      <RecentFinancialActivityTable rows={pageRows} />
      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        pageSize={pageSize}
        itemLabel="transactions"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </Card>
  );
}
