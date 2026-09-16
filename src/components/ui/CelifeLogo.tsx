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

  return (
    <div className={cn("relative flex items-center shrink-0 select-none", className)}>
      <Image
        src="/celife.png"
        alt="Celife Health Solutions"
        width={135}
        height={45}
        priority
        className={cn(
          "h-8 sm:h-9 w-auto object-contain transition-opacity duration-200",
          isLight && "brightness-0 invert opacity-95"
        )}
      />
    </div>
  );
}
