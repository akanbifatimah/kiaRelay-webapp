import { Controller } from "react-hook-form";
import { AtSign, Clock, Mail, Palette, Reply, Send } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { cn } from "../../lib/cn";
import { SettingsCard } from "./components/SettingsCard";
import { SettingsInput } from "./components/SettingsInput";
import { SettingsSaveBar } from "./components/SettingsSaveBar";
import { MarketingBrandPreview } from "./components/MarketingBrandPreview";
import { TIME_ZONES } from "./settingsOptions";
import { saveMarketingSettings, useMarketingSettings, type MarketingSettings } from "./settingsStore";
import { useSettingsForm } from "./useSettingsForm";

const LABELS: Partial<Record<keyof MarketingSettings, string>> = {
  senderName: "Sender name", fromEmail: "From email", replyTo: "Reply-to", footerText: "Footer", timeZone: "Time zone",
  sendWindowStart: "Send window start", sendWindowEnd: "Send window end", maxEmailsPerWeek: "Weekly limit", brandPrimary: "Header color", brandAccent: "Accent color",
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENDING_DOMAIN = "kiarelay.com";

// Marketing Settings (2026-09-24) — no design; built so the Marketing Admin
// has settings of their own, like Finance and Operations do. New newsletters
// take their sender name from here.
// TODO: the send pipeline (backend) should enforce the window, weekly limit
// and footer; the client only validates them.
export function MarketingSettingsPage() {
  const saved = useMarketingSettings();
  const { form, onSave, onCancel, isDirty } = useSettingsForm({ saved, save: saveMarketingSettings, pageName: "Marketing Settings", labels: LABELS });
  const { control } = form;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Marketing Settings" subtitle="Sender identity, compliance footer, send rules and brand styling for emails and newsletters." />

      <SettingsCard title="Sender Identity" subtitle="Who campaign emails come from, and where replies go." icon={Send}>
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsInput control={control} name="senderName" label="Default Sender Name" icon={<AtSign className="h-4 w-4" />} rules={{ required: "Sender name is required." }} />
          <SettingsInput
            control={control}
            name="fromEmail"
            label="From Email"
            type="email"
            icon={<Mail className="h-4 w-4" />}
            helper={`Must use the verified sending domain (@${SENDING_DOMAIN}).`}
            rules={{
              required: "From email is required.",
              validate: (value) => String(value).toLowerCase().endsWith(`@${SENDING_DOMAIN}`) || `Use an @${SENDING_DOMAIN} address — other domains fail SPF/DKIM checks.`,
            }}
          />
          <div className="sm:col-span-2">
            <SettingsInput control={control} name="replyTo" label="Reply-To Address" type="email" icon={<Reply className="h-4 w-4" />} rules={{ required: "Reply-to is required.", pattern: { value: EMAIL, message: "Enter a valid email address." } }} />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Compliance Footer" subtitle="Appended to every email and newsletter (CAN-SPAM requires a postal address and an unsubscribe link)." icon={Mail}>
        <Controller
          name="footerText"
          control={control}
          rules={{ validate: (value) => value.includes("{unsubscribe_link}") || "The footer must include {unsubscribe_link}." }}
          render={({ field, fieldState }) => (
            <label className="flex flex-col gap-1.5">
              <span className="text-label text-text-muted">Footer Text</span>
              <textarea {...field} rows={3} className={cn("rounded-md bg-bg px-3 py-2.5 text-sm text-text focus:outline-none", fieldState.error && "ring-1 ring-danger")} />
              {fieldState.error ? (
                <span className="text-xs text-danger">{fieldState.error.message}</span>
              ) : (
                <span className="text-xs text-text-muted">
                  <span className="font-mono">{"{unsubscribe_link}"}</span> becomes the recipient's one-click unsubscribe link.
                </span>
              )}
            </label>
          )}
        />
      </SettingsCard>

      <SettingsCard title="Send Rules" subtitle="Protect deliverability and avoid fatiguing customers." icon={Clock}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <SettingsInput control={control} name="timeZone" label="Scheduling Time Zone" options={TIME_ZONES} />
          </div>
          <SettingsInput control={control} name="sendWindowStart" label="Send Window Opens" type="time" rules={{ required: "Required." }} />
          <SettingsInput
            control={control}
            name="sendWindowEnd"
            label="Send Window Closes"
            type="time"
            helper="Scheduled sends outside the window wait for it to open."
            rules={{ validate: (value, values) => String(value) > values.sendWindowStart || "Must be later than the opening time." }}
          />
          <SettingsInput
            control={control}
            name="maxEmailsPerWeek"
            label="Max Emails per Customer per Week"
            type="number"
            suffix="emails"
            rules={{ validate: (value) => (Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 7) || "Enter a whole number from 1 to 7." }}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Brand Styling" subtitle="Colors applied to campaign email headers and buttons." icon={Palette}>
        <MarketingBrandPreview control={control} />
      </SettingsCard>

      <SettingsSaveBar isDirty={isDirty} dirtyMessage="Unsaved marketing changes — they apply to emails scheduled after you save." onCancel={onCancel} onSave={onSave} />
    </div>
  );
}
