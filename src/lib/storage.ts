import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.STORAGE_REGION ?? "auto",
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.STORAGE_BUCKET_NAME!;
const PUBLIC_BASE_URL = process.env.STORAGE_PUBLIC_URL!;

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// Real photo formats only — deliberately excludes image/svg+xml (can embed
// scripts, and its "svg+xml" subtype would also produce a broken file ext).
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

// Returns a user-facing error message, or null if the file is acceptable.
export function checkProductImage(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) return "La foto debe ser JPG, PNG, WebP o GIF";
  if (file.size > MAX_SIZE_BYTES) return "La foto no puede pesar más de 5 MB";
  return null;
}

// Callers must run checkProductImage() first.
export async function uploadProductImage(file: File): Promise<string> {
  const key = `products/${randomUUID()}.${ALLOWED_TYPES.get(file.type)}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }),
  );
  return `${PUBLIC_BASE_URL}/${key}`;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (!imageUrl.startsWith(PUBLIC_BASE_URL)) return; // not one of ours (e.g. a legacy /products/*.png static asset)
  const key = imageUrl.slice(PUBLIC_BASE_URL.length + 1);
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
