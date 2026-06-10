import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/middleware";
import { errors, errorResponse } from "@/lib/utils/errors";
import { checkRateLimit, RATE_LIMITS } from "@/lib/utils/rate-limit";
import { uploadFile, isStorageConfigured } from "@/lib/storage/s3";

export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
  "text/plain": "txt",
};

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req);

    const rl = checkRateLimit(
      `upload:${session.orgId}`,
      RATE_LIMITS.upload.limit,
      RATE_LIMITS.upload.windowMs
    );
    if (!rl.allowed) throw errors.rateLimited("Upload limit reached for this hour.");

    if (!isStorageConfigured()) {
      throw errors.validation(
        "File storage isn't configured yet. Add the S3/R2 keys from SETUP.md to enable document uploads — or paste example copy as text instead."
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) throw errors.validation("No file provided");
    if (file.size > MAX_SIZE) throw errors.validation("File is larger than 10MB");

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      throw errors.validation("Only PDF, DOCX, and TXT files are accepted");
    }

    // Sanitized name; org-scoped key.
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    const key = `brand-docs/${session.orgId}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const url = await uploadFile(key, buffer, file.type);
    if (!url) throw errors.server("Upload failed — please try again");

    return NextResponse.json({ url, filename: file.name, size: file.size });
  } catch (err) {
    return errorResponse(err);
  }
}
