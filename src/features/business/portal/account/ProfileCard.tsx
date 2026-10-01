import { Link } from "react-router-dom";
import { BadgeCheck, Building2, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Avatar } from "../../../../components/Avatar";
import { Card } from "../../../../components/Card";
import { Tooltip } from "../../../../components/Tooltip";
import { useToast } from "../../../../components/toast/ToastContext";
import { BUSINESS_BRAND } from "../../../../constants/brand";
import { prepareImage } from "../../../../lib/prepareImage";
import { updateBusinessAccount, type BusinessAccount } from "../../businessAccounts";
import { fullName } from "../../businessTypes";

/** My Account header (2026-10-01, from the Account Settings design): photo
 * with edit, name, ID, Verified, then the company card. */
export function ProfileCard({ account }: { account: BusinessAccount }) {
  const { showToast } = useToast();
  const name = fullName(account.owner.firstName, account.owner.lastName);

  async function upload(file: File | undefined) {
    if (!file) return;
    try {
      updateBusinessAccount(account.id, { photoUri: await prepareImage(file, { maxWidth: 256, maxHeight: 256, square: true }) });
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Couldn't use that image.");
    }
  }

  return (
    <Card className="flex flex-col items-center gap-4 p-6">
      <div className="relative">
        {account.photoUri ? <img src={account.photoUri} alt={name} className="h-24 w-24 rounded-full object-cover" /> : <span className="flex h-24 w-24 items-center justify-center"><Avatar name={name} /></span>}
        <Tooltip label="Change photo" className="absolute bottom-0 right-0">
          <label aria-label="Change photo" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-surface bg-primary text-primary-foreground">
            <Pencil className="h-3.5 w-3.5" />
            <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="sr-only" onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
        </Tooltip>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-text">{name}</p>
        <p className="flex items-center justify-center gap-2 text-xs text-text-muted">
          ID: {account.id}
          {account.status === "verified" && <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 font-semibold text-success"><BadgeCheck className="h-3 w-3" /> Verified</span>}
        </p>
        {account.photoUri && (
          <button type="button" onClick={() => updateBusinessAccount(account.id, { photoUri: undefined })} className="mt-1 inline-flex items-center gap-1 text-xs text-text-muted hover:text-danger">
            <Trash2 className="h-3 w-3" /> Remove photo
          </button>
        )}
      </div>
      <Link to="/business/company" className="flex w-full items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15"><Building2 className="h-5 w-5 text-primary" /></span>
        <span className="flex-1">
          <span className="block font-semibold text-text">{account.company.legalName}</span>
          <span className="block text-xs text-text-muted">{BUSINESS_BRAND} Account</span>
        </span>
        <ChevronRight className="h-4 w-4 text-text-muted" />
      </Link>
    </Card>
  );
}
