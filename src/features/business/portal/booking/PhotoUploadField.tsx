import { Camera, X } from "lucide-react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Tooltip } from "../../../../components/Tooltip";
import type { DeliveryPhoto } from "../../deliveries/deliveryTypes";

const MAX_INLINE = 300 * 1024;

/** Small images keep a data URL (viewable by admins in the mock); larger
 * ones a session-only object URL. TODO: upload to the API and keep its URL. */
function readPhoto(file: File): Promise<DeliveryPhoto> {
  if (file.size > MAX_INLINE) return Promise.resolve({ name: file.name, uri: URL.createObjectURL(file) });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, uri: String(reader.result) });
    reader.readAsDataURL(file);
  });
}

interface PhotoUploadFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  title: string;
  max?: number;
}

/** "Photographs": an Add Photo tile, then thumbnails with remove in one row
 * that scrolls sideways, so the card keeps its height (2026-10-05). */
export function PhotoUploadField<T extends FieldValues>({ control, name, title, max = 6 }: PhotoUploadFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const photos = (value ?? []) as DeliveryPhoto[];
        return (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-base font-semibold text-text">{title}</h2>
              {photos.length > 0 && <span className="text-xs text-text-muted">{`${photos.length} of ${max} added`}</span>}
            </div>
            <div className="flex gap-3">
              {/* relative: keeps the sr-only (absolute) input inside the tile; without it
                  the input sits far down the page, stretching it, and focusing it
                  scrolls the whole window, leaving blank space (2026-10-05). */}
              {photos.length < max && (
                <label className="relative flex h-28 w-28 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-text-muted/50 text-xs font-medium text-text hover:border-primary">
                  <Camera className="h-5 w-5" />
                  Add Photo
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className="sr-only"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? []).slice(0, max - photos.length);
                      e.target.value = "";
                      onChange([...photos, ...(await Promise.all(files.map(readPhoto)))]);
                    }}
                  />
                </label>
              )}
              {/* w-0 + flex-1: takes the leftover width but adds nothing to the card's own
                  minimum width, so it scrolls instead of widening the form on small screens.
                  The fixed height leaves room for the scrollbar, so the card is the same
                  height with 0 or 6 photos. */}
              <div className="flex h-32 w-0 min-w-0 flex-1 gap-3 overflow-x-auto">
                {photos.map((photo) => (
                  <div key={photo.uri} className="relative h-28 w-28 shrink-0">
                    <img src={photo.uri} alt={photo.name} className="h-full w-full rounded-lg object-cover" />
                    {/* Positioned on a wrapper: Tooltip's own `relative` beats an `absolute` passed to it. */}
                    <span className="absolute right-1.5 top-1.5">
                      <Tooltip label="Remove photo" side="bottom">
                        <button type="button" aria-label="Remove photo" onClick={() => onChange(photos.filter((p) => p.uri !== photo.uri))} className="rounded-full bg-sidebar/70 p-1 text-white">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </Tooltip>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
