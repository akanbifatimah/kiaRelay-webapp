import { PageHeader } from "./PageHeader";
import { Card } from "./Card";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

// TODO: replace with the real feature implementation once that module's
// screens/requirements are provided (only Dashboard has been built from
// shared screenshots so far).
export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} subtitle={subtitle} />
      <Card className="flex items-center justify-center py-16 text-center text-sm text-text-muted">
        This module is scoped in the PRD but not yet built.
      </Card>
    </div>
  );
}
