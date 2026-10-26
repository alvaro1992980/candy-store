import type { Product } from "@/lib/db/schema";

export function formatPrice(price: number): string {
  return "Bs " + price.toLocaleString("es-BO");
}

export interface CartLine {
  product: Product;
  qty: number;
}

export function buildWhatsAppUrl(lines: CartLine[], phone: string): string {
  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  const message =
    "Hola! Quiero pedir:\n" +
    lines
      .map((l) => `• ${l.qty} x ${l.product.name} — ${formatPrice(l.product.price * l.qty)}`)
      .join("\n") +
    `\nTotal: ${formatPrice(total)}`;

  const digitsOnlyPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${digitsOnlyPhone}?text=${encodeURIComponent(message)}`;
}
