import type { ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  align?: "left" | "right";
  /** Opaque id used to report/compare the active sort — omit for a non-sortable column. */
  sortKey?: string;
}

export interface SortState {
  key: string;
  direction: "asc" | "desc";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  /** Gates which rows onRowClick actually applies to — e.g. a table where only
   * some statuses have somewhere to go. Rows it returns false for get neither
   * the click handler nor the pointer cursor, so hover never lies about what's
   * clickable. Defaults to every row being clickable when onRowClick is set. */
  isRowClickable?: (row: T) => boolean;
  sort?: SortState;
  onSortChange?: (key: string) => void;
  /** Optional <tfoot> content (one or more <tr>s) — e.g. a report's totals
   * row, computed by the caller over the full filtered set. */
  footer?: ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  isRowClickable = () => true,
  sort,
  onSortChange,
  footer,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border text-left text-sm font-medium text-text-muted">
            {columns.map((col) => (
              <th
                key={col.header}
                className={cn("whitespace-nowrap py-2 pr-4", col.align === "right" && "text-right")}
              >
                {col.sortKey && onSortChange ? (
                  <button
                    type="button"
                    onClick={() => onSortChange(col.sortKey as string)}
                    className={cn(
                      "inline-flex items-center gap-1 hover:text-text",
                      sort?.key === col.sortKey && "text-text",
                    )}
                  >
                    {col.header}
                    {sort?.key === col.sortKey ? (
                      sort.direction === "asc" ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-3.5 w-3.5 text-text-muted/60" />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const clickable = Boolean(onRowClick) && isRowClickable(row);
            return (
              <tr
                key={rowKey(row)}
                onClick={clickable ? () => onRowClick?.(row) : undefined}
                className={cn(
                  "border-b border-border last:border-0",
                  clickable && "cursor-pointer hover:bg-bg",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.header}
                    className={cn("py-3 pr-4 text-text", col.align === "right" && "text-right")}
                  >
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>
  );
}
