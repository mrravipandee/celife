"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layout,
  Layers,
  HeartHandshake,
  ShieldCheck,
  Send,
  Search,
  ExternalLink,
  Upload,
} from "lucide-react";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import Link from "next/link";

interface HeroSection {
  eyebrow?: string;
  heading?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  heroImage?: string;
  spotlightBadge?: string;
  spotlightTitle?: string;
  spotlightSubtitle?: string;
  spotlightLink?: string;
  packInfo?: string;
}

interface FeaturedProductsSection {
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  description?: string;
}

interface PhilosophySection {
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  description?: string;
  image?: string;
  ctaLabel?: string;
  ctaLink?: string;
  points?: string[];
}

interface QualityTrustSection {
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  description?: string;
}

interface CTASection {
  enabled?: boolean;
  heading?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
}

interface HomepageSections {
  hero?: HeroSection;
  featuredProducts?: FeaturedProductsSection;
  philosophy?: PhilosophySection;
  qualityTrust?: QualityTrustSection;
  cta?: CTASection;
}

interface PageSEO {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

type TabKey = "hero" | "featured" | "philosophy" | "quality" | "cta" | "seo";
type SaveState = "idle" | "saving" | "success" | "error";

export default function HomepageCMSEditor() {
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Content state
  const [sections, setSections] = useState<HomepageSections>({});
  const [seo, setSeo] = useState<PageSEO>({});
  const [published, setPublished] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadContent() {
      try {
        const res = await fetch("/api/pages/homepage");
        if (!res.ok) throw new Error("Failed to load homepage content");
        const json = await res.json();
        if (active && json.success && json.data) {
          setSections(json.data.sections || {});
          setSeo(json.data.seo || {});
          setPublished(json.data.published ?? true);
        }
      } catch (err: unknown) {
        if (active) {
          console.error("Homepage CMS load error:", err);
          setError(err instanceof Error ? err.message : "Failed to load content");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    void loadContent();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    setSaveState("saving");
    setSaveMessage("");
    try {
      const res = await fetch("/api/pages/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, seo, published }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to save homepage");
      }

      setSaveState("success");
      setSaveMessage("Homepage updated and published live!");
      setTimeout(() => setSaveState("idle"), 3000);
    } catch (err: unknown) {
      setSaveState("error");
      setSaveMessage(err instanceof Error ? err.message : "Failed to save changes");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Upload failed");
      }

      const url = data.url;
      const parts = fieldPath.split(".");
      if (parts.length === 2 && parts[0] === "hero") {
        setSections((prev) => ({
          ...prev,
          hero: {
            ...prev.hero,
            [parts[1]]: url,
          },
        }));
      }
    } catch (err: unknown) {
      alert("Image upload error: " + (err instanceof Error ? err.message : "Failed"));
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <LoadingState variant="table" />;
  if (error) return <ErrorState title="Error Loading Homepage Content" description={error} onRetry={() => window.location.reload()} />;

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { key: "hero", label: "Hero Banner", icon: Layout },
    { key: "featured", label: "Featured Products", icon: Layers },
    { key: "philosophy", label: "Philosophy & Heritage", icon: HeartHandshake },
    { key: "quality", label: "Therapeutic Categories", icon: ShieldCheck },
    { key: "cta", label: "Product Enquiry CTA", icon: Send },
    { key: "seo", label: "SEO & Social", icon: Search },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-20 select-none"
    >
      {/* Top Bar with Page Title & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#81998D]">
              Page Content Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Homepage Editor
          </h1>
          <p className="text-xs text-white/60 font-sans mt-0.5">
            Modify text, banners, featured products, and calls-to-action for the public homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1.5 border border-white/10"
          >
            <span>Preview</span>
            <ExternalLink size={13} />
          </Link>

          <button
            onClick={handleSave}
            disabled={saveState === "saving"}
            className="px-5 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-all flex items-center gap-2 border border-white/10 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {saveState === "saving" ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveState === "success" ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Feedback Banner */}
      {saveMessage && (
        <div
          className={`p-4 rounded-xs text-xs font-sans flex items-center gap-2.5 ${
            saveState === "error"
              ? "bg-red-500/15 border border-red-500/30 text-red-300"
              : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
          }`}
        >
          {saveState === "error" ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-sans font-medium uppercase tracking-wider rounded-xs transition-all flex items-center gap-2 cursor-pointer ${
                active
                  ? "bg-[#123C2D] text-white font-semibold border border-white/10 shadow-xs"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={14} className={active ? "text-[#C4D5C7]" : "text-white/40"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8">
        
        {/* ─── TAB 1: HERO ───────────────────────────────────────── */}
        {activeTab === "hero" && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Hero Section Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Eyebrow Tagline
                </label>
                <input
                  type="text"
                  value={sections.hero?.eyebrow || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      hero: { ...sections.hero, eyebrow: e.target.value },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                  placeholder="e.g. Healthcare & Wellness Formulations"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Main Headline
                </label>
                <textarea
                  rows={3}
                  value={sections.hero?.heading || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      hero: { ...sections.hero, heading: e.target.value },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                  placeholder="Targeted Wellness Guided by Botanical Purity & Evidence."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Hero Narrative / Description
                </label>
                <textarea
                  rows={3}
                  value={sections.hero?.description || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      hero: { ...sections.hero, description: e.target.value },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={sections.hero?.primaryCtaLabel || ""}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        hero: { ...sections.hero, primaryCtaLabel: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                    placeholder="Explore Products"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                    Primary CTA Destination
                  </label>
                  <input
                    type="text"
                    value={sections.hero?.primaryCtaLink || ""}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        hero: { ...sections.hero, primaryCtaLink: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                    placeholder="/products"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={sections.hero?.secondaryCtaLabel || ""}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        hero: { ...sections.hero, secondaryCtaLabel: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                    placeholder="Product Enquiry"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                    Secondary CTA Destination
                  </label>
                  <input
                    type="text"
                    value={sections.hero?.secondaryCtaLink || ""}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        hero: { ...sections.hero, secondaryCtaLink: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                    placeholder="/enquire"
                  />
                </div>
              </div>

              {/* Spotlight Product Image & Badge */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h3 className="text-sm font-serif font-bold text-[#C4D5C7]">
                  Hero Showcase Product
                </h3>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                    Product Image Path or URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sections.hero?.heroImage || ""}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          hero: { ...sections.hero, heroImage: e.target.value },
                        })
                      }
                      className="flex-1 bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                      placeholder="/images/products/nervify-forte.jpg"
                    />
                    <label className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10">
                      <Upload size={13} />
                      <span>{isUploading ? "Uploading..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "hero.heroImage")}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                      Spotlight Badge
                    </label>
                    <input
                      type="text"
                      value={sections.hero?.spotlightBadge || ""}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          hero: { ...sections.hero, spotlightBadge: e.target.value },
                        })
                      }
                      className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                      Spotlight Title
                    </label>
                    <input
                      type="text"
                      value={sections.hero?.spotlightTitle || ""}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          hero: { ...sections.hero, spotlightTitle: e.target.value },
                        })
                      }
                      className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                      Spotlight Subtitle
                    </label>
                    <input
                      type="text"
                      value={sections.hero?.spotlightSubtitle || ""}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          hero: { ...sections.hero, spotlightSubtitle: e.target.value },
                        })
                      }
                      className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                      Pack Presentation Info
                    </label>
                    <input
                      type="text"
                      value={sections.hero?.packInfo || ""}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          hero: { ...sections.hero, packInfo: e.target.value },
                        })
                      }
                      className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                      placeholder="60 Film-Coated Tablets"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: FEATURED PRODUCTS ──────────────────────────── */}
        {activeTab === "featured" && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-serif font-bold text-white">
                Featured Products Section
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.featuredProducts?.enabled !== false}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      featuredProducts: {
                        ...sections.featuredProducts,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded-xs w-4 h-4 accent-[#123C2D]"
                />
                <span className="text-xs uppercase tracking-wider text-white/80 font-sans">
                  Enable Section
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Section Eyebrow
                </label>
                <input
                  type="text"
                  value={sections.featuredProducts?.eyebrow || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      featuredProducts: {
                        ...sections.featuredProducts,
                        eyebrow: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={sections.featuredProducts?.heading || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      featuredProducts: {
                        ...sections.featuredProducts,
                        heading: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Section Description
                </label>
                <textarea
                  rows={2}
                  value={sections.featuredProducts?.description || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      featuredProducts: {
                        ...sections.featuredProducts,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xs space-y-2">
                <span className="text-xs font-semibold text-[#81998D] block">
                  Product Source:
                </span>
                <p className="text-xs text-white/70 leading-relaxed">
                  Featured products are automatically selected from the central Product CMS. You can mark any product as &ldquo;Featured&rdquo; directly in the{" "}
                  <Link href="/dashboard/products" className="text-white underline hover:text-[#C4D5C7]">
                    Products catalogue manager
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: PHILOSOPHY ─────────────────────────────────── */}
        {activeTab === "philosophy" && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-serif font-bold text-white">
                Philosophy & Heritage Section
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.philosophy?.enabled !== false}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      philosophy: {
                        ...sections.philosophy,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded-xs w-4 h-4 accent-[#123C2D]"
                />
                <span className="text-xs uppercase tracking-wider text-white/80 font-sans">
                  Enable Section
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Eyebrow
                </label>
                <input
                  type="text"
                  value={sections.philosophy?.eyebrow || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      philosophy: {
                        ...sections.philosophy,
                        eyebrow: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Heading
                </label>
                <input
                  type="text"
                  value={sections.philosophy?.heading || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      philosophy: {
                        ...sections.philosophy,
                        heading: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={sections.philosophy?.description || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      philosophy: {
                        ...sections.philosophy,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                    CTA Label
                  </label>
                  <input
                    type="text"
                    value={sections.philosophy?.ctaLabel || ""}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        philosophy: {
                          ...sections.philosophy,
                          ctaLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                    CTA Link
                  </label>
                  <input
                    type="text"
                    value={sections.philosophy?.ctaLink || ""}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        philosophy: {
                          ...sections.philosophy,
                          ctaLink: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: QUALITY & TRUST ────────────────────────────── */}
        {activeTab === "quality" && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-serif font-bold text-white">
                Therapeutic Categories & Quality
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.qualityTrust?.enabled !== false}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      qualityTrust: {
                        ...sections.qualityTrust,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded-xs w-4 h-4 accent-[#123C2D]"
                />
                <span className="text-xs uppercase tracking-wider text-white/80 font-sans">
                  Enable Section
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Eyebrow
                </label>
                <input
                  type="text"
                  value={sections.qualityTrust?.eyebrow || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      qualityTrust: {
                        ...sections.qualityTrust,
                        eyebrow: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Heading
                </label>
                <input
                  type="text"
                  value={sections.qualityTrust?.heading || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      qualityTrust: {
                        ...sections.qualityTrust,
                        heading: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={sections.qualityTrust?.description || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      qualityTrust: {
                        ...sections.qualityTrust,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: CTA ────────────────────────────────────────── */}
        {activeTab === "cta" && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-serif font-bold text-white">
                Bottom Product Enquiry CTA Section
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.cta?.enabled !== false}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      cta: {
                        ...sections.cta,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded-xs w-4 h-4 accent-[#123C2D]"
                />
                <span className="text-xs uppercase tracking-wider text-white/80 font-sans">
                  Enable Section
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Heading
                </label>
                <input
                  type="text"
                  value={sections.cta?.heading || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      cta: { ...sections.cta, heading: e.target.value },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={sections.cta?.description || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      cta: { ...sections.cta, description: e.target.value },
                    })
                  }
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={sections.cta?.primaryCtaLabel || ""}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        cta: { ...sections.cta, primaryCtaLabel: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                    Primary Destination
                  </label>
                  <input
                    type="text"
                    value={sections.cta?.primaryCtaLink || ""}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        cta: { ...sections.cta, primaryCtaLink: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 6: SEO ────────────────────────────────────────── */}
        {activeTab === "seo" && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Homepage Search Engine Optimization (SEO)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seo.metaTitle || ""}
                  onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                  placeholder="Celife Health Solutions | Targeted Wellness"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={seo.metaDescription || ""}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                  placeholder="Formulating evidence-guided botanical solutions..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
                  Social Sharing Image (OG Image)
                </label>
                <input
                  type="text"
                  value={seo.ogImage || ""}
                  onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                  className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                  placeholder="/images/hero/celife-wellness-hero.jpg"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
