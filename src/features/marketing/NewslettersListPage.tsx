import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Pagination } from "../../components/Pagination";
import { newsletters } from "./newsletters";
import { filterNewsletters, type NewsletterTab } from "./filterNewsletters";
import { NewslettersFilterBar } from "./components/NewslettersFilterBar";
import { NewslettersTable } from "./components/NewslettersTable";

export function NewslettersListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<NewsletterTab>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = useMemo(() => filterNewsletters(newsletters, { search, tab }), [search, tab]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateFilter<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/marketing" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Marketing
      </Link>
      <PageHeader
        title="Newsletters"
        subtitle="Create and manage customer newsletters."
        actions={
          <Button onClick={() => navigate("/marketing/newsletters/new")}>
            <Plus className="h-4 w-4" />
            Create Newsletter
          </Button>
        }
      />
      <NewslettersFilterBar
        search={search}
        onSearchChange={updateFilter(setSearch)}
        tab={tab}
        onTabChange={updateFilter(setTab)}
      />
      <Card className="flex flex-col gap-4">
        <NewslettersTable rows={pageRows} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={pageSize}
          itemLabel="newsletters"
          onPageChange={setPage}
          onPageSizeChange={updateFilter(setPageSize)}
        />
      </Card>
    </div>
  );
}
