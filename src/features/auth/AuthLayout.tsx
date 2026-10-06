import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  /** Wider card for multi-field forms (Business registration). */
  wide?: boolean;
  /** Renders a "Back" link in the sticky header, pointing here. */
  backTo?: string;
}

// Shared by every auth screen (welcome, sign-in, registration, password
// reset) — same background pattern, overlay, card, and logo. The logo and
// Back link sit in a sticky header (2026-09-28) so long forms scroll
// underneath it instead of taking the header off-screen.
export function AuthLayout({ children, wide = false, backTo }: AuthLayoutProps) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-bg p-4"
      style={{ backgroundImage: "url(/login-background-tile.webp)", backgroundRepeat: "repeat" }}
    >
      {/* Softens the pattern to match how faint it reads in Figma. Confirmed
          via Figma's frame Colors panel: #F5F3F5, effectively identical to
          our --color-bg (#f4f5f7) — reuse the token rather than a raw hex. */}
      <div className="absolute inset-0 bg-bg/70" />
      <div className={`relative w-full rounded-(--radius-card) bg-surface shadow-lg ${wide ? "max-w-xl" : "max-w-sm"}`}>
        <header className="sticky top-0 z-10 flex items-center justify-center rounded-t-(--radius-card) border-b border-border bg-surface px-8 py-3">
          {backTo && (
            <Link to={backTo} className="absolute left-6 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 text-sm text-text-muted hover:text-text">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          )}
          <img src="/brand/kiarelay-logo.png" alt="KiaRelay" className="h-14 w-auto" />
        </header>
        <div className="px-8 pb-8 pt-6">{children}</div>
      </div>
    </div>
  );
}
