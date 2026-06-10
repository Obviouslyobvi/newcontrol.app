import type { VariationContent } from "@/lib/db/schema";

/**
 * Parse the model's response into structured VariationContent.
 * Tolerates markdown fences and stray prose around the JSON object.
 */
export function parseVariationResponse(raw: string): {
  content: VariationContent;
  parseFlag: string | null;
} {
  // 1. Direct parse
  const direct = tryParse(raw);
  if (direct) return { content: normalize(direct), parseFlag: null };

  // 2. Extract from markdown code fences
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    const parsed = tryParse(fenced[1]);
    if (parsed) return { content: normalize(parsed), parseFlag: "extracted_from_fence" };
  }

  // 3. Extract the outermost JSON object
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end > start) {
    const parsed = tryParse(raw.slice(start, end + 1));
    if (parsed) return { content: normalize(parsed), parseFlag: "extracted_outer_object" };
  }

  // 4. Last resort: wrap the raw text so the user still sees output.
  return {
    content: {
      envelopeTeaser: null,
      johnsonBox: null,
      headline: firstLine(raw) || "Untitled letter",
      opening: "",
      body: raw.trim(),
      cta: "",
      guarantee: null,
      ps: [],
      responseCard: null,
      fullText: raw.trim(),
    },
    parseFlag: "raw_text_fallback",
  };
}

function tryParse(text: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(text.trim());
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function strOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function normalize(obj: Record<string, unknown>): VariationContent {
  const ps = Array.isArray(obj.ps)
    ? obj.ps.filter((p): p is string => typeof p === "string")
    : typeof obj.ps === "string"
      ? [obj.ps]
      : [];

  const headline = str(obj.headline);
  const opening = str(obj.opening);
  const body = str(obj.body);
  const cta = str(obj.cta);
  const guarantee = strOrNull(obj.guarantee);

  let fullText = str(obj.fullText);
  if (!fullText) {
    fullText = [headline, opening, body, cta, guarantee ?? "", ps.map((p, i) => `${i === 0 ? "P.S." : "P.P.S."} ${p}`).join("\n\n")]
      .filter(Boolean)
      .join("\n\n");
  }

  return {
    envelopeTeaser: strOrNull(obj.envelopeTeaser),
    johnsonBox: strOrNull(obj.johnsonBox),
    headline,
    opening,
    body,
    cta,
    guarantee,
    ps,
    responseCard: strOrNull(obj.responseCard),
    fullText,
  };
}

function firstLine(text: string): string {
  return text.trim().split("\n")[0]?.slice(0, 120) ?? "";
}
