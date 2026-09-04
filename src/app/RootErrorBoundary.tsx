import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import { Button } from "../components/Button";

// Root-level errorElement — catches genuine render/loader errors that bubble
// past AppShell (a matched-but-unknown path is instead handled by the "*"
// child route + NotFoundPage, which keeps the sidebar/header visible).
export function RootErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : undefined;
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "Something went wrong.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
      <p className="text-label text-primary">{status ?? "Error"}</p>
      <h1 className="text-heading-1 text-text">Something went wrong</h1>
      <p className="text-body max-w-md text-text-muted">{message}</p>
      <Link to="/">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
