import { Card } from "../../../components/Card";
import type { CustomerDetail } from "../customerDetails";

type CustomerInfoCardProps = Pick<
  CustomerDetail,
  "fullName" | "email" | "emailVerified" | "phone" | "phoneVerified" | "createdDate" | "lastActivity"
>;

function VerifiedTag() {
  return (
    <span className="text-badge rounded-full bg-tag-healthcare-bg px-1.5 py-0.5 text-tag-healthcare-fg">
      Verified
    </span>
  );
}

export function CustomerInfoCard({
  fullName,
  email,
  emailVerified,
  phone,
  phoneVerified,
  createdDate,
  lastActivity,
}: CustomerInfoCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-muted">Customer Information</h3>
        <button type="button" className="text-xs font-medium text-primary hover:underline">
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-label text-text-muted">Full Name</p>
          <p className="text-text">{fullName}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Email Address</p>
          <p className="flex items-center gap-1.5 text-text">
            {email}
            {emailVerified && <VerifiedTag />}
          </p>
        </div>
        <div>
          <p className="text-label text-text-muted">Phone Number</p>
          <p className="flex items-center gap-1.5 text-text">
            {phone}
            {phoneVerified && <VerifiedTag />}
          </p>
        </div>
        <div>
          <p className="text-label text-text-muted">Created Date</p>
          <p className="text-text">{createdDate}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Last Activity</p>
          <p className="text-text">{lastActivity}</p>
        </div>
      </div>
    </Card>
  );
}
