import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-6 py-3 text-xs uppercase tracking-widest font-sans transition-all duration-300",
        variant === "primary" && "bg-primary text-black hover:bg-white hover:text-black",
        variant === "secondary" && "bg-white text-black hover:bg-primary hover:text-black",
        variant === "outline" && "border border-white/20 text-white hover:border-primary hover:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
