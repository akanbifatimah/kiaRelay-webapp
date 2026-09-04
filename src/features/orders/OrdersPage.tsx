import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import type { OrderStatus } from "../../components/StatusBadge";
import { OrderFilterBar } from "./components/OrderFilterBar";
import { OrdersTable } from "./components/OrdersTable";
import { Pagination } from "./components/Pagination";
import { OrderDetailPanel } from "./components/OrderDetailPanel";
import { NewOrderModal } from "./components/NewOrderModal";
import { orders, type Order } from "./data";
import { filterOrders, exportOrdersToCsv, type DateFilter } from "./filterOrders";
import { useToast } from "../../components/toast/ToastContext";

const PAGE_SIZE = 10;

export function OrdersPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [industry, setIndustry] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const industries = useMemo(() => Array.from(new Set(orders.map((order) => order.industry))).sort(), []);

  const filtered = useMemo(
    () => filterOrders(orders, { search, status, industry, dateFilter }),
    [search, status, industry, dateFilter],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateFilter<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Order Monitoring"
        subtitle="Real-time list of active, completed, and pending orders."
        actions={
          <Button onClick={() => setIsNewOrderOpen(true)}>
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        }
      />
      <OrderFilterBar
        search={search}
        onSearchChange={updateFilter(setSearch)}
        status={status}
        onStatusChange={updateFilter(setStatus)}
        dateFilter={dateFilter}
        onDateFilterChange={updateFilter(setDateFilter)}
        industry={industry}
        onIndustryChange={updateFilter(setIndustry)}
        industries={industries}
        onExport={() => {
          if (filtered.length === 0) {
            showToast("error", "No orders match the current filters — nothing to export.");
            return;
          }
          exportOrdersToCsv(filtered);
          showToast("success", `Exported ${filtered.length} order${filtered.length === 1 ? "" : "s"} to CSV.`);
        }}
      />
      <Card className="flex flex-col gap-4">
        <OrdersTable rows={pageRows} onRowClick={setSelectedOrder} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>
      {selectedOrder && <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      {isNewOrderOpen && <NewOrderModal onClose={() => setIsNewOrderOpen(false)} />}
    </div>
  );
}
