import { Card } from "../../../components/Card";
import type { DeliveryVolumeCategory } from "../driverPerformance";

const fillClasses: Record<DeliveryVolumeCategory["type"], string> = {
  express: "bg-tag-express-fg",
  standard: "bg-tag-standard-fg",
  freight: "bg-tag-freight-fg",
  healthcare: "bg-tag-healthcare-fg",
  overnight: "bg-tag-overnight-fg",
};

export function DeliveryVolumeBarList({ categories }: { categories: DeliveryVolumeCategory[] }) {
  const max = Math.max(...categories.map((c) => c.value));

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-text">Delivery Volume</h2>
      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <div key={category.type} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text">{category.label}</span>
              <span className="font-medium text-text">{category.value.toLocaleString()}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full ${fillClasses[category.type]}`}
                style={{ width: `${(category.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
