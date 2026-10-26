import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, type Product } from "@/lib/db/schema";
import { isCategory } from "@/lib/categories";

export interface ProductFilter {
  category?: string;
  query?: string;
}

// Customers only ever see non-hidden products — admin's unfiltered view
// (including hidden rows) is added in M4 alongside the session check.
export async function getVisibleProducts(filter: ProductFilter): Promise<Product[]> {
  const conditions = [eq(products.hidden, false)];

  if (isCategory(filter.category)) {
    conditions.push(eq(products.category, filter.category));
  }

  const q = filter.query?.trim();
  if (q) {
    const searchCondition = or(ilike(products.name, `%${q}%`), ilike(products.category, `%${q}%`));
    if (searchCondition) conditions.push(searchCondition);
  }

  return db
    .select()
    .from(products)
    .where(and(...conditions));
}

// Admin sees every product, including hidden ones — callers must have
// already checked requireAdminSession() before reaching here.
export async function getAllProductsForAdmin(): Promise<Product[]> {
  return db.select().from(products).orderBy(products.name);
}
