interface EmailRenderedPreviewProps {
  headline: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
}

// A "block" is a blank-line-separated chunk of the message. A block whose
// first line ends in ":" renders as a titled, left-bordered details box
// (e.g. "Key Program Details:") — everything else renders as plain
// paragraphs, one per line within the block.
function renderBlock(block: string[], key: number) {
  const [first, ...rest] = block;
  if (rest.length > 0 && first.trim().endsWith(":")) {
    return (
      <div key={key} className="flex flex-col gap-1.5 border-l-4 border-primary bg-bg px-4 py-3">
        <p className="text-sm font-semibold text-text">{first}</p>
        {rest.map((line, i) => (
          <p key={i} className="text-sm text-text-muted">
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div key={key} className="flex flex-col gap-3">
      {block.map((line, i) => (
        <p key={i} className="text-sm leading-relaxed text-text-muted">
          {line}
        </p>
      ))}
    </div>
  );
}

// The rendered "what the recipient sees" card — black KIARELAY banner, hero
// image, headline + body, CTA, footer — matching the Email Preview
// screenshot exactly, including its own hero image asset.
export function EmailRenderedPreview({ headline, message, actionLabel, actionUrl }: EmailRenderedPreviewProps) {
  const blocks = message.split("\n\n").map((block) => block.split("\n"));

  return (
    <div className="mx-auto flex w-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-center bg-black py-4">
        <span className="text-lg font-bold tracking-widest text-white">KIARELAY</span>
      </div>
      <img src="/Email Hero Image.svg" alt="" className="h-40 w-full object-cover" />
      <div className="flex flex-col gap-4 p-6">
        <h2 className="text-lg font-semibold text-text">{headline}</h2>
        {blocks.map((block, i) => renderBlock(block, i))}
        {actionLabel && (
          <a
            href={actionUrl}
            onClick={(event) => event.preventDefault()}
            className="inline-block w-fit rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white"
          >
            {actionLabel}
          </a>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 border-t border-border p-4 text-center text-xs text-text-muted">
        <span>© 2023 KiaRelay Logistics Command. All rights reserved.</span>
        <span>100 Logistics Blvd, Suite 400, Chicago, IL 60601</span>
        <span>
          <button type="button" className="font-medium hover:underline">Manage Preferences</button>
          {" | "}
          <button type="button" className="font-medium hover:underline">Unsubscribe</button>
        </span>
      </div>
    </div>
  );
}
