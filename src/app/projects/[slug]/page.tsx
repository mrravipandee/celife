import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/services/projects";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ProjectBanner } from "@/components/projects/ProjectBanner";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { ProjectGallery } from "@/components/projects/ProjectGallery";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600; // Revalidate every hour

// Generate static params for build-time static site optimization
export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.warn("Failed to generate static params at build-time:", error);
    return [];
  }
}

// Generate page-specific metadata dynamically
export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);

    if (!project) {
      return constructMetadata({
        title: "Project Not Found",
        description: "The requested project details could not be found.",
      });
    }

    return constructMetadata({
      title: `${project.title} | THEDCO`,
      description: project.description,
      image: project.coverImage,
    });
  } catch (error) {
    console.error("Failed to fetch metadata for project:", error);
    return constructMetadata({
      title: "Project details",
      description: "Explore our premium hospitality advisory projects.",
    });
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  let project = null;

  try {
    project = await getProjectBySlug(slug);
  } catch (error) {
    console.error("Failed to fetch project details at render-time:", error);
  }

  if (!project) {
    notFound();
  }

  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-black text-white relative min-h-screen">
        {/* Cover Banner with Scroll-Scrubbed Parallax */}
        <ProjectBanner
          src={project.coverImage || "/images/hero/hotel-lobby.jpg"}
          alt={project.title}
        />

        {/* Project Content */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            {/* Project Header & Specs */}
            <ProjectHeader
              title={project.title}
              category={project.category}
              location={project.location}
              year={project.year}
            />

            {/* Description & Deliverables Checklist */}
            <ProjectDetails
              description={project.description}
              services={project.services}
            />

            {/* Interactive Spatial Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="pt-12 border-t border-white/5">
                <ProjectGallery images={project.gallery} />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
