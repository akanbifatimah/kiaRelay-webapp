import type { ReactNode } from "react";

// Shared by Login, Forgot Password, and Reset Password — same background
// pattern, overlay, card, and logo across all three auth screens.
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-bg p-4"
      style={{ backgroundImage: "url(/login-background-tile.webp)", backgroundRepeat: "repeat" }}
    >
      {/* Softens the pattern to match how faint it reads in Figma. Confirmed
          via Figma's frame Colors panel: #F5F3F5, effectively identical to
          our --color-bg (#f4f5f7) — reuse the token rather than a raw hex. */}
      <div className="absolute inset-0 bg-bg/70" />
      <div className="relative w-full max-w-sm rounded-[var(--radius-card)] bg-surface p-8 shadow-lg">
        <div className="flex flex-col items-center pb-4 text-center">
          <img
            src="/kia-relay-logo.svg"
            alt="KiaRelay — Connected Logistics. Delivered."
            className="h-24 w-auto"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
