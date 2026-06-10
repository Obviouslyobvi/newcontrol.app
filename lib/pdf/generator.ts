/**
 * HTML-to-PDF via puppeteer-core + @sparticuz/chromium (serverless-friendly).
 * Locally, falls back to a system Chrome/Chromium if one exists.
 */
import type { Campaign, VariationContent } from "@/lib/db/schema";
import { renderLetterHtml } from "./templates/sales-letter";
import { renderPostcardHtml } from "./templates/postcard";
import { renderEmailHtml } from "./templates/email";

export function renderHtmlForCampaign(
  campaignType: Campaign["campaignType"],
  content: VariationContent,
  print: boolean
): string {
  switch (campaignType) {
    case "postcard":
      return renderPostcardHtml(content);
    case "email":
    case "cold_email":
    case "social_ad":
    case "landing_page":
      return renderEmailHtml(content);
    default:
      return renderLetterHtml(content, { print });
  }
}

async function launchBrowser() {
  const puppeteer = await import("puppeteer-core");

  // Serverless (Vercel/AWS): use the bundled Chromium.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  // Local: try common executable paths.
  const { existsSync } = await import("fs");
  const candidates = [
    process.env.CHROME_EXECUTABLE_PATH,
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter((p): p is string => Boolean(p));
  const executablePath = candidates.find((p) => existsSync(p));
  if (executablePath) {
    return puppeteer.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  // Last resort: bundled chromium also works on plain linux x64.
  const chromium = (await import("@sparticuz/chromium")).default;
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

export async function generatePdf(
  campaignType: Campaign["campaignType"],
  content: VariationContent,
  format: "pdf_print" | "pdf_digital"
): Promise<Buffer> {
  const html = renderHtmlForCampaign(campaignType, content, format === "pdf_print");
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: campaignType !== "postcard",
      headerTemplate: "<span></span>",
      footerTemplate:
        campaignType === "postcard"
          ? "<span></span>"
          : `<div style="width:100%;text-align:center;font-size:8pt;color:#999;font-family:Georgia,serif;">
               <span class="pageNumber"></span> / <span class="totalPages"></span>
             </div>`,
      margin:
        campaignType === "postcard"
          ? undefined
          : { top: "1in", bottom: "1in", left: "1.25in", right: "1.25in" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
