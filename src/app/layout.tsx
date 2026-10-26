import type { Metadata } from "next";
import { Baloo_2, DM_Sans } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  weight: ["500", "700", "800"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Dulcería",
  description: "Dulces, galletas y chocolates — pedidos por WhatsApp",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${baloo.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#ece6dc] font-(family-name:--font-dm-sans)">
        {children}
      </body>
    </html>
  );
}
