/**
 * HTML layout for postcard PDFs — 6" x 4.25" (standard USPS postcard), one
 * page per side: front (headline/hook) and back (message + CTA).
 */
import type { VariationContent } from "@/lib/db/schema";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphs(text: string): string {
  return text
    .split("\n\n")
    .filter((p) => p.trim())
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

export function renderPostcardHtml(content: VariationContent): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  @page { size: 6in 4.25in; margin: 0.25in; }
  html, body {
    margin: 0; padding: 0;
    font-family: Georgia, serif;
    font-size: 10pt;
    line-height: 1.4;
    color: #111;
  }
  .side { page-break-after: always; height: 3.7in; display: flex; flex-direction: column; justify-content: center; }
  .side:last-child { page-break-after: auto; }
  h1 { font-size: 18pt; line-height: 1.2; margin: 0 0 8pt 0; }
  p { margin: 0 0 7pt 0; }
  .cta { font-weight: bold; margin-top: 8pt; }
</style>
</head>
<body>
  <div class="side">
    <h1>${escapeHtml(content.headline)}</h1>
    ${paragraphs(content.opening)}
  </div>
  <div class="side">
    ${paragraphs(content.body)}
    <div class="cta">${paragraphs(content.cta)}</div>
  </div>
</body>
</html>`;
}
