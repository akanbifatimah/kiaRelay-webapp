import { useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { CustomerOrderStatsRow } from "./components/CustomerOrderStatsRow";
import { CustomerOrderFilterBar } from "./components/CustomerOrderFilterBar";
import { CustomerOrderHistoryTable } from "./components/CustomerOrderHistoryTable";
import { DisputeResolutionCard } from "./components/DisputeResolutionCard";
import { DeliveryLocationInsightCard } from "./components/DeliveryLocationInsightCard";
import { customers } from "./data";
import { getCustomerDetail } from "./customerDetails";
import { buildCustomerOrderHistory } from "./customerOrderHistory";
import { filterCustomerOrders, exportCustomerOrdersToCsv, type CustomerOrderFilters } from "./filterCustomerOrders";

const PAGE_SIZE = 5;

const DEFAULT_FILTERS: CustomerOrderFilters = {
  deliveryType: "all",
  status: "all",
  dateRange: "all",
  minAmount: "",
  maxAmount: "",
};

export function CustomerOrderHistoryPage() {
  const { accountType, id } = useParams<{ accountType: string; id: string }>();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CustomerOrderFilters>(DEFAULT_FILTERS);

  const customer = customers.find((c) => c.id === id);
  const detail = customer ? getCustomerDetail(customer) : null;
  const orders = useMemo(() => (detail ? buildCustomerOrderHistory(detail) : []), [detail]);
  const filtered = useMemo(() => filterCustomerOrders(orders, filters), [orders, filters]);

  if (!customer || !detail) {
    return <Navigate to={`/customers/${accountType ?? "individual"}`} replace />;
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const inProgress = orders.filter((o) => o.status === "in-transit").length;
  const expressUsed = orders.filter((o) => o.deliveryType === "express").length;

  function handleFiltersChange(next: CustomerOrderFilters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/customers/${detail.accountType}/${detail.id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Profile
      </Link>

      <PageHeader
        title={`Orders — ${detail.name}`}
        subtitle="Viewing complete transaction history and delivery status."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Create Order
          </Button>
        }
      />

      <CustomerOrderStatsRow
        totalOrders={orders.length}
        inProgress={inProgress}
        expressUsed={expressUsed}
        ltv={detail.totalSpent}
      />

      <CustomerOrderFilterBar
        filters={filters}
        onChange={handleFiltersChange}
        onExport={() => {
          if (filtered.length === 0) {
            showToast("error", "No orders match the current filters — nothing to export.");
            return;
          }
          exportCustomerOrdersToCsv(filtered, `${detail.name.replace(/\s+/g, "-").toLowerCase()}-orders.csv`);
          showToast("success", `Exported ${filtered.length} order${filtered.length === 1 ? "" : "s"} to CSV.`);
        }}
      />

      <Card className="flex flex-col gap-4">
        <CustomerOrderHistoryTable rows={pageRows} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          itemLabel="orders"
          onPageChange={setPage}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DisputeResolutionCard customerName={detail.name} />
        <DeliveryLocationInsightCard />
      </div>
    </div>
  );
}
