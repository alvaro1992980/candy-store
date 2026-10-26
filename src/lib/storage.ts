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

export async function uploadProductImage(
  file: Buffer,
  contentType: string,
  ext: string,
): Promise<string> {
  const key = `products/${randomUUID()}.${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    }),
  );
  return `${PUBLIC_BASE_URL}/${key}`;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (!imageUrl.startsWith(PUBLIC_BASE_URL)) return; // not one of ours (e.g. a legacy /products/*.png static asset)
  const key = imageUrl.slice(PUBLIC_BASE_URL.length + 1);
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
