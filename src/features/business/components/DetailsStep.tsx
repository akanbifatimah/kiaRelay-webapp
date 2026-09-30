import { useForm, useWatch } from "react-hook-form";
import { ArrowRight, Building2, Contact } from "lucide-react";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { CompanyDetails } from "../businessTypes";
import { AddressFields } from "./AddressFields";
import { COMPANY_TYPES, EIN_PATTERN, EMAIL_PATTERN, INDUSTRIES, PHONE_RULE, toOptions } from "../registerForm";
import { FormSection } from "./FormSection";

interface DetailsStepProps {
  initial: CompanyDetails;
  onContinue: (values: CompanyDetails) => void;
}

const required = (message: string) => ({ required: message });

// Step 2, "Details": Company Details, Business Address and Primary Contact,
// per the design. The design's button read "Submit Application" here too;
// it's "Continue" so that only Documents submits (agreed plan, 2026-09-29).
export function DetailsStep({ initial, onContinue }: DetailsStepProps) {
  const { control, handleSubmit, setValue } = useForm<CompanyDetails>({ defaultValues: initial, mode: "onTouched" });
  const industry = useWatch({ control, name: "industry" });
  const companyType = useWatch({ control, name: "companyType" });
  // A value typed under "Other" is dropped if the user then picks a listed option.
  const submit = handleSubmit((values) =>
    onContinue({
      ...values,
      industryOther: values.industry === "Other" ? values.industryOther.trim() : "",
      companyTypeOther: values.companyType === "Other" ? values.companyTypeOther.trim() : "",
    }),
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <FormSection title="Company Details" icon={Building2}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={control} name="legalName" label="Legal Company Name *" placeholder="e.g. Apex Logistics LLC" rules={required("Legal company name is required.")} />
          <FormField control={control} name="dba" label="DBA (Doing Business As)" placeholder="Optional" />
          <FormField
            control={control}
            name="ein"
            label="EIN / Tax ID *"
            placeholder="XX-XXXXXXX"
            rules={{ ...required("EIN is required."), pattern: { value: EIN_PATTERN, message: "Use the 9-digit format XX-XXXXXXX." } }}
          />
          <FormField control={control} name="industry" label="Industry *" type="select" options={toOptions(INDUSTRIES, "Select Industry")} rules={required("Choose an industry.")} />
          {/* "Other" asks what the industry is (2026-09-30); the field's rules only apply while it's shown. */}
          {industry === "Other" && (
            <FormField control={control} name="industryOther" label="Specify Your Industry *" placeholder="e.g. Agriculture, Aerospace" rules={required("Tell us your industry.")} />
          )}
          <FormField control={control} name="companyType" label="Company Type *" type="select" options={toOptions(COMPANY_TYPES, "Select Type")} rules={required("Choose a company type.")} />
          {companyType === "Other" && (
            <FormField control={control} name="companyTypeOther" label="Specify Company Type *" placeholder="e.g. Cooperative, Trust" rules={required("Tell us your company type.")} />
          )}
        </div>
        <h3 className="pt-2 text-base font-semibold text-text">Business Address</h3>
        <AddressFields control={control} setValue={setValue} />
      </FormSection>

      <FormSection title="Primary Contact" icon={Contact}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={control} name="contactFirstName" label="First Name *" rules={required("First name is required.")} />
          <FormField control={control} name="contactLastName" label="Last Name *" rules={required("Last name is required.")} />
          <div className="sm:col-span-2">
            <FormField control={control} name="contactTitle" label="Job Title *" rules={required("Job title is required.")} />
          </div>
          <FormField
            control={control}
            name="contactEmail"
            label="Work Email *"
            rules={{ ...required("Work email is required."), pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address." } }}
          />
          <FormField control={control} name="contactPhone" label="Phone Number *" rules={{ ...required("Phone number is required."), ...PHONE_RULE }} />
        </div>
      </FormSection>

      <Button type="submit" className="self-end">
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
