import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Pagination } from "../../components/Pagination";
import { CustomerStatsRow } from "./components/CustomerStatsRow";
import { CustomersFilterBar } from "./components/CustomersFilterBar";
import { CustomersTable } from "./components/CustomersTable";
import { useToast } from "../../components/toast/ToastContext";
import { AddCustomerModal } from "./components/AddCustomerModal";
import { CustomerStatusDialogs, type StatusChange } from "./components/CustomerStatusDialogs";
import { exportCustomersToCsv } from "./exportCustomers";
import { sortCustomers, type CustomerSortKey, type SortDirection } from "./sortCustomers";
import { CustomerVerificationReview } from "./components/CustomerVerificationReview";
import { recordBusinessVerification, withRegisteredBusinesses } from "../business/businessCustomers";
import { customers as initialCustomers, type Customer, type CustomerAccountType, type CustomerStatus, type VerificationStatus } from "./data";

interface CustomersListPageProps {
  accountType: CustomerAccountType;
  title: string;
  subtitle: string;
}

export function CustomersListPage({ accountType, title, subtitle }: CustomersListPageProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [verification, setVerification] = useState<VerificationStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<CustomerSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  // Web-registered KiaRelay Business accounts join the list as pending (TC-15).
  const [customers, setCustomers] = useState<Customer[]>(() => withRegisteredBusinesses(initialCustomers));
  const [reviewing, setReviewing] = useState<Customer | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [statusChange, setStatusChange] = useState<StatusChange | null>(null);

  const filtered = useMemo(
    () =>
      customers.filter(
        (customer) =>
          customer.accountType === accountType &&
          (status === "all" || customer.status === status) &&
          (verification === "all" || customer.verification === verification),
      ),
    [customers, accountType, status, verification],
  );

  function patchCustomer(id: string, changes: Partial<Customer>) {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));
  }

  const sorted = useMemo(() => sortCustomers(filtered, sortKey, sortDirection), [filtered, sortKey, sortDirection]);

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
    setSortKey(key as CustomerSortKey);
    setPage(1);
  }

  function handleRowClick(customer: Customer) {
    navigate(`/customers/${customer.accountType}/${customer.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add Customer
          </Button>
        }
      />
      <CustomerStatsRow accountType={accountType} />
      <CustomersFilterBar
        status={status}
        onStatusChange={updateFilter(setStatus)}
        verification={verification}
        onVerificationChange={updateFilter(setVerification)}
        onExport={() => {
          if (sorted.length === 0) {
            showToast("error", "No customers match the current filters — nothing to export.");
            return;
          }
          exportCustomersToCsv(sorted);
          showToast("success", `Exported ${sorted.length} customer${sorted.length === 1 ? "" : "s"} to CSV.`);
        }}
      />
      <Card className="flex flex-col gap-4">
        <CustomersTable
          rows={pageRows}
          onRowClick={handleRowClick}
          actions={{
            onNavigate: navigate,
            onReviewVerification: setReviewing,
            onSuspend: (customer) => setStatusChange({ customer, action: "suspend" }),
            onReactivate: (customer) => setStatusChange({ customer, action: "reactivate" }),
          }}
          sort={{ key: sortKey, direction: sortDirection }}
          onSortChange={handleSortChange}
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={sorted.length}
          pageSize={pageSize}
          itemLabel="customers"
          onPageChange={setPage}
          onPageSizeChange={updateFilter(setPageSize)}
        />
      </Card>

      <CustomerVerificationReview customer={reviewing} onClose={() => setReviewing(null)} onResult={(customer, next) => { patchCustomer(customer.id, { verification: next }); recordBusinessVerification(customer.id, next); }} />
      <CustomerStatusDialogs change={statusChange} onClose={() => setStatusChange(null)} onStatusChange={(customer, next) => patchCustomer(customer.id, { status: next })} />

      {isAddOpen && (
        <AddCustomerModal
          accountType={accountType}
          onClose={() => setIsAddOpen(false)}
          onAdd={(customer) => {
            setCustomers((prev) => [customer, ...prev]);
            showToast("success", `${customer.name} was added.`);
          }}
        />
      )}
    </div>
  );
}
