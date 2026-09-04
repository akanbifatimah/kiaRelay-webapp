import { cn } from "../../../lib/cn";

interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageCount, total, pageSize, onPageChange }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {start}-{end} of {total.toLocaleString()} orders
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-border px-2 py-1 hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
        >
          &lt;
        </button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && p - pages[i - 1] > 1 && <span className="px-1">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "rounded-md px-2.5 py-1",
                p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-bg",
              )}
            >
              {p}
            </button>
          </span>
        ))}
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-border px-2 py-1 hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
