import type { Control } from "react-hook-form";
import { Card } from "../../../components/Card";
import { FormField } from "../../../components/FormField";
import type { CreateTemplateFormValues } from "../createTemplateForm";

interface TemplateDetailsFieldsProps {
  control: Control<CreateTemplateFormValues>;
}

export function TemplateDetailsFields({ control }: TemplateDetailsFieldsProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-text">Template Details</h3>
      <FormField
        control={control}
        name="templateName"
        label="Template Name"
        placeholder="e.g. Monthly Performance Report"
        rules={{ required: "Required" }}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="templateType"
          label="Template Type"
          type="select"
          options={[
            { value: "email", label: "Email" },
            { value: "newsletter", label: "Newsletter" },
          ]}
        />
        <FormField control={control} name="defaultSubject" label="Default Subject Line" placeholder="Enter default subject" />
      </div>
    </Card>
  );
}
