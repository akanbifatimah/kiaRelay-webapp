import { CreditCard, FileText, Pencil, ShieldCheck, Wallet, Zap } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { SettingsCard } from "./components/SettingsCard";
import { SettingsInput } from "./components/SettingsInput";
import { SettingsToggleRow } from "./components/SettingsToggleRow";
import { SettingsSaveBar } from "./components/SettingsSaveBar";
import { PaymentMethodTile } from "./components/PaymentMethodTile";
import { useWatch } from "react-hook-form";
import { PayoutOptionsField } from "./components/PayoutOptionsField";
import { DUE_DATE_CALCULATIONS, PAYMENT_TERMS } from "./settingsOptions";
import { PAYOUT_OPTIONS } from "./payoutOptions";
import { saveFinanceSettings, useFinanceSettings, type FinanceSettings } from "./settingsStore";
import { useSettingsForm } from "./useSettingsForm";

const LABELS: Partial<Record<keyof FinanceSettings, string>> = {
  invoicePrefix: "Invoice prefix", paymentTerms: "Payment terms", dueDateCalculation: "Due date calculation", autoBilling: "Automated billing",
  methodAch: "ACH", methodCard: "Corporate card", methodCredit: "Line of credit", methodDirectHandoff: "Direct handoff",
  payoutOptions: "Payout options", payoutSchedule: "Default payout schedule", minPayout: "Minimum payout", instantCashout: "Instant cashout", payoutApproval: "Payout approval",
};

// Finance Settings (2026-09-23 design). Values persist via settingsStore.
// TODO: once the Finance API exists, invoice numbering, terms and payout
// cycles should be read from these settings by the invoicing/payout jobs.
export function FinanceSettingsPage() {
  const saved = useFinanceSettings();
  const { form, onSave, onCancel, isDirty } = useSettingsForm({ saved, save: saveFinanceSettings, pageName: "Finance Settings", labels: LABELS });
  const { control, formState, getValues, setValue } = form;
  const offered = useWatch({ control, name: "payoutOptions" });
  const methodError = formState.errors.methodAch ?? formState.errors.methodCard ?? formState.errors.methodCredit ?? formState.errors.methodDirectHandoff;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Finance Settings" subtitle="Configure default financial settings." />

      <SettingsCard title="1. Invoice Settings" icon={FileText}>
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsInput
            control={control}
            name="invoicePrefix"
            label="Invoice Prefix"
            prefix="#"
            mono
            icon={<Pencil className="h-3.5 w-3.5" />}
            helper="Applies to all enterprise carrier contracts."
            rules={{ required: "Prefix is required.", pattern: { value: /^[A-Z0-9-]{2,10}$/, message: "2–10 capital letters, digits or dashes." } }}
          />
          <SettingsInput control={control} name="paymentTerms" label="Default Payment Terms" options={PAYMENT_TERMS} helper="Default SLA before invoice accrues overdue penalties." />
          <div className="sm:col-span-2">
            <SettingsInput control={control} name="dueDateCalculation" label="Invoice Due Date Calculation" options={DUE_DATE_CALCULATIONS} helper="Calendar logic determining net maturity timestamp." />
          </div>
        </div>
        <SettingsToggleRow control={control} name="autoBilling" icon={Zap} title="Automated Billing Generation" description="Generate draft invoice automatically upon verified Proof of Delivery (POD)." />
      </SettingsCard>

      <SettingsCard title="2. Payment Settings" icon={CreditCard}>
        <div className="flex flex-col gap-2">
          <p className="text-label text-text-muted">Accepted Payment Methods</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <PaymentMethodTile control={control} name="methodAch" title="Bank Transfer (ACH)" description="Plaid corporate direct debit" />
            <PaymentMethodTile control={control} name="methodCard" title="Corporate Card" description="Visa, Mastercard, Amex (2.9% + 30¢)" />
            <PaymentMethodTile control={control} name="methodCredit" title="Approved Line of Credit" description="Revolving credit terms via underwriting" />
            <PaymentMethodTile control={control} name="methodDirectHandoff" title="Direct Digital Handoff" description="Physical check / manual offline wire" />
          </div>
          {methodError && <p className="text-xs text-danger">{methodError.message}</p>}
        </div>
      </SettingsCard>

      <SettingsCard title="3. Driver Payout Settings" subtitle="Payout options drivers can choose from, the default schedule, and disbursement safeguards." icon={Wallet}>
        <PayoutOptionsField
          control={control}
          onOptionsChange={(next) => {
            if (next.length > 0 && !next.includes(getValues("payoutSchedule"))) setValue("payoutSchedule", next[0], { shouldDirty: true });
          }}
        />
        <SettingsInput
          control={control}
          name="payoutSchedule"
          label="Default Payout Schedule"
          options={PAYOUT_OPTIONS.filter((option) => offered.includes(option.value)).map((option) => ({ value: option.value, label: `${option.label} (${option.description})` }))}
          helper="Applied to new drivers until they choose another offered option."
        />
        <SettingsInput
          control={control}
          name="minPayout"
          label="Minimum Payout Threshold"
          type="number"
          prefix="$"
          suffix="USD"
          mono
          helper="Balances below threshold roll over to the subsequent pay period."
          rules={{ validate: (value) => (typeof value === "number" && !Number.isNaN(value) && value >= 0 && value <= 10_000) || "Enter an amount between $0 and $10,000." }}
        />
        <SettingsToggleRow control={control} name="instantCashout" title="Instant Cashout Feature" description="Allow eligible drivers to request immediate transfer (1.5% fee applied via Stripe Connect)." />
        <SettingsToggleRow control={control} name="payoutApproval" icon={ShieldCheck} title="Payout Approval Required" description="Requires Super Admin or Finance Manager authorization before ACH file batch submission." />
      </SettingsCard>

      <SettingsSaveBar isDirty={isDirty} dirtyMessage="Unsaved finance changes — they apply to invoices and payouts created after you save." onCancel={onCancel} onSave={onSave} />
    </div>
  );
}
