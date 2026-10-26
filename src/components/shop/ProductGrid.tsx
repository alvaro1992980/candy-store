import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/db/schema";

export function ProductGrid({ items }: { items: Product[] }) {
  if (items.length === 0) {
    return (
      <div className="px-4.5 py-12 text-center text-[13.5px] text-stone-500">
        No encontramos ese dulce
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4.5">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
