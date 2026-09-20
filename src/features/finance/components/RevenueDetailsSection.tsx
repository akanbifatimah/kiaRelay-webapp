import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { RevenueDetailsTable } from "./RevenueDetailsTable";
import { revenueDetailRows, filterRevenueDetailRows, type RevenueDetailFilters } from "../revenueDetailRows";

const PAGE_SIZE = 10;

export function RevenueDetailsSection({ filters }: { filters: RevenueDetailFilters }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  // Reset to page 1 whenever the (memoized, in RevenuePage) filters object
  // changes — adjusted during render rather than a useEffect, per React's
  // own guidance for "reset state when a prop changes" (avoids the extra
  // commit an effect would cost here).
  const [prevFilters, setPrevFilters] = useState(filters);
  if (filters !== prevFilters) {
    setPrevFilters(filters);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const dimensionFiltered = filterRevenueDetailRows(revenueDetailRows, filters);
    const term = search.trim().toLowerCase();
    if (!term) return dimensionFiltered;
    return dimensionFiltered.filter((row) => row.period.toLowerCase().includes(term));
  }, [filters, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-text">Revenue Details</h2>
          <p className="text-xs text-text-muted">Transaction-level breakdowns for the current selection.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search rows…"
            className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>
      <RevenueDetailsTable rows={pageRows} />
      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        pageSize={pageSize}
        itemLabel="days in selection"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </Card>
  );
}
