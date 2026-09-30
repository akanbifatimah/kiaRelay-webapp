import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PackagePlus, Search } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { DataTable, type Column } from "../../../../components/DataTable";
import { ExportMenuButton } from "../../../../components/ExportMenuButton";
import { PageHeader } from "../../../../components/PageHeader";
import { Pagination } from "../../../../components/Pagination";
import { useTableState } from "../../../../hooks/useTableState";
import { cn } from "../../../../lib/cn";
import { cityState, formatDay, STAGE_LABELS } from "../../deliveries/display";
import { isFinished, stageOf } from "../../deliveries/deliverySim";
import { orderTotal } from "../../deliveries/invoices";
import { formatMoney } from "../../deliveries/pricing";
import type { DeliveryOrder } from "../../deliveries/deliveryTypes";
import { startDraft } from "../bookingDraft";
import { orderPath } from "../paths";
import { StagePill } from "../components/StagePill";
import { canBook, usePortalAccount } from "../usePortalAccount";
import { portalBranches, useNow, usePortalDeliveries } from "../usePortalData";

type SortKey = "id" | "placed" | "total";
const SORTERS: Record<SortKey, (o: DeliveryOrder) => string | number> = { id: (o) => Number(o.id.replace(/\D/g, "")), placed: (o) => Date.parse(o.createdAt), total: (o) => orderTotal(o) };

// Deliveries (2026-09-30, no web design — first pass): the app's Tracking
// tab as a table — Active / Past, search, branch filter, CSV/PDF export.
export function DeliveriesPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "past" ? "past" : "active";
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("all");
  const now = useNow(5000);
  const orders = usePortalDeliveries(account);

  const matches = orders.filter((o) => {
    if (isFinished(stageOf(o, now)) !== (tab === "past")) return false;
    if (branch !== "all" && o.branch !== branch) return false;
    const q = query.trim().toLowerCase();
    return !q || [o.id, o.pickup.address.name, o.pickup.address.city, o.dropoff.address.name, o.dropoff.address.city, o.references.po, o.references.bol].join(" ").toLowerCase().includes(q);
  });
  // Re-filter every tick, but only hand the table a new set when membership changes.
  const signature = matches.map((o) => o.id).join();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = useMemo(() => matches, [signature]);
  const table = useTableState({ rows, sorters: SORTERS, initialSort: { key: "placed", direction: "desc" } });
  if (!account) return null;

  const columns: Column<DeliveryOrder>[] = [
    { header: "Order", sortKey: "id", accessor: (o) => <span className="whitespace-nowrap font-semibold text-text">{o.id}</span> },
    { header: "Route", accessor: (o) => <span className="whitespace-nowrap">{cityState(o.pickup.address)} → {cityState(o.dropoff.address)}</span> },
    { header: "Load", accessor: (o) => <span className="line-clamp-1">{o.load.description}</span> },
    { header: "Branch", accessor: (o) => <span className="whitespace-nowrap">{o.branch}</span> },
    { header: "Placed", sortKey: "placed", accessor: (o) => <span className="whitespace-nowrap">{formatDay(o.createdAt)}</span> },
    { header: "Status", accessor: (o) => <StagePill stage={stageOf(o, now)} /> },
    { header: "Total", sortKey: "total", align: "right", accessor: (o) => <span className="font-semibold">{formatMoney(orderTotal(o))}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Deliveries"
        subtitle="Track live deliveries and your company's order history."
        actions={
          canBook(account) && (
            <Button onClick={() => { startDraft(); navigate("/business/book"); }} className="flex items-center gap-2">
              <PackagePlus className="h-4 w-4" /> Book a Delivery
            </Button>
          )
        }
      />
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div role="tablist" className="flex rounded-lg bg-bg p-1">
            {(["active", "past"] as const).map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setParams(t === "past" ? { tab: "past" } : {})} className={cn("rounded-md px-4 py-1.5 text-sm font-medium capitalize", tab === t ? "bg-surface text-text shadow-sm" : "text-text-muted")}>
                {t}
              </button>
            ))}
          </div>
          <label className="flex min-w-56 flex-1 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order, place, PO or BOL" aria-label="Search deliveries" className="w-full bg-transparent focus:outline-none" />
          </label>
          <select value={branch} onChange={(e) => setBranch(e.target.value)} aria-label="Filter by branch" className="rounded-md border border-border px-3 py-2 text-sm text-text">
            <option value="all">All branches</option>
            {portalBranches(account).map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ExportMenuButton
            label="Export deliveries"
            getExport={() => ({
              title: `${account.company.legalName} deliveries (${tab})`,
              subtitle: `${table.sorted.length} deliveries${branch === "all" ? "" : ` · ${branch}`}`,
              columns: [
                { header: "Order", value: (o: DeliveryOrder) => o.id },
                { header: "Pickup", value: (o: DeliveryOrder) => cityState(o.pickup.address) },
                { header: "Drop-off", value: (o: DeliveryOrder) => cityState(o.dropoff.address) },
                { header: "Branch", value: (o: DeliveryOrder) => o.branch },
                { header: "PO", value: (o: DeliveryOrder) => o.references.po },
                { header: "Placed", value: (o: DeliveryOrder) => formatDay(o.createdAt) },
                { header: "Status", value: (o: DeliveryOrder) => STAGE_LABELS[stageOf(o, now)] },
                { header: "Total", value: (o: DeliveryOrder) => formatMoney(orderTotal(o)), align: "right" },
              ],
              rows: table.sorted,
            })}
          />
        </div>
        <DataTable columns={columns} rows={table.pageRows} rowKey={(o) => o.id} onRowClick={(o) => navigate(orderPath(o))} sort={table.sort} onSortChange={table.onSortChange} />
        {table.sorted.length === 0 && <p className="py-6 text-center text-sm text-text-muted">{tab === "active" ? "Nothing is on the road right now." : "No past deliveries match."}</p>}
        <Pagination {...table.pagination} itemLabel="deliveries" />
      </Card>
    </div>
  );
}
