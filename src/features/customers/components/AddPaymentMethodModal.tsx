import { useState } from "react";
import { CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { PaymentMethod, PaymentMethodType } from "../customerDetails";

interface AddPaymentMethodFormValues {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  bankName: string;
  accountType: string;
  email: string;
}

interface AddPaymentMethodModalProps {
  onClose: () => void;
  onAdd: (method: PaymentMethod) => void;
}

// TODO: replace with real POST /customers/:id/payment-methods once the
// Customer Management / billing API exists — this only stores the new
// method in local component state on the page, not persisted anywhere.
export function AddPaymentMethodModal({ onClose, onAdd }: AddPaymentMethodModalProps) {
  const [type, setType] = useState<PaymentMethodType>("card");
  const { control, handleSubmit } = useForm<AddPaymentMethodFormValues>({
    defaultValues: { cardholderName: "", cardNumber: "", expiry: "", bankName: "", accountType: "Checking", email: "" },
  });

  function onSubmit(values: AddPaymentMethodFormValues) {
    const id = `pm-new-${Date.now()}`;
    if (type === "card") {
      onAdd({
        id,
        type,
        label: `Card Ending in ${values.cardNumber.slice(-4) || "0000"}`,
        detail: `Expires ${values.expiry || "—"}`,
        status: "pending",
        cardholderName: values.cardholderName,
        expiry: values.expiry,
      });
    } else if (type === "bank") {
      onAdd({
        id,
        type,
        label: `${values.bankName || "Bank"} ACH`,
        detail: "Pending verification",
        status: "pending",
        bankName: values.bankName,
        accountType: values.accountType,
      });
    } else {
      onAdd({
        id,
        type,
        label: "PayPal",
        detail: values.email,
        status: "pending",
        email: values.email,
        connectedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      });
    }
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <CreditCard className="h-5 w-5 text-primary" />
          Add Payment Method
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Add Method
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {(["card", "bank", "paypal"] as PaymentMethodType[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              className={
                "flex-1 rounded-full border px-3 py-1.5 text-sm font-medium capitalize " +
                (type === option
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-text hover:bg-bg")
              }
            >
              {option === "paypal" ? "PayPal" : option === "bank" ? "Bank ACH" : "Card"}
            </button>
          ))}
        </div>

        {type === "card" && (
          <>
            <FormField control={control} name="cardholderName" label="Cardholder Name" />
            <FormField control={control} name="cardNumber" label="Card Number" />
            <FormField control={control} name="expiry" label="Expiry (MM/YY)" />
          </>
        )}
        {type === "bank" && (
          <>
            <FormField control={control} name="bankName" label="Bank Name" />
            <FormField
              control={control}
              name="accountType"
              label="Account Type"
              type="select"
              options={[
                { value: "Checking", label: "Checking" },
                { value: "Savings", label: "Savings" },
                { value: "Business Checking", label: "Business Checking" },
              ]}
            />
          </>
        )}
        {type === "paypal" && <FormField control={control} name="email" label="PayPal Email" />}
      </div>
    </Modal>
  );
}
