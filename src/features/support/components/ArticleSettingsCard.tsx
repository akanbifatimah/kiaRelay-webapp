import { Controller, type Control } from "react-hook-form";
import { Headset, Truck, Users } from "lucide-react";
import { Card } from "../../../components/Card";
import { Avatar } from "../../../components/Avatar";
import { FormField } from "../../../components/FormField";
import { cn } from "../../../lib/cn";
import { articleCategoryLabels, articleStatusLabels, audienceLabels, type ArticleAudience, type ArticleStatus } from "../knowledgeBase";
import type { ArticleFormValues } from "../articleForm";

const AUDIENCE_ICONS: Record<ArticleAudience, typeof Users> = { "support-staff": Headset, customers: Users, drivers: Truck };

const statusPill: Record<ArticleStatus, string> = {
  draft: "bg-tag-standard-bg text-tag-standard-fg",
  published: "bg-success/10 text-success",
  "in-review": "bg-tag-overnight-bg text-tag-overnight-fg",
};

interface ArticleSettingsCardProps {
  control: Control<ArticleFormValues>;
  status: ArticleStatus;
  author: { name: string; role: string };
}

export function ArticleSettingsCard({ control, status, author }: ArticleSettingsCardProps) {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-base font-semibold text-text">Article Settings</h2>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text">Status</span>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", statusPill[status])}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {articleStatusLabels[status]}
        </span>
      </div>
      <FormField
        control={control}
        name="category"
        label="Category"
        type="select"
        options={[{ value: "", label: "Select a category..." }, ...Object.entries(articleCategoryLabels).map(([value, label]) => ({ value, label }))]}
        rules={{ required: "Pick a category before publishing." }}
      />
      <div className="flex flex-col gap-2">
        <span className="text-sm text-text-muted">Target Audience</span>
        <Controller
          name="audiences"
          control={control}
          rules={{ validate: (value) => value.length > 0 || "Pick at least one audience." }}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              {(Object.keys(audienceLabels) as ArticleAudience[]).map((audience) => {
                const Icon = AUDIENCE_ICONS[audience];
                const checked = field.value.includes(audience);
                return (
                  <label key={audience} className="flex cursor-pointer items-center gap-3 text-sm text-text">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => field.onChange(checked ? field.value.filter((a) => a !== audience) : [...field.value, audience])}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="flex-1">{audienceLabels[audience]}</span>
                    <Icon className="h-4 w-4 text-text-muted" />
                  </label>
                );
              })}
              {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
            </div>
          )}
        />
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <span className="text-sm text-text-muted">Author</span>
        <div className="flex items-center gap-3 rounded-lg bg-bg px-3 py-2">
          <Avatar name={author.name} src="/profile_img.png" size="sm" />
          <div>
            <p className="text-sm font-semibold text-text">{author.name}</p>
            <p className="text-xs text-text-muted">{author.role}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
