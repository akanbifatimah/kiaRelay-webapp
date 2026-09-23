import { useEffect, useRef, useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { useToast } from "./toast/ToastContext";
import { exportRowsToCsv, printRowsAsPdf, type TableExport } from "../lib/exportTable";

interface ExportMenuButtonProps<T> {
  /** Built lazily on click so the export always reflects current filters. */
  getExport: () => TableExport<T>;
  label?: string;
}

// Icon-only export trigger for report tables (2026-09-23): CSV or PDF of
// the full filtered set. Separate from DropdownMenu, whose trigger is a
// fixed 3-dot icon meant for per-row actions.
export function ExportMenuButton<T>({ getExport, label = "Export table" }: ExportMenuButtonProps<T>) {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function run(format: "csv" | "pdf") {
    setIsOpen(false);
    const data = getExport();
    if (data.rows.length === 0) return showToast("error", "No rows match the current filters — nothing to export.");
    if (format === "csv") {
      exportRowsToCsv(data);
      showToast("success", `Exported ${data.rows.length} row${data.rows.length === 1 ? "" : "s"} to CSV.`);
    } else if (!printRowsAsPdf(data)) {
      showToast("error", "Your browser blocked the report window — allow pop-ups to export PDF.");
    }
  }

  return (
    <div ref={containerRef} className="relative inline-flex">
      <Tooltip label={label}>
        <button
          type="button"
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted hover:bg-bg hover:text-text"
        >
          <Download className="h-4 w-4" />
        </button>
      </Tooltip>
      {isOpen && (
        <div role="menu" className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-border bg-surface py-1 shadow-lg">
          <button type="button" role="menuitem" onClick={() => run("csv")} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-bg">
            <FileSpreadsheet className="h-4 w-4 text-text-muted" />
            Export as CSV
          </button>
          <button type="button" role="menuitem" onClick={() => run("pdf")} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-bg">
            <FileText className="h-4 w-4 text-text-muted" />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
