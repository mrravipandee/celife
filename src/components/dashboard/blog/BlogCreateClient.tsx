"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BackendBlog } from "@/types/blog";
import { createBlogClient } from "@/lib/services/blogs-client";
import { BlogForm } from "./BlogEditor";

export function BlogCreateClient() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleSave = async (payload: Partial<BackendBlog>) => {
    try {
      const res = await createBlogClient(payload);
      startTransition(() => {
        router.push(`/dashboard/blog/${res.id}/edit?saved=true`);
      });
    } catch (err: unknown) {
      console.error("Failed to create blog post:", err);
      throw err;
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/blog");
  };

  return (
    <BlogForm
      mode="create"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
