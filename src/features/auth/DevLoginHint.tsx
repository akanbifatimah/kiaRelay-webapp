import { DEV_PASSWORD } from "../access/teamMembersData";

const DEV_ACCOUNTS = [
  { role: "Super Admin", email: "akanbifatimah@gmail.com" },
  { role: "Operations Admin", email: "operations.admin@kiarelay.com" },
  { role: "Finance Admin", email: "finance.admin@kiarelay.com" },
  { role: "Marketing Admin", email: "marketing.admin@kiarelay.com" },
];

// Visible on every build unless VITE_SHOW_DEV_ACCOUNTS=false (see LoginPage).
// TODO: delete along with the mock login once the real POST /auth/login
// exists — and hide it before the app is public, since it lists passwords.
export function DevLoginHint() {
  return (
    <details className="mt-4 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-text-muted">
      <summary className="cursor-pointer font-medium text-text">Development accounts</summary>
      <ul className="mt-2 flex flex-col gap-1">
        {DEV_ACCOUNTS.map((account) => (
          <li key={account.email} className="flex justify-between gap-2">
            <span>{account.role}</span>
            <span className="font-mono">{account.email}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2">
        Default password: <span className="font-mono text-text">{DEV_PASSWORD}</span> (unless changed in My Account)
      </p>
    </details>
  );
}
