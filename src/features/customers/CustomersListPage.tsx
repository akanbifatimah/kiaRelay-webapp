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
import { IdVerificationReviewModal } from "../../components/IdVerificationReviewModal";
import { exportCustomersToCsv } from "./exportCustomers";
import { sortCustomers, type CustomerSortKey, type SortDirection } from "./sortCustomers";
import { getCustomerVerificationCase } from "./identityVerification";
import { customers as initialCustomers, type Customer, type CustomerAccountType, type CustomerStatus, type VerificationStatus } from "./data";

const PAGE_SIZE = 10;

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
  const [sortKey, setSortKey] = useState<CustomerSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [reviewing, setReviewing] = useState<Customer | null>(null);

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

  function handleVerificationResult(customerId: string, result: "approved" | "rejected") {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? { ...customer, verification: result === "approved" ? "verified" : "failed" }
          : customer,
      ),
    );
  }

  const sorted = useMemo(() => sortCustomers(filtered, sortKey, sortDirection), [filtered, sortKey, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
          <Button>
            <UserPlus className="h-4 w-4" />
            Add Customer
          </Button>
        }
      />
      <CustomerStatsRow />
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
          onReviewVerification={setReviewing}
          sort={{ key: sortKey, direction: sortDirection }}
          onSortChange={handleSortChange}
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={sorted.length}
          pageSize={PAGE_SIZE}
          itemLabel="customers"
          onPageChange={setPage}
        />
      </Card>

      {reviewing && (
        <IdVerificationReviewModal
          caseData={getCustomerVerificationCase(reviewing)}
          onClose={() => setReviewing(null)}
          onApprove={() => handleVerificationResult(reviewing.id, "approved")}
          onReject={() => handleVerificationResult(reviewing.id, "rejected")}
        />
      )}
    </div>
  );
}
