/**
 * DOCX export using the `docx` package, with proper Word heading/body styles.
 * Variable-data fields like [Your Name] are preserved as text.
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import type { VariationContent } from "@/lib/db/schema";

function bodyParagraphs(text: string): Paragraph[] {
  return text
    .split("\n\n")
    .filter((p) => p.trim())
    .map(
      (p) =>
        new Paragraph({
          children: [new TextRun({ text: p.replace(/\n/g, " "), size: 24 })],
          spacing: { after: 240 },
        })
    );
}

export async function generateDocx(content: VariationContent): Promise<Buffer> {
  const children: Paragraph[] = [];

  if (content.johnsonBox) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: content.johnsonBox, bold: true, size: 24 })],
        alignment: AlignmentType.CENTER,
        border: {
          top: { style: BorderStyle.SINGLE, size: 18, color: "111111" },
          bottom: { style: BorderStyle.SINGLE, size: 18, color: "111111" },
          left: { style: BorderStyle.SINGLE, size: 18, color: "111111" },
          right: { style: BorderStyle.SINGLE, size: 18, color: "111111" },
        },
        spacing: { after: 360 },
      })
    );
  }

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: content.headline, bold: true, size: 28 })],
      spacing: { after: 320 },
    })
  );

  children.push(...bodyParagraphs(content.opening));
  children.push(...bodyParagraphs(content.body));
  children.push(...bodyParagraphs(content.cta));
  if (content.guarantee) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: content.guarantee, italics: true, size: 24 })],
        spacing: { after: 240 },
      })
    );
  }

  children.push(
    new Paragraph({ children: [new TextRun({ text: "Sincerely,", size: 24 })], spacing: { after: 120 } }),
    new Paragraph({ children: [new TextRun({ text: "[Your Name]", size: 24 })], spacing: { after: 360 } })
  );

  content.ps.forEach((ps, i) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: i === 0 ? "P.S. " : "P.P.S. ", bold: true, size: 24 }),
          new TextRun({ text: ps.replace(/^P\.?P?\.?S\.?:?\s*/i, ""), size: 24 }),
        ],
        spacing: { after: 200 },
      })
    );
  });

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Georgia", size: 24 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1800, right: 1800 },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

export function generateTxt(content: VariationContent): Buffer {
  const text = content.fullText
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return Buffer.from(text + "\n", "utf-8");
}
