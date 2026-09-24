export const LOGO_TYPES = ["image/png", "image/svg+xml", "image/jpeg"];
export const LOGO_MAX_BYTES = 2 * 1024 * 1024;

const MAX_WIDTH = 800;
const MAX_HEIGHT = 200;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Validates an uploaded logo and returns a data URL small enough to keep in
 * localStorage: SVGs pass through as-is, PNG/JPG are downscaled to fit
 * 800×200 (2× the recommended 400×100) via a canvas.
 * TODO: upload to object storage via POST /admin/settings/logo once the
 * backend exists, and store the returned URL instead.
 */
export async function prepareLogo(file: File): Promise<string> {
  if (!LOGO_TYPES.includes(file.type)) throw new Error("Use a PNG, SVG or JPG file.");
  if (file.size > LOGO_MAX_BYTES) throw new Error("That file is over 2MB — please use a smaller logo.");
  const dataUrl = await readAsDataUrl(file);
  if (file.type === "image/svg+xml") return dataUrl;

  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("That image couldn't be opened."));
    image.src = dataUrl;
  });
  const scale = Math.min(1, MAX_WIDTH / image.width, MAX_HEIGHT / image.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}
