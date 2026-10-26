"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart/cart-context";
import { CATEGORY_TINTS } from "@/lib/categories";
import { formatPrice } from "@/lib/whatsapp";
import type { Product } from "@/lib/db/schema";

export function ProductCard({ product }: { product: Product }) {
  const { cart, addOne, removeOne } = useCart();
  const qty = cart[product.id] ?? 0;
  const tint = product.imageUrl ? "#fff" : CATEGORY_TINTS[product.category];

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border-[1.5px] border-stone-900/10 bg-white">
      <div
        className="relative flex aspect-square items-center justify-center p-2"
        style={{ background: tint }}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 440px) 50vw, 220px"
            className="object-contain p-2 mix-blend-multiply"
          />
        ) : (
          <span className="relative text-center font-mono text-[9px] uppercase tracking-wide text-stone-900/70">
            foto {product.name.split(" ")[0].toLowerCase()}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2.5 pb-3">
        <span className="text-[13.5px] font-bold leading-tight text-stone-900">{product.name}</span>
        <span className="-mt-1 text-[11px] text-stone-500">{product.category}</span>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-[14px] font-bold text-stone-900">{formatPrice(product.price)}</span>
          {qty > 0 ? (
            <div className="flex items-center gap-0.5 rounded-full bg-rose-50 p-0.5">
              <button
                onClick={() => removeOne(product.id)}
                aria-label="Quitar uno"
                className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white text-[15px] font-bold text-rose-600"
              >
                –
              </button>
              <span className="w-4 text-center text-[13px] font-bold text-stone-900">{qty}</span>
              <button
                onClick={() => addOne(product.id)}
                aria-label="Agregar uno"
                className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white text-[15px] font-bold text-rose-600"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addOne(product.id)}
              className="rounded-full bg-stone-900 px-3 py-1.5 text-[12px] font-bold text-white"
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
