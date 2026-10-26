"use client";

import { useMemo } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { buildWhatsAppUrl, formatPrice, type CartLine } from "@/lib/whatsapp";
import type { Product } from "@/lib/db/schema";

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "59173388665";

export function CartOverlay({ products }: { products: Product[] }) {
  const { cart, isOpen, count, addOne, removeOne, open, close } = useCart();

  const lines: CartLine[] = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === id);
        return product ? { product, qty } : null;
      })
      .filter((l): l is CartLine => l !== null);
  }, [cart, products]);

  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  if (count === 0 && !isOpen) return null;

  return (
    <>
      {count > 0 && !isOpen && (
        <button
          onClick={open}
          className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-[408px] items-center justify-between rounded-2xl bg-stone-900 px-5 py-4 text-white shadow-lg"
        >
          <span className="text-[13px] font-bold">Ver mi pedido ({count})</span>
          <span className="text-[14px] font-bold">{formatPrice(total)}</span>
        </button>
      )}

      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 z-40 flex items-end bg-black/40"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full flex-col gap-3 rounded-t-3xl bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[16px] text-stone-900">Tu pedido</span>
              <button onClick={close} className="text-[13px] font-bold text-stone-500">
                Cerrar
              </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto">
              {lines.map((l) => (
                <div key={l.product.id} className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[13.5px] font-bold text-stone-900">{l.product.name}</span>
                    <span className="text-[12px] text-stone-500">
                      {formatPrice(l.product.price)} · {formatPrice(l.product.price * l.qty)}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 rounded-full bg-rose-50 p-0.5">
                    <button
                      onClick={() => removeOne(l.product.id)}
                      className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white text-[15px] font-bold text-rose-600"
                    >
                      –
                    </button>
                    <span className="w-4 text-center text-[13px] font-bold text-stone-900">{l.qty}</span>
                    <button
                      onClick={() => addOne(l.product.id)}
                      className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white text-[15px] font-bold text-rose-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-stone-900/10 pt-3">
              <span className="text-[13.5px] font-bold text-stone-900">Total</span>
              <span className="text-[15px] font-bold text-stone-900">{formatPrice(total)}</span>
            </div>

            <a
              href={buildWhatsAppUrl(lines, WHATSAPP_PHONE)}
              target="_blank"
              rel="noopener"
              className="mt-1 flex items-center justify-center rounded-2xl bg-emerald-600 py-3.5 text-[14px] font-bold text-white"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
