import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import { constructMetadata } from "@/config/seo";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#123C2D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = constructMetadata();


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${poppins.variable}`}
    >
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen bg-[var(--bone)] text-[var(--ink)] selection:bg-[var(--forest)] selection:text-white font-sans"
      >
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
