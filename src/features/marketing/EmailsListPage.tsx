import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { marketingEmails } from "./emails";
import type { MarketingEmailStatus } from "./data";
import { filterEmails, type RecipientFilter } from "./filterEmails";
import { sortEmails, type EmailSortKey, type SortDirection } from "./sortEmails";
import { exportEmailsToCsv } from "./exportEmailsToCsv";
import { MarketingFilterBar } from "./components/MarketingFilterBar";
import { EmailsTable } from "./components/EmailsTable";

export function EmailsListPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MarketingEmailStatus | "all">("all");
  const [recipient, setRecipient] = useState<RecipientFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<EmailSortKey>("sentAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filtered = useMemo(
    () => filterEmails(marketingEmails, { search, status, recipient }),
    [search, status, recipient],
  );
  const sorted = useMemo(() => sortEmails(filtered, sortKey, sortDirection), [filtered, sortKey, sortDirection]);

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
    setSortKey(key as EmailSortKey);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/marketing" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Marketing
      </Link>
      <PageHeader
        title="Emails"
        subtitle="Create and manage email communications."
        actions={
          <Button onClick={() => navigate("/marketing/emails/new")}>
            <Plus className="h-4 w-4" />
            Create Email
          </Button>
        }
      />
      <MarketingFilterBar
        search={search}
        onSearchChange={updateFilter(setSearch)}
        status={status}
        onStatusChange={updateFilter(setStatus)}
        recipient={recipient}
        onRecipientChange={updateFilter(setRecipient)}
        onExport={() => {
          if (sorted.length === 0) {
            showToast("error", "No emails match the current filters — nothing to export.");
            return;
          }
          exportEmailsToCsv(sorted);
          showToast("success", `Exported ${sorted.length} email${sorted.length === 1 ? "" : "s"} to CSV.`);
        }}
      />
      <Card className="flex flex-col gap-4">
        <EmailsTable rows={pageRows} sort={{ key: sortKey, direction: sortDirection }} onSortChange={handleSortChange} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={sorted.length}
          pageSize={pageSize}
          itemLabel="entries"
          onPageChange={setPage}
          onPageSizeChange={updateFilter(setPageSize)}
        />
      </Card>
    </div>
  );
}
