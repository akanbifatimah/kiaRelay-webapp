import { parseInlineMarkdown } from "../parseInlineMarkdown";

interface MessageBlocksProps {
  message: string;
}

const IMAGE_LINE = /^!\[(.*?)\]\((.+?)\)$/;

// A "block" is a blank-line-separated chunk of the message — the toolbar in
// FormattingToolbar.tsx inserts images and dividers as their own block, and
// wraps bold/italic/underline/links inline within a block's text.
//
// A single-line block matching an image or "---" divider renders as such. A
// block whose first line ends in ":" renders as a titled, left-bordered
// details box (e.g. "Key Program Details:"). Everything else renders as
// plain paragraphs, one per line, with inline markdown applied.
export function MessageBlocks({ message }: MessageBlocksProps) {
  const blocks = message.split("\n\n").map((block) => block.split("\n"));

  return (
    <>
      {blocks.map((block, key) => {
        if (block.length === 1) {
          const line = block[0].trim();
          const imageMatch = line.match(IMAGE_LINE);
          if (imageMatch) return <img key={key} src={imageMatch[2]} alt={imageMatch[1]} className="w-full rounded-md object-cover" />;
          if (line === "---") return <hr key={key} className="border-border" />;
        }

        const [first, ...rest] = block;
        if (rest.length > 0 && first.trim().endsWith(":")) {
          return (
            <div key={key} className="flex flex-col gap-1.5 border-l-4 border-primary bg-bg px-4 py-3">
              <p className="text-sm font-semibold text-text">{parseInlineMarkdown(first, `${key}-title`)}</p>
              {rest.map((line, i) => (
                <p key={i} className="text-sm text-text-muted">
                  {parseInlineMarkdown(line, `${key}-${i}`)}
                </p>
              ))}
            </div>
          );
        }

        return (
          <div key={key} className="flex flex-col gap-3">
            {block.map((line, i) => (
              <p key={i} className="text-sm leading-relaxed text-text-muted">
                {parseInlineMarkdown(line, `${key}-${i}`)}
              </p>
            ))}
          </div>
        );
      })}
    </>
  );
}
