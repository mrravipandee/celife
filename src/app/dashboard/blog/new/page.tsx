import React, { Suspense } from "react";
import { BlogCreateClient } from "@/components/dashboard/blog/BlogCreateClient";
import { Loader2 } from "lucide-react";

export default function NewBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-white/40 select-none">
          <Loader2 className="animate-spin" size={16} />
        </div>
      }
    >
      <BlogCreateClient />
    </Suspense>
  );
}
