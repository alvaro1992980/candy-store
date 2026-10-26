"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/lib/actions/products";

export function DeleteProductButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm("¿Eliminar este producto?")) return;
        startTransition(() => deleteProduct(id));
      }}
      disabled={pending}
      className="rounded-full border border-rose-200 px-3 py-1.5 text-[12px] font-bold text-rose-600 disabled:opacity-50"
    >
      Eliminar
    </button>
  );
}
