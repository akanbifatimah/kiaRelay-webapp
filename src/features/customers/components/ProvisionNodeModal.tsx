import { Waypoints } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { Branch } from "../companyBranches";

interface ProvisionNodeFormValues {
  name: string;
  region: string;
  nodeType: string;
  capacityTier: string;
}

interface ProvisionNodeModalProps {
  onClose: () => void;
  onAdd: (branch: Branch) => void;
}

function generateHubCode(): string {
  return `Hub ${String(Math.floor(10 + Math.random() * 89))}`;
}

// TODO: replace with real POST /customers/:id/branches/provision once the
// Customer Management API exists — this only stores the new node in local
// page state, not persisted anywhere. Distinct from AddBranchModal: this is
// the fast, auto-provisioned path (auto hub code, no named contact yet),
// vs. Add Branch's fully manual record.
export function ProvisionNodeModal({ onClose, onAdd }: ProvisionNodeModalProps) {
  const { control, handleSubmit } = useForm<ProvisionNodeFormValues>({
    defaultValues: { name: "", region: "", nodeType: "Regional Hub", capacityTier: "Medium" },
  });

  function onSubmit(values: ProvisionNodeFormValues) {
    const [city, state] = values.region.split(",").map((part) => part.trim());
    onAdd({
      id: `br-node-${Date.now()}`,
      name: values.name,
      city: city || values.region,
      state: state || "—",
      hubCode: generateHubCode(),
      primaryContact: "Unassigned",
      operatorsActive: 0,
      liveOrders: 0,
      delivered: 0,
      ytdSpend: 0,
      teamNames: [],
      teamOverflow: 0,
      nodeType: values.nodeType,
      capacityTier: values.capacityTier,
    });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <Waypoints className="h-5 w-5 text-primary" />
          Provision New Node
        </>
      }
      subtitle="Auto-configure a new network node — hub code and staffing are assigned automatically."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Provision Node
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="name" label="Node Name" placeholder="e.g. Pacific Northwest Hub" />
        <FormField control={control} name="region" label="Region" placeholder="e.g. Seattle, WA" />
        <FormField
          control={control}
          name="nodeType"
          label="Node Type"
          type="select"
          options={[
            { value: "Regional Hub", label: "Regional Hub" },
            { value: "Distribution Center", label: "Distribution Center" },
            { value: "Cross-Dock Facility", label: "Cross-Dock Facility" },
            { value: "Micro-Fulfillment", label: "Micro-Fulfillment" },
          ]}
        />
        <FormField
          control={control}
          name="capacityTier"
          label="Capacity Tier"
          type="select"
          options={[
            { value: "Small", label: "Small" },
            { value: "Medium", label: "Medium" },
            { value: "Large", label: "Large" },
          ]}
        />
      </div>
    </Modal>
  );
}
