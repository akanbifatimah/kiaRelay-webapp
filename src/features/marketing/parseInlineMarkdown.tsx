import type { ReactNode } from "react";

// Matches, in priority order: **bold**, __underline__, *italic*,
// [text](url). Order matters — bold's ** must be tried before italic's
// single *, or "**x**" would parse as italic("*x*") with stray asterisks.
const INLINE_PATTERN = /\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;

// The render-side half of textareaFormatting.ts's markdown-style wrapping —
// interprets what the formatting toolbar writes into a message textarea.
export function parseInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [, bold, underline, italic, linkText, linkUrl] = match;
    const key = `${keyPrefix}-${i}`;
    if (bold !== undefined) nodes.push(<strong key={key}>{bold}</strong>);
    else if (underline !== undefined) nodes.push(<u key={key}>{underline}</u>);
    else if (italic !== undefined) nodes.push(<em key={key}>{italic}</em>);
    else if (linkText !== undefined) {
      nodes.push(
        <a key={key} href={linkUrl} onClick={(event) => event.preventDefault()} className="text-primary underline">
          {linkText}
        </a>,
      );
    }
    lastIndex = INLINE_PATTERN.lastIndex;
    i += 1;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
