import { useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { ImagePlus, X, RefreshCw } from "lucide-react";
import { Tooltip } from "../../../components/Tooltip";
import type { CreateNewsletterFormValues } from "../createNewsletterForm";

interface NewsletterHeaderImageFieldProps {
  control: Control<CreateNewsletterFormValues>;
}

// Real upload via the File API (object URL) — was a disabled placeholder
// box. object-top keeps the top of the uploaded photo visible instead of
// center-cropping it away, which matters most for portrait/headshot photos
// in this short, wide banner slot.
export function NewsletterHeaderImageField({ control }: NewsletterHeaderImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name="headerImageUrl"
      control={control}
      render={({ field: { value, onChange } }) => (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                if (value) URL.revokeObjectURL(value);
                onChange(URL.createObjectURL(file));
              }
              event.target.value = "";
            }}
          />
          {value ? (
            <div className="relative overflow-hidden rounded-md border border-border">
              <img src={value} alt="Newsletter header" className="h-36 w-full object-cover object-top" />
              <div className="absolute right-2 top-2 flex gap-1.5">
                <Tooltip label="Replace image">
                  <button
                    type="button"
                    aria-label="Replace image"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </Tooltip>
                <Tooltip label="Remove image">
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => {
                      URL.revokeObjectURL(value);
                      onChange(null);
                    }}
                    className="rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Tooltip>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1 rounded-md border border-dashed border-border py-6 text-xs text-text-muted hover:bg-bg"
            >
              <ImagePlus className="h-5 w-5" />
              Click to upload header image
            </button>
          )}
        </>
      )}
    />
  );
}
