import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CelifeLogoProps {
  className?: string;
  variant?: "dark" | "light";
  showTagline?: boolean;
}

export function CelifeLogo({
  className,
  variant = "dark",
}: CelifeLogoProps) {
  const isLight = variant === "light";
  const logoSrc = isLight ? "/celife-brand-light.png" : "/celife-brand.png";

  return (
    <div className={cn("relative flex items-center shrink-0 select-none", className)}>
      <Image
        src={logoSrc}
        alt="Celife Health Solutions"
        width={200}
        height={66}
        priority
        className={cn(
          "h-11 sm:h-12 md:h-[50px] w-auto object-contain transition-opacity duration-200"
        )}
      />
    </div>
  );
}
