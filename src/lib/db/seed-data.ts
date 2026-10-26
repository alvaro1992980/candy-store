import type { Category } from "@/lib/categories";

export interface SeedProduct {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string | null; // filename under public/products/, shared across a few products
}

// Ported 1:1 from the PRODUCTS/IMAGES maps in the original .dc.html.
export const SEED_PRODUCTS: SeedProduct[] = [
  { id: "chubi", name: "Chubi", category: "Dulces", price: 1, image: "chubi.png" },
  { id: "chocomenta", name: "Choco menta", category: "Chocolates", price: 15, image: "chocomenta.png" },
  { id: "groso", name: "Groso en bolsa", category: "Dulces", price: 1, image: "groso.png" },
  { id: "poosh", name: "Chicle Poosh", category: "Chicles", price: 1, image: "poosh.png" },
  { id: "topline", name: "Chicle Topline", category: "Chicles", price: 3, image: "topline.png" },
  { id: "bonobon-choc", name: "Chocolate Bon o Bon", category: "Chocolates", price: 2, image: "bonobon-choc.png" },
  { id: "oreo", name: "Galleta Oreo", category: "Galletas", price: 4, image: "oreo.png" },
  { id: "duosocial", name: "Galleta Dúo Social", category: "Galletas", price: 4, image: "duosocial.png" },
  { id: "mabel", name: "Galleta Mabel wafer", category: "Galletas", price: 5, image: "mabel.png" },
  { id: "bbb", name: "Bon Bon Bum", category: "Dulces", price: 2, image: "bbb.png" },
  { id: "bubbaloo", name: "Chicle Bubbaloo", category: "Chicles", price: 1, image: "bubbaloo.png" },
  { id: "ritz", name: "Galleta Ritz", category: "Galletas", price: 5, image: "ritz.png" },
  { id: "bonobon-gall", name: "Galleta Bon o Bon", category: "Galletas", price: 6, image: "bonobon-gall.png" },
  { id: "momento", name: "Chocolate Momento", category: "Chocolates", price: 3, image: "momento.png" },
  { id: "luba", name: "Chicle Lubagomabomabum", category: "Chicles", price: 1, image: "luba.png" },
  { id: "chocosoda", name: "Galleta Choco Soda", category: "Galletas", price: 3, image: "chocosoda.png" },
  { id: "gelatina-bolsa", name: "Mini gelatinas Dely Yummy — bolsa", category: "Gelatinas", price: 2, image: "yummy.png" },
  { id: "gelatina-tarro", name: "Mini gelatinas Dely Yummy — tarro", category: "Gelatinas", price: 5, image: "yummy.png" },
];
