"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { requireAdminSession } from "@/lib/auth/session";
import { checkProductImage, deleteProductImage, uploadProductImage } from "@/lib/storage";
import { isCategory, type Category } from "@/lib/categories";
import { SEED_PRODUCTS } from "@/lib/db/seed-data";

export type ProductFormState = { error: string } | undefined;

type ParsedProductForm =
  | { error: string }
  | {
      fields: { name: string; category: Category; price: number; hidden: boolean };
      photo: File | null;
    };

function readProductFields(formData: FormData): ParsedProductForm {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const hidden = formData.get("hidden") === "on";

  // An empty <input type="file"> still submits a zero-byte File.
  const photoEntry = formData.get("photo");
  const photo = photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null;

  if (!name) return { error: "El nombre es obligatorio" };
  if (!isCategory(category)) return { error: "Categoría inválida" };
  if (!Number.isInteger(price) || price < 0) return { error: "Precio inválido" };
  if (photo) {
    const photoError = checkProductImage(photo);
    if (photoError) return { error: photoError };
  }

  return { fields: { name, category, price, hidden }, photo };
}

// The photo is uploaded here, on save, rather than as soon as it's picked —
// so abandoning the form never leaves an unreferenced object in the bucket.
async function tryUpload(photo: File | null): Promise<{ url: string | null } | { error: string }> {
  if (!photo) return { url: null };
  try {
    return { url: await uploadProductImage(photo) };
  } catch {
    return { error: "No se pudo subir la foto. Intentá de nuevo." };
  }
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdminSession();
  const parsed = readProductFields(formData);
  if ("error" in parsed) return parsed;

  const upload = await tryUpload(parsed.photo);
  if ("error" in upload) return upload;

  try {
    await db.insert(products).values({ id: `p${Date.now()}`, ...parsed.fields, imageUrl: upload.url });
  } catch (err) {
    if (upload.url) await deleteProductImage(upload.url).catch(() => {});
    throw err;
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdminSession();
  const parsed = readProductFields(formData);
  if ("error" in parsed) return parsed;

  const [existing] = await db.select().from(products).where(eq(products.id, id));
  if (!existing) return { error: "Este producto ya no existe" };

  const upload = await tryUpload(parsed.photo);
  if ("error" in upload) return upload;

  try {
    await db
      .update(products)
      .set({ ...parsed.fields, ...(upload.url && { imageUrl: upload.url }), updatedAt: new Date() })
      .where(eq(products.id, id));
  } catch (err) {
    if (upload.url) await deleteProductImage(upload.url).catch(() => {});
    throw err;
  }

  // Only drop the old photo once the row no longer points at it.
  if (upload.url && existing.imageUrl) {
    await deleteProductImage(existing.imageUrl).catch(() => {});
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await requireAdminSession();

  const [existing] = await db.select().from(products).where(eq(products.id, id));
  if (existing?.imageUrl) {
    await deleteProductImage(existing.imageUrl).catch(() => {});
  }

  await db.delete(products).where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
}

// Reverts to the original 18-product seed. Note: this restores the local
// /products/*.png image paths used by the dev seed script — once M5 moves
// seeding to the real Railway bucket, this should be updated to point at
// the production seed's bucket URLs instead.
export async function resetCatalog() {
  await requireAdminSession();

  const previous = await db.select({ imageUrl: products.imageUrl }).from(products);

  await db.transaction(async (tx) => {
    await tx.delete(products);
    await tx.insert(products).values(
      SEED_PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        imageUrl: p.image ? `/products/${p.image}` : null,
        hidden: false,
      })),
    );
  });

  // Admin-uploaded photos are no longer referenced by any row. Static seed
  // paths are skipped by deleteProductImage itself.
  await Promise.all(
    previous.map((p) => (p.imageUrl ? deleteProductImage(p.imageUrl).catch(() => {}) : null)),
  );

  revalidatePath("/");
  revalidatePath("/admin");
}
