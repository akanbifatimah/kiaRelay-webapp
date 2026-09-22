import type { Control } from "react-hook-form";
import { Card } from "../../../components/Card";
import { FormField } from "../../../components/FormField";
import type { CreateNewsletterFormValues } from "../createNewsletterForm";

interface NewsletterDetailsCardProps {
  control: Control<CreateNewsletterFormValues>;
}

export function NewsletterDetailsCard({ control }: NewsletterDetailsCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-text">Newsletter Details</h3>
      <FormField
        control={control}
        name="newsletterName"
        label="Newsletter Name"
        placeholder="e.g. Q3 Logistics Update"
        rules={{ required: "Required" }}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField control={control} name="subject" label="Subject Line" rules={{ required: "Required" }} />
        <FormField control={control} name="previewText" label="Preview Text" />
      </div>
      <FormField control={control} name="senderName" label="Sender Name" rules={{ required: "Required" }} />
    </Card>
  );
}
