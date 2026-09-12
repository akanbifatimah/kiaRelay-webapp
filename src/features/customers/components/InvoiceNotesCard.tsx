import { Card } from "../../../components/Card";

export function InvoiceNotesCard({ notes }: { notes: string }) {
  return (
    <Card className="flex h-full flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Billing Notes</h3>
      <p className="text-sm italic text-text-muted">&ldquo;{notes}&rdquo;</p>
    </Card>
  );
}
