import { MessageBlocks } from "./MessageBlocks";

interface EmailRenderedPreviewProps {
  headline: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
}

// The rendered "what the recipient sees" card — black KIARELAY banner, hero
// image, headline + body, CTA, footer — matching the Email Preview
// screenshot exactly, including its own hero image asset.
export function EmailRenderedPreview({ headline, message, actionLabel, actionUrl }: EmailRenderedPreviewProps) {
  return (
    <div className="mx-auto flex w-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-center bg-black py-4">
        <span className="text-lg font-bold tracking-widest text-white">KIARELAY</span>
      </div>
      <img src="/Email Hero Image.svg" alt="" className="h-40 w-full object-cover" />
      <div className="flex flex-col gap-4 p-6">
        <h2 className="text-lg font-semibold text-text">{headline}</h2>
        <MessageBlocks message={message} />
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
