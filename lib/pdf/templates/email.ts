/**
 * HTML layout for email-format PDFs (email, cold email, social ads, landing
 * page copy) — a clean single-column digital document.
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

export function renderEmailHtml(content: VariationContent): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  @page { size: Letter; margin: 0.75in 1in; }
  html, body {
    margin: 0; padding: 0;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
  }
  .subject {
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 1pt;
    color: #888;
    margin-bottom: 6pt;
  }
  h1 { font-size: 15pt; line-height: 1.3; margin: 0 0 14pt 0; }
  p { margin: 0 0 11pt 0; }
  .cta { font-weight: bold; }
  .ps { margin-top: 18pt; }
</style>
</head>
<body>
  <div class="subject">Subject line</div>
  <h1>${escapeHtml(content.headline)}</h1>
  ${paragraphs(content.opening)}
  ${paragraphs(content.body)}
  <div class="cta">${paragraphs(content.cta)}</div>
  ${content.guarantee ? paragraphs(content.guarantee) : ""}
  ${
    content.ps.length
      ? `<div class="ps">${content.ps.map((ps, i) => `<p><strong>${i === 0 ? "P.S." : "P.P.S."}</strong> ${escapeHtml(ps.replace(/^P\.?P?\.?S\.?:?\s*/i, ""))}</p>`).join("")}</div>`
      : ""
  }
</body>
</html>`;
}
