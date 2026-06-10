import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.S3_ENDPOINT &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_BUCKET_NAME
  );
}

let _client: S3Client | null = null;
function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _client;
}

/**
 * Upload a file to R2/S3. Returns the public URL, or null when storage is
 * not configured (callers fall back to direct-download responses).
 */
export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string | null> {
  if (!isStorageConfigured()) return null;
  try {
    await getClient().send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
    const base = process.env.S3_PUBLIC_URL ?? process.env.S3_ENDPOINT;
    return `${base!.replace(/\/$/, "")}/${key}`;
  } catch (err) {
    console.error("Storage upload failed (continuing with direct download):", err);
    return null;
  }
}
