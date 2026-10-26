import Link from "next/link";
import { getVisibleProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";

interface ShopPageProps {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q, cat } = await searchParams;
  const items = await getVisibleProducts({ query: q, category: cat });

  const listTitle = cat && cat !== "Todos" ? cat : "Todo el catálogo";
  const countLabel = `${items.length} ${items.length === 1 ? "producto" : "productos"}`;

  return (
    <>
      <div className="px-4.5 pt-1">
        <div className="relative overflow-hidden rounded-[20px] bg-rose-600 px-4.5 py-5">
          <span className="relative block max-w-57.5 font-(family-name:--font-baloo) text-[27px] font-extrabold leading-[1.05] text-white">
            Armá tu bolsa de dulces
          </span>
          <span className="relative mt-2.5 block max-w-62.5 text-[13.5px] leading-snug text-white">
            Elegí lo que quieras y te lo enviamos el mismo día por WhatsApp.
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between px-4.5 pb-3 pt-5.5">
        <span className="font-[Baloo_2] text-[18px] font-bold">{listTitle}</span>
        <span className="text-[12px] text-stone-500">{countLabel}</span>
      </div>

      <ProductGrid items={items} />

      <div className="flex flex-col gap-1.5 px-4.5 pb-2 pt-7">
        <span className="font-(family-name:--font-baloo) text-[16px] font-bold">Pedidos y entregas</span>
        <span className="text-[13px] leading-snug text-stone-500">
          Hacé tu pedido por WhatsApp. Entregas el mismo día en la zona; pago en efectivo o transferencia.
        </span>
      </div>

      <div className="flex justify-center px-4.5 pb-2.5 pt-1">
        <Link
          href="/admin/login"
          className="rounded-full border-[1.5px] border-stone-900/15 px-3.5 py-2 text-[12px] font-bold text-stone-500"
        >
          Modo administrador
        </Link>
      </div>
    </>
  );
}
