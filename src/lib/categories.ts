export const CATEGORIES = [
  "Dulces",
  "Chicles",
  "Galletas",
  "Chocolates",
  "Gelatinas",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: string | undefined): value is Category {
  return !!value && (CATEGORIES as readonly string[]).includes(value);
}

// Placeholder background shown behind a product photo (or in place of one)
// when a product has no image yet. Ported from the original .dc.html TINTS map.
export const CATEGORY_TINTS: Record<Category, string> = {
  Dulces: "oklch(0.93 0.05 15)",
  Chicles: "oklch(0.93 0.05 320)",
  Galletas: "oklch(0.93 0.05 70)",
  Chocolates: "oklch(0.9 0.04 50)",
  Gelatinas: "oklch(0.93 0.05 150)",
};
