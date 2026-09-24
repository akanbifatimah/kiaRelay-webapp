export const IMAGE_TYPES = ["image/png", "image/svg+xml", "image/jpeg"];
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

interface PrepareImageOptions {
  maxWidth: number;
  maxHeight: number;
  /** Center-crop to a square first (avatars). */
  square?: boolean;
}

/**
 * Validates an uploaded image (PNG/SVG/JPG, ≤2MB) and returns a data URL
 * small enough to keep in localStorage: SVGs pass through, raster images are
 * downscaled via a canvas. Promoted from settings/prepareLogo.ts (2026-09-24)
 * once My Account's profile photo needed the same thing.
 * TODO: upload to object storage once the backend exists and store the
 * returned URL instead of a data URL.
 */
export async function prepareImage(file: File, { maxWidth, maxHeight, square }: PrepareImageOptions): Promise<string> {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error("Use a PNG, SVG or JPG file.");
  if (file.size > IMAGE_MAX_BYTES) throw new Error("That file is over 2MB — please use a smaller image.");
  const dataUrl = await readAsDataUrl(file);
  if (file.type === "image/svg+xml") return dataUrl;

  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("That image couldn't be opened."));
    image.src = dataUrl;
  });
  const side = Math.min(image.width, image.height);
  const source = square
    ? { x: (image.width - side) / 2, y: (image.height - side) / 2, width: side, height: side }
    : { x: 0, y: 0, width: image.width, height: image.height };
  const scale = Math.min(1, maxWidth / source.width, maxHeight / source.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  canvas.getContext("2d")?.drawImage(image, source.x, source.y, source.width, source.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}
