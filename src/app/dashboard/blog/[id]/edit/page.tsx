import React, { Suspense } from "react";
import { BlogEditClient } from "@/components/dashboard/blog/BlogEditClient";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-white/40 select-none">
          <Loader2 className="animate-spin" size={16} />
        </div>
      }
    >
      <BlogEditClient id={id} />
    </Suspense>
  );
}
