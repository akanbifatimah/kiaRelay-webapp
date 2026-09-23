import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import {
  articleStatusLabels,
  removeArticle,
  updateArticle,
  useArticles,
  type ArticleCategory,
  type ArticleStatus,
  type KnowledgeArticle,
} from "./knowledgeBase";
import { FilterPopover } from "./components/FilterPopover";
import { KnowledgeBaseTable } from "./components/KnowledgeBaseTable";
import { CategoryPills } from "./components/CategoryPills";

type SortKey = "title" | "category" | "author" | "updated" | "status";
const selectClasses = "rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text";

function compare(a: KnowledgeArticle, b: KnowledgeArticle, key: SortKey): number {
  if (key === "updated") return a.updatedDaysAgo - b.updatedDaysAgo;
  return String(a[key]).localeCompare(String(b[key]));
}

export function KnowledgeBasePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const articles = useArticles();
  const [category, setCategory] = useState<ArticleCategory | "all">("all");
  const [status, setStatus] = useState<ArticleStatus | "all">("all");
  const [author, setAuthor] = useState("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<KnowledgeArticle | null>(null);

  const authors = useMemo(() => Array.from(new Set(articles.map((article) => article.author))).sort(), [articles]);
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = articles.filter(
      (a) =>
        (category === "all" || a.category === category) &&
        (status === "all" || a.status === status) &&
        (author === "all" || a.author === author) &&
        (!query || `${a.title} ${a.summary} ${a.tags.join(" ")}`.toLowerCase().includes(query)),
    );
    return [...filtered].sort((a, b) => compare(a, b, sortKey) * (direction === "asc" ? 1 : -1));
  }, [articles, category, status, author, search, sortKey, direction]);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  function togglePublish(article: KnowledgeArticle) {
    const publishing = article.status !== "published";
    updateArticle(article.id, { status: publishing ? "published" : "draft", updatedDaysAgo: 0 });
    showToast("success", publishing ? `"${article.title}" published.` : `"${article.title}" moved back to Draft.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Knowledge Base"
        subtitle="Manage and organize documentation for customers and support staff."
        actions={
          <Button variant="dark" onClick={() => navigate("/support/knowledge-base/new")}>
            <Plus className="h-4 w-4" />
            Create Article
          </Button>
        }
      />
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CategoryPills value={category} onChange={reset(setCategory)} />
          <FilterPopover
            activeCount={Number(status !== "all") + Number(author !== "all") + Number(search.trim() !== "")}
            onClear={() => {
              setStatus("all");
              setAuthor("all");
              setSearch("");
              setPage(1);
            }}
          >
            <input
              value={search}
              onChange={(event) => reset(setSearch)(event.target.value)}
              placeholder="Search title, summary or tag"
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-text placeholder:text-text-muted"
            />
            <select aria-label="Status" value={status} onChange={(event) => reset(setStatus)(event.target.value as ArticleStatus | "all")} className={selectClasses}>
              <option value="all">Status: All</option>
              {Object.entries(articleStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select aria-label="Author" value={author} onChange={(event) => reset(setAuthor)(event.target.value)} className={selectClasses}>
              <option value="all">Author: All</option>
              {authors.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </FilterPopover>
        </div>
        <KnowledgeBaseTable
          rows={rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          sort={{ key: sortKey, direction }}
          onSortChange={(key) => {
            setDirection((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
            setSortKey(key as SortKey);
            setPage(1);
          }}
          onTogglePublish={togglePublish}
          onDelete={setDeleting}
        />
        <Pagination page={currentPage} pageCount={pageCount} total={rows.length} pageSize={pageSize} itemLabel="articles" onPageChange={setPage} onPageSizeChange={reset(setPageSize)} />
      </Card>
      {deleting && (
        <ConfirmModal
          title="Delete this article?"
          message={`"${deleting.title}" will be permanently removed from the knowledge base.`}
          confirmLabel="Delete"
          tone="danger"
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            removeArticle(deleting.id);
            setDeleting(null);
            showToast("success", "Article deleted.");
          }}
        />
      )}
    </div>
  );
}
