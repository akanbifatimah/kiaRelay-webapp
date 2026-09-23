import { Avatar } from "../../../components/Avatar";
import { cn } from "../../../lib/cn";
import type { SupportAgent } from "../types";

interface AgentSelectListProps {
  agents: SupportAgent[];
  value: string;
  onChange: (agentId: string) => void;
}

// Radio list from the Manual Assignment modal: Offline agents render faded
// and can't be picked, everyone else shows their live load on the right
// (SLA-at-risk in red when non-zero, green when clear).
export function AgentSelectList({ agents, value, onChange }: AgentSelectListProps) {
  if (agents.length === 0) {
    return <p className="rounded-lg border border-border py-6 text-center text-sm text-text-muted">No agents match your search.</p>;
  }

  return (
    <div role="radiogroup" className="divide-y divide-border overflow-hidden rounded-lg border border-border">
      {agents.map((agent) => {
        const offline = agent.availability === "offline";
        const selected = agent.id === value;
        return (
          <label
            key={agent.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              selected && "bg-primary/5",
              offline ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-bg",
            )}
          >
            <input
              type="radio"
              name="agent"
              value={agent.id}
              checked={selected}
              disabled={offline}
              onChange={() => onChange(agent.id)}
              className="h-4 w-4 accent-primary"
            />
            <Avatar name={agent.name} src={agent.avatar} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text">{agent.name}</p>
              <p className="truncate text-xs text-text-muted">{agent.role}</p>
            </div>
            {offline ? (
              <span className="text-xs text-text-muted">Offline</span>
            ) : (
              <div className="text-right">
                <p className="text-sm font-semibold text-text">{agent.openTickets} Open</p>
                <p className={cn("text-xs", agent.slaAtRisk > 0 ? "text-danger" : "text-success")}>
                  {agent.slaAtRisk} SLA at risk
                </p>
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
}
