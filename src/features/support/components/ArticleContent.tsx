import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { parseInlineMarkdown } from "../../marketing/parseInlineMarkdown";

// Renders the Knowledge Base's markdown-ish article body. Supported blocks
// (blank-line separated): "#"/"##"/"###" headings, "- " bullets, "1. "
// numbered lists, "> [!warning|info] Title" callouts (following "> " lines
// are the body), ``` fenced code, and a lone "![alt](url)" image. Everything
// else is a paragraph with inline **bold** / *italic* / __underline__ /
// [links](url) via marketing's shared parseInlineMarkdown. This is the
// same syntax ArticleEditorToolbar writes.
const IMAGE = /^!\[(.*?)\]\((.+?)\)$/;
const CALLOUT = /^> \[!(warning|info)\]\s*(.*)$/;

function inline(text: string, key: string): ReactNode[] {
  return parseInlineMarkdown(text, key);
}

function renderBlock(block: string, key: number): ReactNode {
  const lines = block.split("\n");
  const first = lines[0];
  const k = `b${key}`;

  if (block.startsWith("```")) {
    return (
      <pre key={k} className="overflow-x-auto rounded-lg bg-sidebar px-4 py-3 text-xs text-white">
        <code>{lines.slice(1, lines[lines.length - 1].startsWith("```") ? -1 : undefined).join("\n")}</code>
      </pre>
    );
  }
  const heading = first.match(/^(#{1,3})\s+(.*)$/);
  if (heading && lines.length === 1) {
    const [, hashes, text] = heading;
    if (hashes.length === 1) return <h2 key={k} className="mt-2 text-2xl font-bold text-text">{inline(text, k)}</h2>;
    if (hashes.length === 2) return <h3 key={k} className="mt-2 text-xl font-bold text-text">{inline(text, k)}</h3>;
    return <h4 key={k} className="mt-1 text-base font-semibold text-text">{inline(text, k)}</h4>;
  }
  const callout = first.match(CALLOUT);
  if (callout) {
    const [, tone, title] = callout;
    const Icon = tone === "warning" ? AlertTriangle : Info;
    return (
      <div key={k} className={tone === "warning" ? "flex gap-3 rounded-lg border-l-4 border-warning bg-bg p-4" : "flex gap-3 rounded-lg border-l-4 border-info bg-tag-info-bg/40 p-4"}>
        <Icon className={tone === "warning" ? "mt-0.5 h-4 w-4 shrink-0 text-warning" : "mt-0.5 h-4 w-4 shrink-0 text-info"} />
        <div>
          {title && <p className="font-semibold text-text">{inline(title, `${k}t`)}</p>}
          <p className="text-sm text-text">{inline(lines.slice(1).map((line) => line.replace(/^>\s?/, "")).join(" "), `${k}c`)}</p>
        </div>
      </div>
    );
  }
  if (lines.every((line) => line.startsWith("- "))) {
    return (
      <ul key={k} className="list-disc space-y-1 pl-6 text-text">
        {lines.map((line, i) => <li key={i}>{inline(line.slice(2), `${k}-${i}`)}</li>)}
      </ul>
    );
  }
  if (lines.every((line) => /^\d+\.\s/.test(line))) {
    return (
      <ol key={k} className="list-decimal space-y-1 pl-6 text-text">
        {lines.map((line, i) => <li key={i}>{inline(line.replace(/^\d+\.\s/, ""), `${k}-${i}`)}</li>)}
      </ol>
    );
  }
  const image = lines.length === 1 ? first.trim().match(IMAGE) : null;
  if (image) return <img key={k} src={image[2]} alt={image[1]} className="max-h-96 rounded-lg border border-border object-contain" />;
  return (
    <p key={k} className="leading-relaxed text-text">
      {lines.flatMap((line, i) => (i === 0 ? inline(line, `${k}-${i}`) : [<br key={`${k}-br${i}`} />, ...inline(line, `${k}-${i}`)]))}
    </p>
  );
}

// Code fences can contain blank lines, so split on them only outside ```.
function splitBlocks(content: string): string[] {
  const blocks: string[] = [];
  let current: string[] = [];
  let inFence = false;
  content.split("\n").forEach((line) => {
    if (line.startsWith("```")) inFence = !inFence;
    if (!inFence && line.trim() === "" && !line.startsWith("```")) {
      if (current.length) blocks.push(current.join("\n"));
      current = [];
    } else current.push(line);
  });
  if (current.length) blocks.push(current.join("\n"));
  return blocks;
}

export function ArticleContent({ content }: { content: string }) {
  if (!content.trim()) return <p className="text-text-muted">This article has no content yet.</p>;
  return <div className="flex flex-col gap-4 text-[15px]">{splitBlocks(content).map(renderBlock)}</div>;
}
