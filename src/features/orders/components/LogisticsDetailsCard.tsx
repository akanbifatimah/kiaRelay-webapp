import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { OrderDetail } from "../orderDetails";

type LogisticsDetailsCardProps = Pick<
  OrderDetail,
  "dimensions" | "weightLbs" | "tags" | "pickupAddress" | "dropoffAddress"
>;

function tagColorClasses(tag: string): string {
  if (tag.toLowerCase().includes("fragile")) return "bg-tag-danger-bg text-tag-danger-fg";
  if (tag.toLowerCase().includes("temp")) return "bg-tag-freight-bg text-tag-freight-fg";
  return "bg-tag-standard-bg text-tag-standard-fg";
}

export function LogisticsDetailsCard({
  dimensions,
  weightLbs,
  tags,
  pickupAddress,
  dropoffAddress,
}: LogisticsDetailsCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Logistics Details</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-label text-text-muted">Dimensions</p>
          <p className="font-medium text-text">{dimensions}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Weight</p>
          <p className="font-medium text-text">{weightLbs} lbs</p>
        </div>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className={cn("text-badge rounded-full px-2 py-0.5", tagColorClasses(tag))}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-label text-text-muted">Pickup</p>
          <p className="text-text">{pickupAddress[0]}</p>
          {pickupAddress[1] && <p className="text-text">{pickupAddress[1]}</p>}
        </div>
        <div>
          <p className="text-label text-text-muted">Drop-off</p>
          <p className="text-text">{dropoffAddress[0]}</p>
          {dropoffAddress[1] && <p className="text-text">{dropoffAddress[1]}</p>}
        </div>
      </div>
    </Card>
  );
}
