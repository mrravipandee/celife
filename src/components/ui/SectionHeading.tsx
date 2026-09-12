import React from "react";

export interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  className?: string;
}

export function SectionHeading({ title, eyebrow, className }: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
    </div>
  );
}
