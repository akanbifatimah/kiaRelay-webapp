export function DisputeResolutionCard({ customerName }: { customerName: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-sidebar p-5 text-white">
      <h3 className="text-label text-white/70">Automated Dispute Resolution</h3>
      <p className="text-body text-white/80">
        {customerName} has a claim resolution rate of 100%. We suggest using the automated flow for any future
        express delays.
      </p>
      <button
        type="button"
        className="w-fit rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
      >
        View Claims History
      </button>
    </div>
  );
}
