import { MoreHorizontal } from "lucide-react";

// TODO: wire up card menu actions (export, filter, date range, etc.) once behavior is defined.
// No Tooltip here on purpose (2026-09-08, user correction) — this button is still
// inert, so a hover label advertising "Card options" was actively misleading.
// DropdownMenu (src/components/DropdownMenu.tsx) is the functional equivalent for
// buttons that actually open a menu — that one keeps its Tooltip per working rule 10.
export function CardMenuButton() {
  return (
    <button type="button" aria-label="Card options" className="text-text-muted hover:text-text">
      <MoreHorizontal className="h-4 w-4" />
    </button>
  );
}
