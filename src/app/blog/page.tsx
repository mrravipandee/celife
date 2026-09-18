import React from "react";
import type { Metadata } from "next";
import { getBlogs, BlogItem } from "@/lib/services/blogs";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { constructMetadata } from "@/config/seo";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const revalidate = 3600; // Revalidate hourly

export const metadata: Metadata = constructMetadata({
  title: "Health & Wellness Insights | Celife Health Solutions",
  description:
    "Explore herbal formulation research, wellness science, and nutritional health guidance from the team at Celife Health Solutions.",
});

export default async function BlogIndexPage() {
  const blogs: BlogItem[] = await getBlogs();

  // Highlight first article as featured if available
  const featuredBlog = blogs.length > 0 ? blogs[0] : undefined;
  const listBlogs = blogs.length > 1 ? blogs.slice(1) : blogs;

  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-black text-white relative min-h-screen">
        {/* Section 1: Hero Header & Featured Card */}
        <BlogHero featuredBlog={featuredBlog} />

        {/* Section 2: Article Grid & Category Filters */}
        {listBlogs.length > 0 && <BlogGrid blogs={listBlogs} />}
      </main>

      <Footer />
    </SmoothScroll>
  );
}
