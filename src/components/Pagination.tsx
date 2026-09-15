import { useState } from "react";
import { cn } from "../lib/cn";
import { Tooltip } from "./Tooltip";

interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  /** Omit to keep this call exactly as before — the page-size control only
   * renders when a caller opts in by passing this. */
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 15, 20, 25];

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  itemLabel = "items",
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: PaginationProps) {
  const [customSize, setCustomSize] = useState("");
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );
  // Keeps the <select> honest when the current size (e.g. a page's own
  // non-standard default, or a previously-typed custom value) isn't one of
  // the preset options — never silently falls back to showing the wrong size.
  const sizeOptions = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  function applyCustomSize() {
    const value = Math.trunc(Number(customSize));
    if (Number.isFinite(value) && value > 0) onPageSizeChange?.(value);
    setCustomSize("");
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 text-sm text-text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <span>
        Showing {start}-{end} of {total.toLocaleString()} {itemLabel}
      </span>
      <div className="flex flex-wrap items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">Rows per page</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-text"
            >
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>or</span>
            <input
              type="number"
              min={1}
              value={customSize}
              onChange={(event) => setCustomSize(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && applyCustomSize()}
              placeholder="Custom"
              aria-label="Custom rows per page"
              className="w-20 rounded-md border border-border bg-surface px-2 py-1 text-sm text-text placeholder:text-text-muted"
            />
          </div>
        )}
        <div className="flex items-center gap-1">
          <Tooltip label="Previous page">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-md border border-border px-2 py-1 hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
            >
              &lt;
            </button>
          </Tooltip>
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
          <Tooltip label="Next page">
            <button
              type="button"
              aria-label="Next page"
              disabled={page >= pageCount}
              onClick={() => onPageChange(page + 1)}
              className="rounded-md border border-border px-2 py-1 hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
            >
              &gt;
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
