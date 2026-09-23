import { useNavigate } from "react-router-dom";
import { Avatar } from "../../../components/Avatar";
import { DataTable, type Column, type SortState } from "../../../components/DataTable";
import { DropdownMenu, type DropdownMenuItem } from "../../../components/DropdownMenu";
import { formatUpdated, type KnowledgeArticle } from "../knowledgeBase";
import { ArticleStatusPill, CategoryChip } from "./ArticleMetaTags";

interface KnowledgeBaseTableProps {
  rows: KnowledgeArticle[];
  sort: SortState;
  onSortChange: (key: string) => void;
  onTogglePublish: (article: KnowledgeArticle) => void;
  onDelete: (article: KnowledgeArticle) => void;
}

export function KnowledgeBaseTable({ rows, sort, onSortChange, onTogglePublish, onDelete }: KnowledgeBaseTableProps) {
  const navigate = useNavigate();
  const view = (article: KnowledgeArticle) =>
    navigate(`/support/knowledge-base/${article.id}${article.status === "published" ? "" : "?preview=1"}`);

  function actionsFor(article: KnowledgeArticle): DropdownMenuItem[] {
    return [
      { label: article.status === "published" ? "View Article" : "Preview", onClick: () => view(article) },
      { label: "Edit", onClick: () => navigate(`/support/knowledge-base/${article.id}/edit`) },
      { label: article.status === "published" ? "Unpublish" : "Publish", onClick: () => onTogglePublish(article) },
      { label: "Delete", tone: "danger", onClick: () => onDelete(article) },
    ];
  }

  const columns: Column<KnowledgeArticle>[] = [
    {
      header: "Title",
      sortKey: "title",
      accessor: (row) => (
        <div className="max-w-72 whitespace-normal">
          <p className="font-medium text-text">{row.title}</p>
          <p className="text-xs text-text-muted">{row.summary}</p>
        </div>
      ),
    },
    { header: "Category", sortKey: "category", accessor: (row) => <CategoryChip category={row.category} /> },
    {
      header: "Author",
      sortKey: "author",
      accessor: (row) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Avatar name={row.author} size="sm" />
          {row.author}
        </div>
      ),
    },
    { header: "Last Updated", sortKey: "updated", accessor: (row) => <span className="whitespace-nowrap">{formatUpdated(row.updatedDaysAgo)}</span> },
    { header: "Status", sortKey: "status", accessor: (row) => <ArticleStatusPill status={row.status} /> },
    { header: "", align: "right", accessor: (row) => <DropdownMenu ariaLabel={`Actions for ${row.title}`} items={actionsFor(row)} /> },
  ];

  if (rows.length === 0) return <p className="py-10 text-center text-sm text-text-muted">No articles match the current filters.</p>;

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} sort={sort} onSortChange={onSortChange} onRowClick={view} />;
}
