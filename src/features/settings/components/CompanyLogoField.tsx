import { useRef, useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { ImageOff, Trash2, Upload } from "lucide-react";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { LOGO_TYPES, prepareLogo } from "../prepareLogo";
import type { CompanySettings } from "../settingsStore";

// "Company Logo" card body. The logo is a normal form field (logoUrl), so an
// upload/removal is staged like every other edit and only persists on Save
// Changes. Once saved, a custom logo also replaces the sidebar mark.
export function CompanyLogoField({ control }: { control: Control<CompanySettings> }) {
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <Controller
      name="logoUrl"
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className="flex flex-col gap-2">
          <p className="text-label text-text-muted">Current Asset</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-24 w-44 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-bg p-2">
              {value ? (
                <img src={value} alt="Company logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-xs text-text-muted">
                  <ImageOff className="h-5 w-5" />
                  No logo
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text hover:bg-bg"
                >
                  <Upload className="h-4 w-4" />
                  Upload New Logo
                </button>
                {value && (
                  <button type="button" onClick={() => setConfirmRemove(true)} className="flex items-center gap-1.5 px-2 py-2 text-sm text-danger hover:underline">
                    <Trash2 className="h-4 w-4" />
                    Remove Logo
                  </button>
                )}
              </div>
              <p className="text-xs text-text-muted">PNG, SVG, or JPG (max 2MB), recommended 400×100px</p>
              <ul className="flex flex-wrap gap-x-4 text-[11px] text-text-muted">
                <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" />Vector (scalable) preferred</li>
                <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-text-muted" />Transparent background recommended</li>
              </ul>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={LOGO_TYPES.join(",")}
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              try {
                onChange(await prepareLogo(file));
                showToast("success", "Logo staged — save changes to apply it.");
              } catch (error) {
                showToast("error", error instanceof Error ? error.message : "That logo couldn't be used.");
              }
            }}
          />
          {confirmRemove && (
            <ConfirmModal
              title="Remove company logo?"
              message="Receipts, bills of lading and driver app headers will fall back to the plain company name once you save."
              confirmLabel="Remove Logo"
              tone="danger"
              onCancel={() => setConfirmRemove(false)}
              onConfirm={() => {
                onChange(null);
                setConfirmRemove(false);
              }}
            />
          )}
        </div>
      )}
    />
  );
}
