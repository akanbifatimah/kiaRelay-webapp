import { Avatar } from "../../../components/Avatar";
import { cn } from "../../../lib/cn";
import { availabilityLabels } from "../teamWorkload";
import type { SupportAgent } from "../types";

interface AssigneeSearchResultsProps {
  agents: SupportAgent[];
  value: string;
  onChange: (agentId: string) => void;
}

// Reassign modal's result list — a denser single-select than Manual
// Assignment's radio list: the picked row gets an orange left rule instead
// of a radio dot, and the subtitle reads "Role • Availability".
export function AssigneeSearchResults({ agents, value, onChange }: AssigneeSearchResultsProps) {
  if (agents.length === 0) {
    return <p className="rounded-lg border border-border py-4 text-center text-sm text-text-muted">No available agents match.</p>;
  }

  return (
    <div role="listbox" className="max-h-48 divide-y divide-border overflow-y-auto rounded-lg border border-border">
      {agents.map((agent) => {
        const selected = agent.id === value;
        return (
          <button
            key={agent.id}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => onChange(agent.id)}
            className={cn(
              "flex w-full items-center gap-3 border-l-4 px-3 py-2 text-left",
              selected ? "border-l-primary bg-bg" : "border-l-transparent hover:bg-bg",
            )}
          >
            <Avatar name={agent.name} src={agent.avatar} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text">{agent.name}</p>
              <p className="truncate text-xs text-text-muted">
                {agent.role} • {agent.availability === "online" ? "Available" : availabilityLabels[agent.availability]}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
