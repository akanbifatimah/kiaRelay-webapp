import type { FormatResult } from "../marketing/textareaFormatting";

export type BlockType = "p" | "h1" | "h2" | "h3";

const HEADING_PREFIX = /^#{1,3}\s+/;
const PREFIXES: Record<BlockType, string> = { p: "", h1: "# ", h2: "## ", h3: "### " };

/** Start/end offsets of the full lines the current selection touches. */
function lineRange(el: HTMLTextAreaElement): [number, number] {
  const { value, selectionStart, selectionEnd } = el;
  const start = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const endBreak = value.indexOf("\n", selectionEnd);
  return [start, endBreak === -1 ? value.length : endBreak];
}

function replaceLines(el: HTMLTextAreaElement, transform: (lines: string[]) => string[]): FormatResult {
  const [start, end] = lineRange(el);
  const replaced = transform(el.value.slice(start, end).split("\n")).join("\n");
  return { value: el.value.slice(0, start) + replaced + el.value.slice(end), selectionStart: start, selectionEnd: start + replaced.length };
}

/** The toolbar's "Normal Text / Heading" dropdown — swaps the line's prefix. */
export function setBlockType(el: HTMLTextAreaElement, type: BlockType): FormatResult {
  return replaceLines(el, (lines) => lines.map((line) => PREFIXES[type] + line.replace(HEADING_PREFIX, "")));
}

/** Current line's block type, so the dropdown reflects where the cursor is. */
export function currentBlockType(el: HTMLTextAreaElement): BlockType {
  const [start, end] = lineRange(el);
  const match = el.value.slice(start, end).match(/^(#{1,3})\s/);
  return match ? (["h1", "h2", "h3"] as const)[match[1].length - 1] : "p";
}

/** Bullet/numbered list toggle over every selected line. */
export function toggleList(el: HTMLTextAreaElement, kind: "bullet" | "numbered"): FormatResult {
  const pattern = kind === "bullet" ? /^- / : /^\d+\.\s/;
  return replaceLines(el, (lines) => {
    const allListed = lines.every((line) => pattern.test(line));
    return lines.map((line, i) => {
      const bare = line.replace(/^(- |\d+\.\s)/, "");
      if (allListed) return bare;
      return kind === "bullet" ? `- ${bare}` : `${i + 1}. ${bare}`;
    });
  });
}

/** Wraps the selection in a fenced code block on its own lines. */
export function wrapCodeBlock(el: HTMLTextAreaElement): FormatResult {
  const { value, selectionStart, selectionEnd } = el;
  const selected = value.slice(selectionStart, selectionEnd) || "code";
  const block = `\n\`\`\`\n${selected}\n\`\`\`\n`;
  const next = value.slice(0, selectionStart) + block + value.slice(selectionEnd);
  const start = selectionStart + 5;
  return { value: next, selectionStart: start, selectionEnd: start + selected.length };
}
