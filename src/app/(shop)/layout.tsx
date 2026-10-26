import { getVisibleProducts } from "@/lib/products";
import { CartProvider } from "@/lib/cart/cart-context";
import { CartOverlay } from "@/components/shop/CartOverlay";
import { SearchBar } from "@/components/shop/SearchBar";
import { CategoryChips } from "@/components/shop/CategoryChips";

// The catalog is DB-backed and filtered via search params on every request —
// there's nothing useful to statically prerender here.
export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  // Used only to resolve cart line items (name/price/image) client-side;
  // the page itself re-queries with the active filter for the visible grid.
  const allProducts = await getVisibleProducts({});

  return (
    <CartProvider>
      <div className="relative mx-auto min-h-screen w-full max-w-110 overflow-x-hidden bg-[#fbf7f0] pb-24 text-stone-900">
        <div className="sticky top-0 z-20 bg-[#fbf7f0] shadow-[0_1px_0_rgba(36,29,24,.08)]">
          <div className="flex items-center justify-between gap-3 px-4.5 pt-3.5 pb-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="font-(family-name:--font-baloo) text-[23px] font-extrabold leading-none tracking-tight">
                La Dulcería
              </span>
              <span className="text-[11.5px] text-stone-500">Dulces, galletas y chocolates</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5">
              <span className="h-1.75 w-1.75 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-amber-800">Abierto</span>
            </div>
          </div>
          <SearchBar />
          <CategoryChips />
        </div>

        {children}

        <CartOverlay products={allProducts} />
      </div>
    </CartProvider>
  );
}
