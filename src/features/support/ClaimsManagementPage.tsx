import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Download, Plus, Search } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { claimCategoryLabels, claimStatusLabels, type ClaimCategory, type ClaimInvestigation, type ClaimStatus } from "./claimInvestigation";
import { removeClaim, useClaims } from "./claims";
import { buildCategoryDistribution, buildClaimTiles, buildVolumeSeries, type ClaimTileStat } from "./claimStats";
import { EMPTY_CLAIM_FILTERS, exportClaimsToCsv, filterClaims, sortClaims, type ClaimFilters, type ClaimSortKey } from "./filterClaims";
import { ClaimStatTiles } from "./components/ClaimStatTiles";
import { ClaimVolumeChart } from "./components/ClaimVolumeChart";
import { ClaimCategoryDonut } from "./components/ClaimCategoryDonut";
import { ClaimsTable } from "./components/ClaimsTable";

const selectClasses = "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text";

export function ClaimsManagementPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const claims = useClaims();
  const [range, setRange] = useState(7);
  const [searchParams] = useSearchParams();
  // ?category= preselects the category filter — Reports' Claims Analytics
  // links each category row here (2026-09-23).
  const [filters, setFilters] = useState<ClaimFilters>(() => {
    const category = searchParams.get("category");
    return category && category in claimCategoryLabels ? { ...EMPTY_CLAIM_FILTERS, category: category as ClaimCategory } : EMPTY_CLAIM_FILTERS;
  });
  const [sortKey, setSortKey] = useState<ClaimSortKey>("created");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<ClaimInvestigation | null>(null);

  const tiles = useMemo(() => buildClaimTiles(claims), [claims]);
  const volume = useMemo(() => buildVolumeSeries(claims, range), [claims, range]);
  const slices = useMemo(() => buildCategoryDistribution(claims), [claims]);
  const rows = useMemo(() => sortClaims(filterClaims(claims, filters), sortKey, sortDirection), [claims, filters, sortKey, sortDirection]);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  function applyFilters(next: ClaimFilters) {
    setFilters(next);
    setPage(1);
  }

  // Tiles and donut slices double as quick filters for the table below.
  function handleTile(key: ClaimTileStat["key"]) {
    if (key === "month") applyFilters({ ...filters, status: "all", withinDays: filters.withinDays ? undefined : new Date().getDate() });
    else applyFilters({ ...filters, withinDays: undefined, status: filters.status === key ? "all" : key });
  }
  const activeTile = filters.withinDays ? "month" : filters.status === "all" ? undefined : filters.status;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Claims Management"
        subtitle="Track and resolve customer shipment disputes."
        actions={
          <Button onClick={() => navigate("/support/claims/new")}>
            <Plus className="h-4 w-4" />
            New Claim
          </Button>
        }
      />
      <ClaimStatTiles tiles={tiles} activeKey={activeTile} onSelect={handleTile} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ClaimVolumeChart data={volume} range={range} onRangeChange={setRange} />
        <ClaimCategoryDonut
          slices={slices}
          active={filters.category === "all" ? undefined : filters.category}
          onSelect={(category) => applyFilters({ ...filters, category: filters.category === category ? "all" : category })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-56 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            value={filters.search}
            onChange={(event) => applyFilters({ ...filters, search: event.target.value })}
            placeholder="Search by claim ID, customer, order or driver"
            className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <select aria-label="Status" value={filters.status} onChange={(event) => applyFilters({ ...filters, status: event.target.value as ClaimStatus | "all" })} className={selectClasses}>
          <option value="all">Status: All</option>
          {Object.entries(claimStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select aria-label="Category" value={filters.category} onChange={(event) => applyFilters({ ...filters, category: event.target.value as ClaimCategory | "all" })} className={selectClasses}>
          <option value="all">Category: All</option>
          {Object.entries(claimCategoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <Button
          variant="secondary"
          onClick={() => {
            if (rows.length === 0) return showToast("error", "No claims match the current filters — nothing to export.");
            exportClaimsToCsv(rows);
            showToast("success", `Exported ${rows.length} claim${rows.length === 1 ? "" : "s"} to CSV.`);
          }}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      <Card className="flex flex-col gap-4">
        <ClaimsTable
          rows={rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          sort={{ key: sortKey, direction: sortDirection }}
          onSortChange={(key) => {
            setSortDirection((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
            setSortKey(key as ClaimSortKey);
            setPage(1);
          }}
          onDeleteDraft={setDeleting}
        />
        <Pagination page={currentPage} pageCount={pageCount} total={rows.length} pageSize={pageSize} itemLabel="claims" onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </Card>
      {deleting && (
        <ConfirmModal
          title="Delete this draft?"
          message={`Draft ${deleting.id} and anything entered on it will be permanently removed.`}
          confirmLabel="Delete Draft"
          tone="danger"
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            removeClaim(deleting.id);
            setDeleting(null);
            showToast("success", `Draft ${deleting.id} deleted.`);
          }}
        />
      )}
    </div>
  );
}
