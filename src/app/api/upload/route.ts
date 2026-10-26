import { getSession } from "@/lib/auth/session";
import { uploadProductImage } from "@/lib/storage";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// Real photo formats only — deliberately excludes image/svg+xml (can embed
// scripts, and its "svg+xml" subtype would also produce a broken file ext).
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return new Response("No file", { status: 400 });
  }
  const ext = ALLOWED_TYPES.get(file.type);
  if (!ext) {
    return new Response("Invalid file type", { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return new Response("File too large", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadProductImage(buffer, file.type, ext);

  return Response.json({ url });
}
