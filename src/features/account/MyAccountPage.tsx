import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { roleMeta } from "../access/modules";
import { firstSettingsPath, useCurrentUser } from "../access/permissions";
import { ModuleChips, RoleBadge } from "../users/components/AccessBadges";
import { ProfileCard } from "./components/ProfileCard";
import { PasswordCard } from "./components/PasswordCard";
import { NotificationsCard } from "./components/NotificationsCard";
import { SessionsCard } from "./components/SessionsCard";

// My Account (2026-09-24, no design) — the personal settings every admin
// has regardless of role: profile, password, notifications (filtered to
// their modules) and sessions. Reached from the header avatar; no module
// needed. Business settings stay per area under /settings.
export function MyAccountPage() {
  const user = useCurrentUser();
  if (!user) return null;
  const settingsPath = firstSettingsPath(user);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Account" subtitle="Your profile, sign-in security and notification preferences." />

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-label text-text-muted">Your access</p>
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={user.role} />
            <ModuleChips role={user.role} modules={user.modules} max={8} />
          </div>
          <p className="text-xs text-text-muted">
            {roleMeta(user.role).description} Access is managed by a Super Admin in User Management.
          </p>
        </div>
        {settingsPath && (
          <Link to={settingsPath} className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-bg">
            <Settings className="h-4 w-4" />
            Your Area Settings
          </Link>
        )}
      </Card>

      {/* Keyed by id so forms re-seed if the Super Admin edits this user meanwhile. */}
      <ProfileCard key={`profile-${user.id}`} member={user} />
      <PasswordCard member={user} />
      <NotificationsCard key={`notif-${user.id}-${user.role}-${user.modules.join()}`} member={user} />
      <SessionsCard member={user} />
    </div>
  );
}
