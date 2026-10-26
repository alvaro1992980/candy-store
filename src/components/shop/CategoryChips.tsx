"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

const ALL = "Todos";

export function CategoryChips() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("cat") ?? ALL;

  function select(label: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (label === ALL) params.delete("cat");
    else params.set("cat", label);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex gap-2 overflow-x-auto px-4.5 pb-3 [scrollbar-width:none]">
      {[ALL, ...CATEGORIES].map((label) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            onClick={() => select(label)}
            className={`flex-none whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-bold ${
              isActive
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-900/15 bg-transparent text-stone-800"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
