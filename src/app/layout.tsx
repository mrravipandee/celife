import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Manrope, Poppins } from "next/font/google";
import { constructMetadata } from "@/config/seo";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${manrope.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen bg-[var(--bone)] text-[var(--ink)] selection:bg-[var(--forest)] selection:text-white font-sans">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
