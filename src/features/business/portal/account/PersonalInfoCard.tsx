import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { FormField } from "../../../../components/FormField";
import { Modal } from "../../../../components/Modal";
import { OtpInput } from "../../../../components/OtpInput";
import { useToast } from "../../../../components/toast/ToastContext";
import { updateBusinessAccount, type BusinessAccount } from "../../businessAccounts";
import { MOCK_VERIFICATION_CODE, verifyCode } from "../../contactVerification";

interface InfoForm {
  firstName: string;
  lastName: string;
  phone: string;
}

// Personal Information (2026-10-01; a row on the Account Settings design —
// first pass). A new phone is verified by code. Email is the sign-in id.
export function PersonalInfoCard({ account }: { account: BusinessAccount }) {
  const { showToast } = useToast();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { control, handleSubmit, reset } = useForm<InfoForm>({ values: { firstName: account.owner.firstName, lastName: account.owner.lastName, phone: account.owner.phone } });

  const save = handleSubmit((v) => {
    const phoneChanged = v.phone.replace(/\D/g, "") !== account.owner.phone.replace(/\D/g, "");
    updateBusinessAccount(account.id, { owner: { firstName: v.firstName.trim(), lastName: v.lastName.trim(), phone: v.phone.trim() }, ...(phoneChanged ? { phoneVerified: false } : {}) });
    reset(v);
    if (phoneChanged) setVerifying(true);
    else showToast("success", "Personal information saved.");
  });

  async function confirm() {
    if (await verifyCode("phone", code)) {
      updateBusinessAccount(account.id, { phoneVerified: true });
      setVerifying(false);
      setCode("");
      showToast("success", "New phone number verified.");
    } else showToast("error", "That code isn't right.");
  }

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="font-semibold text-text">Personal Information</h2>
      <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        <FormField control={control} name="firstName" label="First Name *" rules={{ required: "Required." }} />
        <FormField control={control} name="lastName" label="Last Name *" rules={{ required: "Required." }} />
        <FormField control={control} name="phone" label="Phone *" rules={{ required: "Required.", validate: (v) => String(v).replace(/\D/g, "").length >= 10 || "Enter a full number, incl. area code." }} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">Email (sign-in)</span>
          <input value={account.owner.email} readOnly className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-muted" />
        </label>
        <Button type="submit" className="w-fit">Save Changes</Button>
      </form>
      {verifying && (
        <Modal title="Verify your new number" subtitle={`Enter the code sent to ${account.owner.phone}. Demo code: ${MOCK_VERIFICATION_CODE}`} onClose={() => setVerifying(false)} footer={<div className="flex justify-end"><Button disabled={code.length < 6} onClick={confirm}>Verify</Button></div>}>
          {/* TODO: real SMS — the demo code is shown since none is sent. */}
          <OtpInput value={code} onChange={setCode} />
        </Modal>
      )}
    </Card>
  );
}
