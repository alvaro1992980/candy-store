"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import type { Product } from "@/lib/db/schema";
import type { ProductFormState } from "@/lib/actions/products";

interface ProductFormProps {
  product?: Product;
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
}

export function ProductForm({ product, action }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.imageUrl ?? null);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreviewUrl(file ? URL.createObjectURL(file) : (product?.imageUrl ?? null));
  }

  // Submitting manually (instead of <form action>) stops React from resetting
  // the form after the action returns, so a validation error doesn't wipe
  // the chosen photo and the fields the admin already filled in.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-bold text-stone-700">Foto</span>
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-stone-100">
            {previewUrl ? (
              // Plain <img>, not next/image: this can be a local blob: object URL
              // (a photo picked but not yet saved) or an arbitrary bucket host, and
              // it's a tiny fixed-size thumbnail where optimization buys nothing.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="h-full w-full object-contain" />
            ) : (
              <span className="text-[9px] text-stone-400">sin foto</span>
            )}
          </div>
          <input
            type="file"
            name="photo"
            // Keep in sync with ALLOWED_TYPES in lib/storage.ts.
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onPhotoChange}
            className="text-[12.5px]"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-bold text-stone-700">Nombre</span>
        <input
          name="name"
          defaultValue={product?.name}
          required
          className="rounded-2xl border-[1.5px] border-stone-900/10 px-3.5 py-2.5 text-[14px] outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-bold text-stone-700">Categoría</span>
        <select
          name="category"
          defaultValue={product?.category ?? CATEGORIES[0]}
          className="rounded-2xl border-[1.5px] border-stone-900/10 px-3.5 py-2.5 text-[14px] outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-bold text-stone-700">Precio (Bs)</span>
        <input
          type="number"
          name="price"
          min={0}
          step={1}
          defaultValue={product?.price ?? 1}
          required
          className="rounded-2xl border-[1.5px] border-stone-900/10 px-3.5 py-2.5 text-[14px] outline-none"
        />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="hidden" defaultChecked={product?.hidden} />
        <span className="text-[13px] text-stone-700">Ocultar del catálogo</span>
      </label>

      {state?.error && <span className="text-[13px] font-bold text-rose-600">{state.error}</span>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-2xl bg-stone-900 py-3 text-[14px] font-bold text-white disabled:opacity-50"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
