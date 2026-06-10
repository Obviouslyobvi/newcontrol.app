/**
 * HTML layout for letter-format PDFs (sales letters, lead gen, follow-ups).
 * US Letter, 1" top/bottom and 1.25" side margins, 12pt body / 14pt headlines.
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

export function renderLetterHtml(
  content: VariationContent,
  opts: { print: boolean; brandName?: string }
): string {
  const { print } = opts;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  @page {
    size: Letter;
    margin: 1in 1.25in;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.55;
    color: #111;
    ${print ? "-webkit-print-color-adjust: exact;" : ""}
  }
  p { margin: 0 0 12pt 0; }
  .johnson-box {
    border: 2.25pt solid #111;
    padding: 14pt 18pt;
    text-align: center;
    font-weight: bold;
    margin-bottom: 22pt;
  }
  h1 {
    font-size: 14pt;
    line-height: 1.35;
    margin: 0 0 18pt 0;
  }
  .guarantee {
    border-left: 3pt solid #999;
    padding-left: 12pt;
    font-style: italic;
    margin: 14pt 0;
  }
  .ps { margin-top: 22pt; }
  .ps p { margin-bottom: 10pt; }
  .response-card {
    margin-top: 28pt;
    border: 1pt dashed #777;
    padding: 14pt 18pt;
    font-size: 11pt;
    page-break-inside: avoid;
  }
  .signature { margin: 24pt 0; }
  ${
    print
      ? `
  /* Fold marks at 3.67" and 7.33" from the top of page one */
  .fold-mark {
    position: absolute;
    left: -1in;
    width: 0.25in;
    border-top: 0.5pt solid #bbb;
  }
  .fold-1 { top: 2.67in; } /* 3.67" from sheet top minus 1" margin */
  .fold-2 { top: 6.33in; }
  .page-frame { position: relative; }
  `
      : ""
  }
</style>
</head>
<body>
<div class="page-frame">
${print ? '<div class="fold-mark fold-1"></div><div class="fold-mark fold-2"></div>' : ""}
${content.johnsonBox ? `<div class="johnson-box">${escapeHtml(content.johnsonBox)}</div>` : ""}
<h1>${escapeHtml(content.headline)}</h1>
${paragraphs(content.opening)}
${paragraphs(content.body)}
${paragraphs(content.cta)}
${content.guarantee ? `<div class="guarantee">${paragraphs(content.guarantee)}</div>` : ""}
<div class="signature"><p>Sincerely,</p><p>[Your Name]</p></div>
${
  content.ps.length
    ? `<div class="ps">${content.ps
        .map(
          (ps, i) =>
            `<p><strong>${i === 0 ? "P.S." : "P.P.S."}</strong> ${escapeHtml(ps.replace(/^P\.?P?\.?S\.?:?\s*/i, ""))}</p>`
        )
        .join("\n")}</div>`
    : ""
}
${content.responseCard ? `<div class="response-card">${paragraphs(content.responseCard)}</div>` : ""}
</div>
</body>
</html>`;
}
