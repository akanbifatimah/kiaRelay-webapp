import { Link } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { moduleLabel, roleMeta } from "../features/access/modules";
import { effectiveModules } from "../features/access/permissions";
import { useTeamMembers, type TeamMember } from "../features/access/teamMembers";

interface AccessRestrictedPageProps {
  area: string;
  user: TeamMember | undefined;
}

// Not in the designs (2026-09-23) — what an admin sees on a direct URL to a
// module they weren't granted: what they do have, and who can grant more.
export function AccessRestrictedPage({ area, user }: AccessRestrictedPageProps) {
  const superAdmins = useTeamMembers().filter((member) => member.role === "super-admin" && member.active && member.id !== user?.id);
  const modules = user ? effectiveModules(user) : [];

  return (
    <div className="flex justify-center py-10">
      <Card className="flex w-full max-w-lg flex-col items-center gap-5 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tag-danger-bg text-tag-danger-fg">
          <Lock className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-text">Access Restricted</h1>
          <p className="text-body mt-1 text-text-muted">
            Your account doesn't include access to <span className="font-medium text-text">{area}</span>.
          </p>
        </div>
        {user && (
          <div className="w-full rounded-lg bg-bg p-4 text-left text-sm">
            <p className="text-label text-text-muted">Your access · {roleMeta(user.role).label}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-surface px-2 py-0.5 text-xs text-text">Dashboard</span>
              {modules.map((module) => (
                <span key={module} className="rounded-md bg-surface px-2 py-0.5 text-xs text-text">
                  {moduleLabel(module)}
                </span>
              ))}
            </div>
          </div>
        )}
        {superAdmins.length > 0 && (
          <div className="flex w-full flex-col gap-1 text-left text-sm">
            <p className="text-label text-text-muted">Request access from a Super Admin</p>
            {superAdmins.map((admin) => (
              <a key={admin.id} href={`mailto:${admin.email}?subject=${encodeURIComponent(`Access request: ${area}`)}`} className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="h-3.5 w-3.5" />
                {admin.name} · {admin.email}
              </a>
            ))}
          </div>
        )}
        <Link to="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
