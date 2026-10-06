// Regenerates every KiaRelay logo asset, for this web app and the customer
// mobile app, from the one source artwork: public/Kiarelay Logo.png.
//
//   node scripts/build-brand-assets.mjs
//
// Outputs (web):   public/brand/kiarelay-{logo,mark}.png, favicons, app icons
// Outputs (mobile, ../kiarelay-customer-mobile/assets/images):
//   brand/logo.png          full lockup, for light backgrounds
//   brand/logo-on-dark.png  reversed lockup (navy → white), for the navy splash
//   icon.png, favicon.png, splash-icon.png, android-icon-{foreground,background,monochrome}.png
import fs from "node:fs";
import sharp from "sharp";

const SOURCE = "public/Kiarelay Logo.png";
const MOBILE = "../kiarelay-customer-mobile/assets/images";
/** The KR mark sits above the wordmark in the source (2041×989). */
const MARK_REGION = { left: 360, top: 0, width: 1270, height: 670 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

const clamp = (v) => Math.min(1, Math.max(0, v));

/** Pads an image to a centred square. */
async function square(buffer) {
  const { width, height } = await sharp(buffer).metadata();
  const side = Math.max(width, height);
  const v = side - height;
  const h = side - width;
  return sharp(buffer).extend({ top: Math.floor(v / 2), bottom: Math.ceil(v / 2), left: Math.floor(h / 2), right: Math.ceil(h / 2), background: CLEAR }).png().toBuffer();
}

/** Recolors for dark backgrounds: navy → white, orange kept, white dashes cut out. */
async function onDark(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    const orange = clamp((r - b) / 243);
    const whiteness = clamp(((r + g + b) / 3 - 26) / 229);
    data[i] = Math.round(255 + (r - 255) * orange);
    data[i + 1] = Math.round(255 + (g - 255) * orange);
    data[i + 2] = Math.round(255 + (b - 255) * orange);
    data[i + 3] = Math.round(a * (orange + (1 - orange) * (1 - whiteness)));
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

/** Solid white silhouette (Android themed icon). */
async function silhouette(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) data[i] = data[i + 1] = data[i + 2] = 255;
  return sharp(data, { raw: info }).png().toBuffer();
}

/** `art` centred on a size×size canvas, filling `fill` of it. */
async function canvas(art, size, fill, background, file) {
  const inner = Math.round(size * fill);
  const scaled = await sharp(art).resize(inner, inner, { fit: "contain", background: CLEAR }).png().toBuffer();
  const offset = Math.round((size - inner) / 2);
  await sharp({ create: { width: size, height: size, channels: 4, background } }).composite([{ input: scaled, left: offset, top: offset }]).png({ compressionLevel: 9 }).toFile(file);
}

/** A .ico holding PNG images (every current browser reads these). */
async function ico(png512, file) {
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => sharp(png512).resize(s, s).png().toBuffer()));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = pngs.map((png, i) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(sizes[i], 0);
    entry.writeUInt8(sizes[i], 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  fs.writeFileSync(file, Buffer.concat([header, ...entries, ...pngs]));
}

const lockup = await sharp(SOURCE).trim().png().toBuffer();
const mark = await square(await sharp(SOURCE).extract(MARK_REGION).trim().png().toBuffer());

// Web
fs.mkdirSync("public/brand", { recursive: true });
await sharp(lockup).resize({ width: 640 }).png({ compressionLevel: 9 }).toFile("public/brand/kiarelay-logo.png");
await sharp(mark).resize(128, 128).png({ compressionLevel: 9 }).toFile("public/brand/kiarelay-mark.png");
for (const [size, file] of [[16, "favicon-16x16.png"], [32, "favicon-32x32.png"], [180, "apple-touch-icon.png"], [192, "android-chrome-192x192.png"], [512, "android-chrome-512x512.png"]]) {
  await canvas(mark, size, 0.76, WHITE, `public/${file}`);
}
await ico(fs.readFileSync("public/android-chrome-512x512.png"), "public/favicon.ico");

// Mobile
if (fs.existsSync(MOBILE)) {
  await sharp(lockup).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(`${MOBILE}/brand/logo.png`);
  const reversed = await onDark(lockup);
  await sharp(reversed).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(`${MOBILE}/brand/logo-on-dark.png`);
  await sharp(reversed).resize({ width: 600 }).png({ compressionLevel: 9 }).toFile(`${MOBILE}/splash-icon.png`);
  await canvas(mark, 1024, 0.76, WHITE, `${MOBILE}/icon.png`);
  await canvas(mark, 48, 0.8, WHITE, `${MOBILE}/favicon.png`);
  // Android adaptive icon: art inside the ~60% safe zone, on a plain white layer.
  await canvas(mark, 1024, 0.56, CLEAR, `${MOBILE}/android-icon-foreground.png`);
  await canvas(await silhouette(mark), 1024, 0.56, CLEAR, `${MOBILE}/android-icon-monochrome.png`);
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: WHITE } }).png().toFile(`${MOBILE}/android-icon-background.png`);
  console.log("mobile assets written");
} else {
  console.log("mobile repo not found — web assets only");
}
console.log("brand assets written");
