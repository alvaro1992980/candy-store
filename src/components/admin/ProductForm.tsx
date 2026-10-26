"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import type { Product } from "@/lib/db/schema";

interface ProductFormProps {
  product?: Product;
  action: (formData: FormData) => void | Promise<void>;
}

export function ProductForm({ product, action }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.imageUrl ?? null);

  async function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const { url } = (await res.json()) as { url: string };
      setImageUrl(url);
    } catch {
      alert("No se pudo subir la foto. Intentá de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-bold text-stone-700">Foto</span>
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-stone-100">
            {previewUrl ? (
              // Plain <img>, not next/image: this can be a local blob: object URL
              // (before upload finishes) or an arbitrary bucket host, and it's
              // a tiny fixed-size thumbnail where optimization buys nothing.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="h-full w-full object-contain" />
            ) : (
              <span className="text-[9px] text-stone-400">sin foto</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={onPhotoChange} className="text-[12.5px]" />
        </div>
        {uploading && <span className="text-[12px] text-stone-500">Subiendo…</span>}
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

      <button
        type="submit"
        disabled={uploading}
        className="mt-1 rounded-2xl bg-stone-900 py-3 text-[14px] font-bold text-white disabled:opacity-50"
      >
        Guardar
      </button>
    </form>
  );
}
