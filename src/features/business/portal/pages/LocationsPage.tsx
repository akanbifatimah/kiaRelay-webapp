import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Trash2, Truck } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { PageHeader } from "../../../../components/PageHeader";
import { Tooltip } from "../../../../components/Tooltip";
import { isSaved, toggleSavedLocation } from "../../deliveries/deliveryActions";
import { useSavedLocations } from "../../deliveries/deliveriesStore";
import { cityLine } from "../../deliveries/display";
import type { StopAddress } from "../../deliveries/deliveryTypes";
import { AddressSearch } from "../booking/AddressSearch";
import { emptyAddress, emptyStop, startDraft } from "../bookingDraft";
import { canBook, usePortalAccount } from "../usePortalAccount";

// Saved Locations (2026-09-30, no design — first pass): the starred places
// behind "Saved Locations" and "Send again". Added by search, never typed.
export function LocationsPage() {
  const account = usePortalAccount();
  const saved = useSavedLocations(account?.id);
  const navigate = useNavigate();
  const [removing, setRemoving] = useState<StopAddress | null>(null);
  if (!account) return null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Saved Locations" subtitle="Places you ship to often, one click from a new booking." />
      <Card className="max-w-xl">
        <AddressSearch label="Add a location" value={emptyAddress()} places={[]} onPick={(a) => !isSaved(saved, a) && toggleSavedLocation(account.id, a)} />
      </Card>
      {saved.length === 0 && <p className="text-sm text-text-muted">No saved locations yet.</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {saved.map(({ id, address }) => (
          <Card key={id} className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Star className="mt-0.5 h-4 w-4 fill-warning text-warning" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-text">{address.name || address.street}</p>
                <p className="text-xs text-text-muted">{address.street} · {cityLine(address)}</p>
              </div>
              <Tooltip label="Remove location">
                <button type="button" aria-label={`Remove ${address.name || address.street}`} onClick={() => setRemoving(address)} className="rounded p-1 text-text-muted hover:bg-bg hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
            {canBook(account) && (
              <Button variant="secondary" size="sm" onClick={() => { startDraft({ dropoff: { ...emptyStop(), address } }, "send-again"); navigate("/business/book"); }} className="flex items-center justify-center gap-1.5 self-start">
                <Truck className="h-3.5 w-3.5" /> Send here
              </Button>
            )}
          </Card>
        ))}
      </div>
      {removing && (
        <ConfirmModal
          title="Remove saved location?"
          message={`${removing.name || removing.street} will no longer appear in Saved Locations or Send again.`}
          confirmLabel="Remove"
          tone="danger"
          onCancel={() => setRemoving(null)}
          onConfirm={() => {
            toggleSavedLocation(account.id, removing);
            setRemoving(null);
          }}
        />
      )}
    </div>
  );
}
