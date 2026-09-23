import { useEffect, useRef, useState, type ReactNode } from "react";
import { ListFilter } from "lucide-react";
import { Button } from "../../../components/Button";

interface FilterPopoverProps {
  activeCount: number;
  onClear: () => void;
  children: ReactNode;
}

// "Filter" button from My Tickets / Team Monitoring — neither design shows
// what it opens, so it's a small anchored panel holding the same select
// controls the other tables use inline. Click-outside/ESC close it, same
// behavior as DropdownMenu.
export function FilterPopover({ activeCount, onClear, children }: FilterPopoverProps) {
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

  return (
    <div ref={containerRef} className="relative">
      <Button type="button" variant="secondary" onClick={() => setIsOpen((prev) => !prev)}>
        <ListFilter className="h-4 w-4" />
        Filter
        {activeCount > 0 && (
          <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeCount}</span>
        )}
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 flex w-64 flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-lg">
          <div className="flex flex-col gap-2 [&>select]:w-full">{children}</div>
          <button
            type="button"
            onClick={onClear}
            disabled={activeCount === 0}
            className="self-end text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-text-muted disabled:no-underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
