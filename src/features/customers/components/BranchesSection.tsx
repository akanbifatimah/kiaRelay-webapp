import { useState } from "react";
import { BranchCard } from "./BranchCard";
import { AddNewNodeCard } from "./AddNewNodeCard";
import { ProvisionNodeModal } from "./ProvisionNodeModal";
import { BranchDetailModal } from "./BranchDetailModal";
import { EditBranchModal } from "./EditBranchModal";
import type { Branch } from "../companyBranches";

interface BranchesSectionProps {
  branches: Branch[];
  onAdd: (branch: Branch) => void;
  onUpdate: (branch: Branch) => void;
}

export function BranchesSection({ branches, onAdd, onUpdate }: BranchesSectionProps) {
  const [isProvisionNodeOpen, setIsProvisionNodeOpen] = useState(false);
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {branches.map((branch) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          onView={() => setViewingBranch(branch)}
          onEdit={() => setEditingBranch(branch)}
        />
      ))}
      <AddNewNodeCard onClick={() => setIsProvisionNodeOpen(true)} />

      {isProvisionNodeOpen && (
        <ProvisionNodeModal onClose={() => setIsProvisionNodeOpen(false)} onAdd={onAdd} />
      )}
      {viewingBranch && <BranchDetailModal branch={viewingBranch} onClose={() => setViewingBranch(null)} />}
      {editingBranch && (
        <EditBranchModal branch={editingBranch} onClose={() => setEditingBranch(null)} onSave={onUpdate} />
      )}
    </div>
  );
}
