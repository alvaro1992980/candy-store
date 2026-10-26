"use client";

import { useTransition } from "react";
import { resetCatalog } from "@/lib/actions/products";

export function ResetCatalogButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm("¿Restaurar el catálogo original? Se perderán los cambios de admin.")) return;
        startTransition(() => resetCatalog());
      }}
      disabled={pending}
      className="rounded-2xl border border-stone-900/15 px-4 py-3 text-[12.5px] font-bold text-stone-700 disabled:opacity-50"
    >
      {pending ? "Restaurando…" : "Restaurar"}
    </button>
  );
}
