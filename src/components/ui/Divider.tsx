import React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps {
  className?: string;
  gold?: boolean;
}

export function Divider({ className, gold = false }: DividerProps) {
  return (
    <hr
      className={cn(
        "border-0 h-px w-full",
        gold ? "bg-primary/30" : "bg-white/10",
        className
      )}
    />
  );
}
