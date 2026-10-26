import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/actions/products";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-4">
      <span className="font-(family-name:--font-baloo) text-[17px] font-bold">Editar producto</span>
      <ProductForm product={product} action={updateProduct.bind(null, id)} />
    </div>
  );
}
