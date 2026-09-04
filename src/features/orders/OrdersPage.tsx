import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import type { OrderStatus } from "../../components/StatusBadge";
import { OrderFilterBar } from "./components/OrderFilterBar";
import { OrdersTable } from "./components/OrdersTable";
import { Pagination } from "./components/Pagination";
import { orders } from "./data";
import { filterOrders, exportOrdersToCsv, type DateFilter } from "./filterOrders";

const PAGE_SIZE = 10;

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [industry, setIndustry] = useState("all");
  const [page, setPage] = useState(1);

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
          <Button>
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
        onExport={() => exportOrdersToCsv(filtered)}
      />
      <Card className="flex flex-col gap-4">
        <OrdersTable rows={pageRows} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
