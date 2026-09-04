import { MoreHorizontal } from "lucide-react";

// TODO: wire up card menu actions (export, filter, date range, etc.) once behavior is defined.
export function CardMenuButton() {
  return (
    <button type="button" aria-label="Card options" className="text-text-muted hover:text-text">
      <MoreHorizontal className="h-4 w-4" />
    </button>
  );
}
