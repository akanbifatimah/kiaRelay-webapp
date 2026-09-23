function formatSpan(minutes: number): string {
  const abs = Math.abs(minutes);
  if (abs < 60) return `${abs}m`;
  if (abs < 1440) return `${Math.round(abs / 60)}h`;
  return `${Math.round(abs / 1440)}d`;
}

/** "10m" / "-1h" — the compact SLA chip in Manual Assignment's banner. */
export function formatSlaShort(minutesLeft: number): string {
  return minutesLeft < 0 ? `-${formatSpan(minutesLeft)}` : formatSpan(minutesLeft);
}

/** "5 mins ago" / "4 hrs ago" / "2 days ago" — Created and Last Activity columns. */
export function formatMinutesAgo(minutes: number): string {
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  if (minutes < 1440) {
    const hours = Math.round(minutes / 60);
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.round(minutes / 1440);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** "(-1h)" once breached, "(15m left)" otherwise — Unassigned's SLA column. */
export function formatSlaWindow(minutesLeft: number): string {
  return minutesLeft < 0 ? `(-${formatSpan(minutesLeft)})` : `(${formatSpan(minutesLeft)} left)`;
}

/** "45m remaining" / "2h 15m remaining" — My Tickets' SLA column. */
export function formatSlaRemaining(minutesLeft: number): string {
  if (minutesLeft < 0) return `${formatSpan(minutesLeft)} overdue`;
  const hours = Math.floor(minutesLeft / 60);
  const mins = minutesLeft % 60;
  if (hours === 0) return `${mins}m remaining`;
  return mins === 0 ? `${hours}h remaining` : `${hours}h ${mins}m remaining`;
}
