import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { PasswordField } from "../../../../components/PasswordField";
import { businessLogout, isDemoBusiness, removeBusinessAccount } from "../../businessAccounts";
import { usePortalAccount } from "../usePortalAccount";
import { SettingsSubPage } from "./SettingsList";

// Close Company Account (2026-10-01; mirrors the app's Delete Account):
// re-enter the password, then a final confirmation. The demo company can't
// be closed, so testers keep it. TODO: DELETE /business/me; the backend keeps
// invoices for tax records and blocks closing while a delivery is in progress.
export function CloseAccountPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const { control, handleSubmit } = useForm<{ password: string }>({ defaultValues: { password: "" } });
  if (!account) return null;
  const demo = isDemoBusiness(account.owner.email);

  return (
    <SettingsSubPage title="Close Company Account" subtitle={account.company.legalName}>
      <Card className="flex flex-col gap-4">
        <div className="flex gap-3 rounded-lg bg-danger/10 p-4 text-sm text-danger">
          <TriangleAlert className="h-5 w-5 shrink-0" />
          <p>Closing removes your company's access to KiaRelay Business: bookings, team members and saved locations. Open invoices still need to be paid. This can't be undone.</p>
        </div>
        {demo ? (
          <p className="text-sm text-text-muted">The demo company can't be closed, so testers can keep using it.</p>
        ) : (
          <form onSubmit={handleSubmit(() => setConfirming(true))} className="flex flex-col gap-4">
            <PasswordField control={control} name="password" label="Password" rules={{ required: "Enter your password.", validate: (v) => v === account.password || "That password isn't right." }} />
            <Button type="submit" variant="danger" className="w-fit">Close Company Account</Button>
          </form>
        )}
      </Card>
      {confirming && (
        <ConfirmModal
          title="Close company account?"
          message="This can't be undone."
          confirmLabel="Close Account"
          tone="danger"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            removeBusinessAccount(account.id);
            businessLogout();
            navigate("/login", { replace: true });
          }}
        />
      )}
    </SettingsSubPage>
  );
}
