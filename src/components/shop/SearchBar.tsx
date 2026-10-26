"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get("q") ?? "";

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("q", next);
    else params.delete("q");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="mx-4.5 mb-3 flex items-center gap-2 rounded-2xl border-[1.5px] border-stone-900/10 bg-white px-3.5 py-2.5">
      <span className="text-[14px] opacity-45">⌕</span>
      <input
        type="text"
        placeholder="Buscar dulce, galleta, chicle…"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-none bg-transparent text-[15px] text-stone-900 outline-none"
      />
    </div>
  );
}
