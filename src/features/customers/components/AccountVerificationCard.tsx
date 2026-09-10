import { CheckCircle2 } from "lucide-react";
import { Card } from "../../../components/Card";
import type { CustomerDetail } from "../customerDetails";

type AccountVerificationCardProps = Pick<
  CustomerDetail,
  "phoneVerifiedDate" | "emailVerifiedDate" | "idVerifiedDate" | "fullyVerified"
>;

function VerificationRow({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-text">
        <CheckCircle2 className="h-4 w-4 text-success" />
        {label}
      </span>
      <span className="text-xs text-text-muted">{date}</span>
    </div>
  );
}

export function AccountVerificationCard({
  phoneVerifiedDate,
  emailVerifiedDate,
  idVerifiedDate,
  fullyVerified,
}: AccountVerificationCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Account Verification</h3>
      <VerificationRow label="Phone Verification" date={phoneVerifiedDate} />
      <VerificationRow label="Email Verification" date={emailVerifiedDate} />
      <VerificationRow label="ID Documents" date={idVerifiedDate} />
      {fullyVerified && (
        <p className="flex items-center gap-2 rounded-lg bg-tag-healthcare-bg px-3 py-2 text-sm font-medium text-tag-healthcare-fg">
          <CheckCircle2 className="h-4 w-4" />
          This customer is fully verified
        </p>
      )}
    </Card>
  );
}
