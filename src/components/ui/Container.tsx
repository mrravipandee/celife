import React from "react";

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
}

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return <Tag className={className}>{children}</Tag>;
}
