import { Card } from "../../../components/Card";
import { useToast } from "../../../components/toast/ToastContext";
import type { CompanyActivityItem } from "../companyOverview";

// TODO: "Load Older Activity" has no paged endpoint yet — replace with real
// pagination once GET /customers/:id/activity exists.
export function CompanyRecentActivityCard({ activity }: { activity: CompanyActivityItem[] }) {
  const { showToast } = useToast();

  return (
    <Card className="flex h-full flex-col">
      <h3 className="text-sm font-semibold text-text">Recent Activity</h3>

      {activity.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">No recent activity.</p>
      ) : (
        <div className="mt-4 flex-1 space-y-4">
          {activity.map((item) => (
            <div key={item.title} className="flex gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-text">{item.title}</p>
                  <span className="shrink-0 text-xs text-text-muted">{item.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-text-muted">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => showToast("success", "No older activity to load yet.")}
        className="mt-5 flex w-full items-center justify-center rounded-lg border border-border bg-bg px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface"
      >
        Load Older Activity
      </button>
    </Card>
  );
}
