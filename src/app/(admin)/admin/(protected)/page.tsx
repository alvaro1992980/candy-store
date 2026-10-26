import Link from "next/link";
import { getAllProductsForAdmin } from "@/lib/products";
import { formatPrice } from "@/lib/whatsapp";
import { ResetCatalogButton } from "@/components/admin/ResetCatalogButton";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const items = await getAllProductsForAdmin();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Link
          href="/admin/products/new"
          className="flex-1 rounded-2xl bg-stone-900 py-3 text-center text-[13px] font-bold text-white"
        >
          + Agregar producto
        </Link>
        <ResetCatalogButton />
      </div>

      <div className="flex flex-col gap-2">
        {items.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-3 rounded-2xl border-[1.5px] border-stone-900/10 bg-white p-3"
          >
            <div className="flex flex-col">
              <span className="text-[13.5px] font-bold">
                {product.name} {product.hidden && <span className="text-stone-400">· oculto</span>}
              </span>
              <span className="text-[12px] text-stone-500">
                {product.category} · {formatPrice(product.price)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="rounded-full border border-stone-900/15 px-3 py-1.5 text-[12px] font-bold"
              >
                Editar
              </Link>
              <DeleteProductButton id={product.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
