import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { CATEGORIES } from "@/lib/categories";

export const categoryEnum = pgEnum("category", CATEGORIES);

export const products = pgTable("products", {
  id: text("id").primaryKey(), // slug, e.g. "chubi", "oreo"
  name: text("name").notNull(),
  category: categoryEnum("category").notNull(),
  price: integer("price").notNull(), // whole bolivianos, no cents in the source data
  imageUrl: text("image_url"), // Railway Storage Bucket URL; null until a photo is uploaded
  hidden: boolean("hidden").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// Future (not in v1 scope): an `orders` table capturing
// { id, createdAt, items: jsonb, total, customerNote } could be inserted
// right before generating the WhatsApp link in lib/whatsapp.ts, giving
// order history without changing the checkout UX at all.
