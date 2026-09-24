import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Camera, Trash2 } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { Tooltip } from "../../../components/Tooltip";
import { useToast } from "../../../components/toast/ToastContext";
import { IMAGE_TYPES, prepareImage } from "../../../lib/prepareImage";
import { logAudit } from "../../access/auditLog";
import { updateMember, type TeamMember } from "../../access/teamMembers";

interface ProfileValues {
  name: string;
  phone: string;
  title: string;
  avatarSrc: string;
}

// Personal details every admin can edit for themselves. Sign-in email, role
// and module access stay with the Super Admin (User Management).
export function ProfileCard({ member }: { member: TeamMember }) {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const saved: ProfileValues = { name: member.name, phone: member.phone ?? "", title: member.title, avatarSrc: member.avatarSrc ?? "" };
  const { control, handleSubmit, reset, formState } = useForm<ProfileValues>({ defaultValues: saved });

  const onSubmit = handleSubmit((values) => {
    updateMember(member.id, { name: values.name.trim(), phone: values.phone.trim() || undefined, title: values.title.trim() || member.title, avatarSrc: values.avatarSrc || undefined });
    logAudit({ actor: values.name, category: "users", action: "Updated own profile", target: member.email });
    reset(values);
    showToast("success", "Profile updated.");
  });

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text">Profile</h2>
        <p className="text-xs text-text-muted">How you appear to the rest of the team.</p>
      </div>
      <Controller
        name="avatarSrc"
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className="flex items-center gap-4">
            {value ? (
              <img src={value} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tag-freight-bg text-lg font-semibold text-tag-freight-fg">
                {member.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
              </span>
            )}
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-text hover:bg-bg">
                <Camera className="h-4 w-4" />
                Change Photo
              </button>
              {value && (
                <Tooltip label="Remove photo">
                  <button type="button" aria-label="Remove photo" onClick={() => onChange("")} className="rounded-md p-1.5 text-text-muted hover:text-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Tooltip>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={IMAGE_TYPES.join(",")}
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                try {
                  onChange(await prepareImage(file, { maxWidth: 256, maxHeight: 256, square: true }));
                } catch (error) {
                  showToast("error", error instanceof Error ? error.message : "That photo couldn't be used.");
                }
              }}
            />
          </div>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField control={control} name="name" label="Full Name" rules={{ required: "Your name is required." }} />
        <FormField control={control} name="title" label="Job Title" />
        <FormField
          control={control}
          name="phone"
          label="Phone Number"
          placeholder="+1 (713) 555-0192"
          rules={{ validate: (value) => !value || String(value).replace(/\D/g, "").length >= 10 || "Enter a full number, incl. country code." }}
        />
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">Sign-in Email</span>
          <input value={member.email} readOnly className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-muted" />
          <span className="text-xs text-text-muted">Only a Super Admin can change sign-in emails.</span>
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" disabled={!formState.isDirty} onClick={() => reset(saved)}>
          Cancel
        </Button>
        <Button disabled={!formState.isDirty} onClick={onSubmit}>
          Save Profile
        </Button>
      </div>
    </Card>
  );
}
