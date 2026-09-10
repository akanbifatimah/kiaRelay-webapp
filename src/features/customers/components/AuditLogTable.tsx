import type { AuditLogEntry } from "../supportTickets";

export function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  if (entries.length === 0) {
    return <p className="py-6 text-center text-sm text-text-muted">No audit log entries yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-label text-text-muted">
            <th className="pb-2 font-medium">Action</th>
            <th className="pb-2 font-medium">Actor</th>
            <th className="pb-2 font-medium">Details</th>
            <th className="pb-2 font-medium">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-t border-border">
              <td className="py-2 font-medium text-text">{entry.action}</td>
              <td className="py-2 text-text-muted">{entry.actor}</td>
              <td className="py-2 text-text-muted">{entry.details}</td>
              <td className="py-2 text-text-muted">{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
