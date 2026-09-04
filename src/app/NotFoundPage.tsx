import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

// Rendered for any unmatched path inside AppShell, so the sidebar/header
// stay visible instead of falling through to the full-page error boundary.
export function NotFoundPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Page Not Found" subtitle="The page you're looking for doesn't exist." />
      <Card className="flex flex-col items-center gap-4 py-16 text-center text-sm text-text-muted">
        <p>Check the URL, or head back to the Dashboard.</p>
        <Link to="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
