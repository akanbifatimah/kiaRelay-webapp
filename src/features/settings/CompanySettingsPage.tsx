import { Building2, CheckCircle2, Globe, Hash, Mail, MapPin, Phone } from "lucide-react";
import { useWatch } from "react-hook-form";
import { PageHeader } from "../../components/PageHeader";
import { SettingsCard } from "./components/SettingsCard";
import { SettingsInput } from "./components/SettingsInput";
import { SettingsSaveBar } from "./components/SettingsSaveBar";
import { CompanyLogoField } from "./components/CompanyLogoField";
import { TaxIdField } from "./components/TaxIdField";
import { ComplianceCard } from "./components/ComplianceCard";
import { COUNTRY_OPTIONS, REGIONS_BY_COUNTRY } from "./settingsOptions";
import { saveCompanySettings, useCompanySettings, type CompanySettings } from "./settingsStore";
import { useSettingsForm } from "./useSettingsForm";

const LABELS: Partial<Record<keyof CompanySettings, string>> = {
  companyName: "Company name", email: "Business email", phone: "Phone", website: "Website", address: "Address", country: "Country",
  state: "State", city: "City", postalCode: "Postal code", registrationNumber: "Registration number", ein: "EIN", dotAuthority: "DOT authority", logoUrl: "Logo",
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const required = (label: string) => ({ required: `${label} is required.` });

export function CompanySettingsPage() {
  const saved = useCompanySettings();
  const { form, onSave, onCancel, isDirty } = useSettingsForm({ saved, save: saveCompanySettings, pageName: "Company Settings", labels: LABELS });
  const { control, setValue } = form;
  const country = useWatch({ control, name: "country" });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Company Settings" subtitle="Manage KiaRelay business information, compliance credentials, and corporate identity." />

      <SettingsCard title="Company Information" subtitle="Legal entity profile and operational headquarters.">
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsInput control={control} name="companyName" label="Company Name" icon={<Building2 className="h-4 w-4" />} rules={required("Company name")} />
          <SettingsInput control={control} name="email" label="Business Email" type="email" icon={<Mail className="h-4 w-4" />} rules={{ ...required("Business email"), pattern: { value: EMAIL, message: "Enter a valid email address." } }} />
          <SettingsInput control={control} name="phone" label="Phone Number" type="tel" icon={<Phone className="h-4 w-4" />} rules={required("Phone number")} />
          <SettingsInput control={control} name="website" label="Website" type="url" icon={<Globe className="h-4 w-4" />} rules={{ pattern: { value: /^https?:\/\/\S+\.\S+/, message: "Start with https://" } }} />
          <div className="sm:col-span-2">
            <SettingsInput control={control} name="address" label="Business Address" icon={<MapPin className="h-4 w-4" />} rules={required("Address")} />
          </div>
          <SettingsInput
            control={control}
            name="country"
            label="Country"
            options={COUNTRY_OPTIONS}
            // A new country's regions don't include the old state — pick its first.
            onValueChange={(value) => setValue("state", REGIONS_BY_COUNTRY[value]?.[0]?.value ?? "", { shouldDirty: true })}
          />
          <SettingsInput control={control} name="state" label={country === "Canada" ? "Province" : "State"} options={REGIONS_BY_COUNTRY[country] ?? []} />
          <SettingsInput control={control} name="city" label="City" rules={required("City")} />
          <SettingsInput control={control} name="postalCode" label="Postal Code" rules={required("Postal code")} />
        </div>
      </SettingsCard>

      <SettingsCard title="Business Details & Tax Information" subtitle="Federal and state operating authority.">
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsInput control={control} name="registrationNumber" label="Business Registration Number" mono icon={<Hash className="h-4 w-4" />} rules={required("Registration number")} />
          <TaxIdField control={control} />
          <div className="sm:col-span-2">
            <SettingsInput
              control={control}
              name="dotAuthority"
              label="DOT Operating Authority"
              mono
              rules={required("DOT authority")}
              icon={
                <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  FMCSA SYNCED
                </span>
              }
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Company Logo" subtitle="Displayed across client dispatch receipts, digital bills of lading, and driver app headers.">
        <CompanyLogoField control={control} />
      </SettingsCard>

      <ComplianceCard />

      <SettingsSaveBar isDirty={isDirty} dirtyMessage="All updates staged locally. Remember to persist changes." onCancel={onCancel} onSave={onSave} />
    </div>
  );
}
