import { SearchX } from "lucide-react";
import { Card } from "../../../components/Card";
import { SupportBackLink } from "./SupportBackLink";

// Shown when a Support detail route's id isn't in the session store — a
// stale link, or something created before a full page reload (the mock
// stores reset on reload; see lib/createStore.ts).
export function SupportNotFound({ what, id }: { what: string; id: string }) {
  return (
    <div className="flex flex-col gap-6">
      <SupportBackLink />
      <Card className="flex flex-col items-center gap-2 py-12 text-center">
        <SearchX className="h-8 w-8 text-text-muted" />
        <p className="text-base font-semibold text-text">We couldn't find that {what}</p>
        <p className="text-sm text-text-muted">
          No {what} with ID &ldquo;{id}&rdquo; exists. It may have been removed, or the link is out of date.
        </p>
      </Card>
    </div>
  );
}
