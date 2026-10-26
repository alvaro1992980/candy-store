import { config } from "dotenv";
config({ path: ".env.local" });

import { SEED_PRODUCTS } from "./seed-data";

// Local-dev seed: points imageUrl at the static files copied into
// public/products/. The M5 production seed swaps this for a real upload
// to the Railway Storage Bucket and uses the resulting bucket URL instead.
//
// `db`/`schema` are imported dynamically (after dotenv has run) because a
// static top-level `import` is hoisted above this file's own top-level code
// by the ES module spec, which would make db/index.ts read DATABASE_URL
// before config() above had a chance to set it.
async function main() {
  const { db } = await import("./index");
  const { products } = await import("./schema");

  const rows = SEED_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    imageUrl: p.image ? `/products/${p.image}` : null,
    hidden: false,
  }));

  await db.insert(products).values(rows).onConflictDoNothing();
  console.log(`Seeded ${rows.length} products.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
