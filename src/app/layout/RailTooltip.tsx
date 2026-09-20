import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface RailTooltipProps {
  label: string;
  children: ReactNode;
}

// Portal-based, unlike the shared CSS-only Tooltip (src/components/Tooltip):
// the collapsed sidebar's icon rail lives inside <nav className=
// "overflow-y-auto">, and per the CSS overflow spec, setting one axis to
// anything but "visible" forces the browser to compute the other axis as
// "auto" too — so a CSS-positioned tooltip escaping to the right of the
// rail was getting silently clipped by nav's own vertical scroll container,
// which is why link names weren't showing on hover. This measures the
// trigger's position on hover/focus and portals the label straight to
// document.body, escaping every ancestor's overflow.
export function RailTooltip({ label, children }: RailTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  function show() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ top: rect.top + rect.height / 2, left: rect.right + 8 });
  }

  function hide() {
    setPosition(null);
  }

  return (
    <span ref={triggerRef} className="block w-full" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {position &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none fixed z-50 -translate-y-1/2 whitespace-nowrap rounded-md bg-sidebar px-2 py-1 text-xs font-medium text-white shadow-md"
            style={{ top: position.top, left: position.left }}
          >
            {label}
          </span>,
          document.body,
        )}
    </span>
  );
}
