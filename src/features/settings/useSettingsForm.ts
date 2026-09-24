import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import { useToast } from "../../components/toast/ToastContext";
import { logAudit } from "../access/auditLog";
import { useCurrentUser } from "../access/permissions";
import { describeChanges } from "./settingsStore";

interface SettingsFormOptions<T extends FieldValues> {
  saved: T;
  save: (values: T) => void;
  /** e.g. "Company Settings" — toast + audit log target. */
  pageName: string;
  labels: Partial<Record<keyof T, string>>;
}

// Shared by the three Settings screens: stage edits in the form, persist on
// Save (with an audit entry listing what changed), revert on Cancel.
export function useSettingsForm<T extends FieldValues>({ saved, save, pageName, labels }: SettingsFormOptions<T>) {
  const { showToast } = useToast();
  const user = useCurrentUser();
  const form = useForm<T>({ defaultValues: saved as DefaultValues<T> });

  const onSave = form.handleSubmit(
    (values) => {
      save(values);
      logAudit({ actor: user?.name ?? "Unknown admin", category: "settings", action: `Saved ${pageName}`, target: pageName, detail: describeChanges(saved, values, labels) });
      form.reset(values);
      showToast("success", `${pageName} saved.`);
    },
    () => showToast("error", "Some fields need attention before saving."),
  );

  return {
    form,
    onSave,
    onCancel: () => form.reset(saved),
    isDirty: form.formState.isDirty,
  };
}
