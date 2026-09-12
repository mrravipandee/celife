import React from "react";
import type { Metadata } from "next";
import { getProjects } from "@/lib/services/projects";
import { Project as ProjectType } from "@/types/project";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { constructMetadata } from "@/config/seo";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = constructMetadata({
  title: "Case Studies & Portfolio | THEDCO",
  description:
    "Explore our premium hospitality advisory projects, hotel launch case studies, restaurant operations turnaround, and branding transformations across India.",
});

export default async function ProjectsPage() {
  let projects: ProjectType[] = [];
  try {
    projects = await getProjects();
  } catch (error) {
    console.error("Failed to fetch projects at render-time:", error);
  }

  // Preserve projects data reference for commented UI below
  void projects;

  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-black text-white relative min-h-screen flex flex-col justify-center items-center">
        {/* 
          =================================================================
          INACTIVE / COMMENTED OUT ORIGINAL PROJECTS UI RENDERING
          =================================================================
          <ProjectsHero />

          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              {projects.length === 0 ? (
                <Reveal>
                  <div className="border border-white/10 rounded-lg p-12 text-center bg-white/[0.02]">
                    <p className="text-sm text-white/40 tracking-wide font-sans leading-relaxed">
                      No case studies published yet. Check back soon for hotel and restaurant project reviews.
                    </p>
                  </div>
                </Reveal>
              ) : (
                <ProjectGrid projects={projects} />
              )}
            </div>
          </section>
        */}

        {/* Coming Soon Section */}
        <section className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-32 text-center relative overflow-hidden">
          {/* Subtle gold radial ambient glow */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,74,0.08)_0%,transparent_70%)] pointer-events-none" 
            aria-hidden="true"
          />

          <Reveal>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center space-y-6">
              <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-primary font-semibold">
                PROJECTS
              </span>

              <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-tight select-text">
                Coming Soon
              </h1>

              <div className="w-12 h-[1px] bg-primary/60 my-2" />

              <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed max-w-md">
                Our projects are currently being prepared. Check back soon.
              </p>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
