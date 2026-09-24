import { useMemo, useState } from "react";
import type { SortState } from "../components/DataTable";

interface TableStateOptions<T, K extends string> {
  rows: T[];
  /** Define at module scope — a new object each render would re-sort every render. */
  sorters: Record<K, (row: T) => string | number>;
  initialSort: { key: K; direction: "asc" | "desc" };
  initialPageSize?: number;
}

// Sort + paginate state for tables (built for Reports, promoted 2026-09-23
// once User Management/Audit Log needed it): keeps the house pattern — sort
// the FULL filtered set first, then slice the page — in one place. Sorting
// on a new column starts descending ("highest/newest first").
export function useTableState<T, K extends string>({ rows, sorters, initialSort, initialPageSize = 10 }: TableStateOptions<T, K>) {
  const [sortKey, setSortKey] = useState<K>(initialSort.key);
  const [direction, setDirection] = useState<"asc" | "desc">(initialSort.direction);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [prevRows, setPrevRows] = useState(rows);

  // A new filtered set (range/filter/search change) starts on its first page.
  // Adjusted during render rather than in an effect, per React's guidance —
  // callers must memoize `rows` so this only fires on a real change.
  if (rows !== prevRows) {
    setPrevRows(rows);
    setPage(1);
  }

  const sorted = useMemo(() => {
    const value = sorters[sortKey];
    const sign = direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const left = value(a);
      const right = value(b);
      return (typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right))) * sign;
    });
  }, [rows, sorters, sortKey, direction]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const sort: SortState = { key: sortKey, direction };

  return {
    sorted,
    pageRows: sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    sort,
    onSortChange: (key: string) => {
      setDirection((prev) => (key === sortKey ? (prev === "asc" ? "desc" : "asc") : "desc"));
      setSortKey(key as K);
      setPage(1);
    },
    pagination: {
      page: currentPage,
      pageCount,
      total: sorted.length,
      pageSize,
      onPageChange: setPage,
      onPageSizeChange: (size: number) => {
        setPageSize(size);
        setPage(1);
      },
    },
  };
}
