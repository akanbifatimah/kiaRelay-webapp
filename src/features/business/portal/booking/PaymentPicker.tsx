import { Controller, type Control } from "react-hook-form";
import { CheckCircle2, CreditCard, ReceiptText } from "lucide-react";
import { cn } from "../../../../lib/cn";
import type { OptionsForm } from "./OptionsStep";

export interface PaymentOption {
  id: string;
  kind: "invoice" | "card";
  title: string;
  detail: string;
}

/** Payment tiles: "Bill to account" on net terms, then company cards. */
export function PaymentPicker({ control, options }: { control: Control<OptionsForm>; options: PaymentOption[] }) {
  return (
    <Controller
      control={control}
      name="paymentId"
      rules={{ required: "Choose how to pay." }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm text-text-muted">Payment Method</legend>
          <div role="radiogroup" className="grid gap-3 sm:grid-cols-3">
            {options.map((option) => {
              const on = option.id === value;
              const Icon = option.kind === "invoice" ? ReceiptText : CreditCard;
              return (
                <button key={option.id} type="button" role="radio" aria-checked={on} onClick={() => onChange(option.id)} className={cn("relative flex flex-col gap-1 rounded-lg border bg-surface p-3 text-left", on ? "border-2 border-primary" : "border-border hover:border-text-muted")}>
                  <Icon className="h-4 w-4 text-sidebar" />
                  <span className="text-sm font-semibold text-text">{option.title}</span>
                  <span className="text-xs text-text-muted">{option.detail}</span>
                  {on && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
          {error?.message && <span className="text-xs text-danger">{error.message}</span>}
        </fieldset>
      )}
    />
  );
}
