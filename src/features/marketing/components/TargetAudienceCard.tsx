import { Controller, type Control, useWatch } from "react-hook-form";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import { audienceEstimates, type CreateNewsletterFormValues, type NewsletterAudienceType } from "../createNewsletterForm";

const audienceTypes: { id: NewsletterAudienceType; label: string }[] = [
  { id: "all", label: "All Customers" },
  { id: "company", label: "Company" },
  { id: "individual", label: "Individual" },
  { id: "custom", label: "Custom Segments" },
];

interface TargetAudienceCardProps {
  control: Control<CreateNewsletterFormValues>;
}

export function TargetAudienceCard({ control }: TargetAudienceCardProps) {
  const audienceType = useWatch({ control, name: "audienceType" });

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Target Audience</h3>
        <span className="text-xs text-text-muted">Estimated Recipients {audienceEstimates[audienceType].toLocaleString()}</span>
      </div>
      <Controller
        name="audienceType"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="flex flex-wrap gap-2">
            {audienceTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => onChange(type.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium",
                  audienceType === type.id ? "border-text bg-text text-white" : "border-border text-text hover:bg-bg",
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}
      />
    </Card>
  );
}
