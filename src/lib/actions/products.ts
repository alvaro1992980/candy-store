"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { requireAdminSession } from "@/lib/auth/session";
import { deleteProductImage } from "@/lib/storage";
import { isCategory } from "@/lib/categories";
import { SEED_PRODUCTS } from "@/lib/db/seed-data";

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const imageUrl = String(formData.get("imageUrl") ?? "") || null;
  const hidden = formData.get("hidden") === "on";

  if (!name) throw new Error("El nombre es obligatorio");
  if (!isCategory(category)) throw new Error("Categoría inválida");

  return { name, category, price: Number.isFinite(price) ? price : 0, imageUrl, hidden };
}

export async function createProduct(formData: FormData) {
  await requireAdminSession();
  const fields = readProductFields(formData);
  const id = `p${Date.now()}`;

  await db.insert(products).values({ id, ...fields });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdminSession();
  const fields = readProductFields(formData);

  const [existing] = await db.select().from(products).where(eq(products.id, id));
  if (existing?.imageUrl && existing.imageUrl !== fields.imageUrl) {
    await deleteProductImage(existing.imageUrl).catch(() => {});
  }

  await db.update(products).set(fields).where(eq(products.id, id));

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

  revalidatePath("/");
  revalidatePath("/admin");
}
