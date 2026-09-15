import { Pencil } from "lucide-react";
import { Card } from "../../../components/Card";
import { Tooltip } from "../../../components/Tooltip";
import type { DriverContact } from "../driverDetails";

interface ContactInformationCardProps {
  contact: DriverContact;
  onEdit: () => void;
}

// Mirrors CustomerInfoCard's shell (label/value grid + edit affordance). The
// edit icon opens the same shared EditDriverProfileModal as the profile
// header's "Edit Profile" button — exact precedent: EditCustomerProfileModal.
export function ContactInformationCard({ contact, onEdit }: ContactInformationCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-muted">Contact Information</h3>
        <Tooltip label="Edit contact information">
          <button
            type="button"
            aria-label="Edit contact information"
            onClick={onEdit}
            className="text-text-muted hover:text-text"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-3 text-sm">
        <div>
          <p className="text-label text-text-muted">Email Address</p>
          <p className="text-text">{contact.email}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Phone Number</p>
          <p className="text-text">{contact.phone}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Mailing Address</p>
          <p className="text-text">{contact.address}</p>
        </div>
      </div>
    </Card>
  );
}
