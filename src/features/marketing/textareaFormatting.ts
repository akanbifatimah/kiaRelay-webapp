// Real, zero-dependency text formatting for the plain <textarea> message
// editors across Marketing (Email/Newsletter/Template compose) — wraps the
// current selection in markdown-style markers, same mechanic GitHub's own
// comment-box toolbar uses. Rendered previews (MessageBlocks.tsx) interpret
// this same markdown back into styled output.
export interface FormatResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export function wrapSelection(el: HTMLTextAreaElement, before: string, after: string, placeholder: string): FormatResult {
  const { selectionStart, selectionEnd, value } = el;
  const selected = value.slice(selectionStart, selectionEnd) || placeholder;
  const next = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
  const start = selectionStart + before.length;
  return { value: next, selectionStart: start, selectionEnd: start + selected.length };
}

export function insertAtCursor(el: HTMLTextAreaElement, text: string): FormatResult {
  const { selectionStart, selectionEnd, value } = el;
  const next = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
  const cursor = selectionStart + text.length;
  return { value: next, selectionStart: cursor, selectionEnd: cursor };
}

// react-hook-form re-renders the textarea's value on every keystroke, which
// resets native cursor/selection state — restoring it has to happen after
// that re-render commits, hence the double rAF (one frame for React's
// commit, one to be safe across browsers).
export function applyFormatResult(el: HTMLTextAreaElement, onChange: (value: string) => void, result: FormatResult): void {
  onChange(result.value);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  });
}
