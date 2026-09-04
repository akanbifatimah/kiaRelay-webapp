import { cn } from "../lib/cn";

export type DeliveryType = "express" | "standard" | "freight" | "healthcare" | "overnight";

const tagClasses: Record<DeliveryType, string> = {
  express: "bg-tag-express-bg text-tag-express-fg",
  standard: "bg-tag-standard-bg text-tag-standard-fg",
  freight: "bg-tag-freight-bg text-tag-freight-fg",
  healthcare: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  overnight: "bg-tag-overnight-bg text-tag-overnight-fg",
};

interface TagChipProps {
  type: DeliveryType;
  className?: string;
}

export function TagChip({ type, className }: TagChipProps) {
  return (
    <span
      className={cn(
        "text-badge inline-flex items-center rounded-full px-2.5 py-0.5 text-center",
        tagClasses[type],
        className,
      )}
    >
      {type}
    </span>
  );
}
