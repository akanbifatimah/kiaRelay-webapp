import { Controller, useForm } from "react-hook-form";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Switch } from "../../../components/Switch";
import { useToast } from "../../../components/toast/ToastContext";
import type { TeamMember } from "../../access/teamMembers";
import { saveNotificationPrefs, useNotificationPrefs } from "../accountStore";
import { notificationsFor, type NotificationPrefs } from "../notificationCatalog";

// Alerts differ per admin: only notification types for modules this member
// can access are listed (notificationCatalog.ts), so a Finance Admin sees
// payout/invoice alerts and a Marketing Admin sees campaign alerts.
export function NotificationsCard({ member }: { member: TeamMember }) {
  const { showToast } = useToast();
  const saved = useNotificationPrefs(member.id);
  const types = notificationsFor(member);
  const groups = [...new Set(types.map((type) => type.group))];
  const { control, handleSubmit, reset, formState } = useForm<{ prefs: NotificationPrefs }>({ defaultValues: { prefs: saved } });

  const onSubmit = handleSubmit((values) => {
    saveNotificationPrefs(member.id, values.prefs);
    reset(values);
    showToast("success", "Notification preferences saved.");
  });

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text">Notifications</h2>
        <p className="text-xs text-text-muted">Alerts for the areas you have access to. Choose how each one reaches you.</p>
      </div>
      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-label text-text-muted">{group}</p>
              <div className="text-label flex w-28 justify-between text-text-muted">
                <span>Email</span>
                <span>In-app</span>
              </div>
            </div>
            {types
              .filter((type) => type.group === group)
              .map((type) => (
                <div key={type.id} className="flex items-center justify-between gap-4 rounded-lg bg-bg px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text">{type.title}</p>
                    <p className="text-xs text-text-muted">{type.description}</p>
                  </div>
                  <div className="flex w-28 shrink-0 justify-between">
                    <Controller
                      name={`prefs.${type.id}.email`}
                      control={control}
                      render={({ field }) => <Switch checked={type.lockedEmail || field.value} onChange={field.onChange} disabled={type.lockedEmail} label={`${type.title} by email`} />}
                    />
                    <Controller
                      name={`prefs.${type.id}.inApp`}
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onChange={field.onChange} label={`${type.title} in-app`} />}
                    />
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" disabled={!formState.isDirty} onClick={() => reset({ prefs: saved })}>
          Cancel
        </Button>
        <Button disabled={!formState.isDirty} onClick={onSubmit}>
          Save Preferences
        </Button>
      </div>
    </Card>
  );
}
