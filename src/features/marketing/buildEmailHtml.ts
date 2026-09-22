import type { CreateEmailFormValues } from "./createEmailForm";

// Real "download as HTML" — no email-rendering library installed (rule:
// don't add dependencies silently), so this builds a minimal standalone
// HTML document from the compose form's own fields, same zero-dependency
// approach as downloadInvoicePdf.ts.
export function buildEmailHtml(values: CreateEmailFormValues): string {
  const paragraphs = values.message
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p style="margin:0 0 16px;color:#191C1E;line-height:1.5;">${line}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${values.subject}</title>
  </head>
  <body style="margin:0;background:#f4f5f7;font-family:system-ui,sans-serif;">
    <table role="presentation" width="100%" style="padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="480" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr><td style="background:#0f172a;padding:20px 24px;color:#fff;font-weight:600;">KiaRelay</td></tr>
          <tr><td style="padding:24px;">
            <h1 style="margin:0 0 16px;font-size:20px;color:#191C1E;">${values.subject}</h1>
            ${paragraphs}
            ${
              values.actionLabel
                ? `<a href="${values.actionUrl}" style="display:inline-block;margin-top:8px;padding:12px 20px;background:#F0602E;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">${values.actionLabel}</a>`
                : ""
            }
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
