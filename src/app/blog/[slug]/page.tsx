import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/lib/services/blogs";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { BlogBanner } from "@/components/blog/BlogBanner";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600; // Revalidate hourly

// Generate static params for static site generation at build time
export async function generateStaticParams() {
  try {
    const blogs = await getBlogs();
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.warn("Failed to generate static params for blogs:", error);
    return [];
  }
}

// Generate dynamic metadata
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await getBlogBySlug(slug);
    if (!blog) {
      return constructMetadata({
        title: "Article Not Found",
        description: "The requested article details could not be found.",
      });
    }

    return constructMetadata({
      title: `${blog.title} | THEDCO Insights`,
      description: blog.excerpt,
      image: blog.coverImage.url,
    });
  } catch (error) {
    console.error("Failed to generate blog metadata:", error);
    return constructMetadata({
      title: "Insights Article | THEDCO",
      description: "Read premium hospitality advisory articles.",
    });
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let blog = null;

  try {
    blog = await getBlogBySlug(slug);
  } catch (error) {
    console.error("Failed to fetch blog details:", error);
  }

  if (!blog) {
    notFound();
  }

  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      {/* Fixed Reading Progress Bar at viewport top */}
      <ReadingProgressBar />

      <main className="bg-black text-white relative min-h-screen">
        {/* Cover Image banner with Parallax-out */}
        <BlogBanner url={blog.coverImage.url} alt={blog.coverImage.alt} />

        {/* Content details */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            {/* Header Block */}
            <div className="space-y-6 pb-8 relative">
              <LineReveal className="absolute bottom-0 left-0 bg-white/10 w-full" />

              <Reveal>
                <div className="flex items-center space-x-4 text-xs md:text-sm">
                  <span className="uppercase tracking-[0.2em] text-primary font-semibold font-mono">
                    {blog.category}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/70 font-mono">{blog.readTime} MIN READ</span>
                </div>
              </Reveal>

              <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight select-text">
                <TextReveal text={blog.title} delay={0.15} />
              </h1>

              <Reveal delay={0.3}>
                <div className="text-sm text-white/70 font-sans tracking-wide font-light">
                  Published by <span className="text-primary font-semibold font-sans">{blog.author.name}</span>
                </div>
              </Reveal>
            </div>

            {/* Rendered Body Content with Lightweight Low-Amplitude Fade-in */}
            <div className="pt-4">
              <ArticleContent content={blog.content} />
            </div>

            {/* Post-Reading CTA */}
            <BlogCTA />
          </div>
        </section>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
