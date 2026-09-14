import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { constructMetadata } from "@/config/seo";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="antialiased min-h-screen bg-[#F8FAF6] text-[#171B18] selection:bg-[#123C2D] selection:text-white">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
