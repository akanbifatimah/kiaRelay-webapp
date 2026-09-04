import { cn } from "../lib/cn";

const palette = [
  "bg-tag-freight-bg text-tag-freight-fg",
  "bg-tag-overnight-bg text-tag-overnight-fg",
  "bg-tag-express-bg text-tag-express-fg",
  "bg-tag-healthcare-bg text-tag-healthcare-fg",
  "bg-tag-standard-bg text-tag-standard-fg",
];

function paletteClasses(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md";
  shape?: "circle" | "square";
}

export function Avatar({ name, src, size = "md", shape = "circle" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = size === "sm" ? "h-6 w-6 text-xs" : "h-9 w-9 text-sm";
  const shapeClasses = shape === "circle" ? "rounded-full" : "rounded-md";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("object-cover", sizeClasses, shapeClasses)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium",
        sizeClasses,
        shapeClasses,
        paletteClasses(name),
      )}
    >
      {initials}
    </span>
  );
}
