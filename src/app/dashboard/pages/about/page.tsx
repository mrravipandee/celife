"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Upload,
  Plus,
  Trash2,
} from "lucide-react";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import Link from "next/link";

interface FormulationPillar {
  title: string;
  desc: string;
}

interface AboutSections {
  hero?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
  };
  narrative?: {
    heading?: string;
    description?: string;
    image?: string;
    pillars?: FormulationPillar[];
  };
  principles?: {
    heading?: string;
    description?: string;
    items?: FormulationPillar[];
  };
  cta?: {
    heading?: string;
    description?: string;
    ctaLabel?: string;
    ctaLink?: string;
  };
}

interface AboutSEO {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export default function AboutPageCMSEditor() {
  const prefersReduced = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [sections, setSections] = useState<AboutSections>({
    hero: {},
    narrative: { pillars: [] },
    principles: { items: [] },
    cta: {},
  });
  const [seo, setSeo] = useState<AboutSEO>({});
  const [published, setPublished] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadContent() {
      try {
        const res = await fetch("/api/pages/about");
        if (!res.ok) throw new Error("Failed to load about page content");
        const json = await res.json();
        if (active && json.success && json.data) {
          setSections(json.data.sections || {});
          setSeo(json.data.seo || {});
          setPublished(json.data.published ?? true);
        }
      } catch (err: unknown) {
        if (active) {
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
      const res = await fetch("/api/pages/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, seo, published }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to save about page");
      }

      setSaveState("success");
      setSaveMessage("About page updated and published live!");
      setTimeout(() => setSaveState("idle"), 3000);
    } catch (err: unknown) {
      setSaveState("error");
      setSaveMessage(err instanceof Error ? err.message : "Failed to save changes");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setSections((prev) => ({
        ...prev,
        narrative: {
          ...prev.narrative,
          image: data.url,
        },
      }));
    } catch (err: unknown) {
      alert("Upload error: " + (err instanceof Error ? err.message : "Failed"));
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <LoadingState variant="form" />;
  if (error) return <ErrorState title="Error Loading About Content" description={error} onRetry={() => window.location.reload()} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-20 select-none max-w-4xl"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#81998D]">
              Page Content Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            About Page CMS
          </h1>
          <p className="text-xs text-white/60 font-sans mt-0.5">
            Manage company philosophy, botanical formulation pillars, and ethical commitments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about"
            target="_blank"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1.5 border border-white/10"
          >
            <span>Preview</span>
            <ExternalLink size={13} />
          </Link>

          <button
            onClick={handleSave}
            disabled={saveState === "saving"}
            className="px-5 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-all flex items-center gap-2 border border-white/10 shadow-xs cursor-pointer disabled:opacity-50"
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

      {/* Hero Section */}
      <div className="bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8 space-y-5">
        <h2 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
          Hero Header
        </h2>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Eyebrow
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
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Heading
          </label>
          <input
            type="text"
            value={sections.hero?.heading || ""}
            onChange={(e) =>
              setSections({
                ...sections,
                hero: { ...sections.hero, heading: e.target.value },
              })
            }
            className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Narrative Introduction
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
      </div>

      {/* Brand Narrative & Image */}
      <div className="bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8 space-y-5">
        <h2 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
          Formulation Standard & Image
        </h2>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Section Heading
          </label>
          <input
            type="text"
            value={sections.narrative?.heading || ""}
            onChange={(e) =>
              setSections({
                ...sections,
                narrative: { ...sections.narrative, heading: e.target.value },
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
            rows={3}
            value={sections.narrative?.description || ""}
            onChange={(e) =>
              setSections({
                ...sections,
                narrative: { ...sections.narrative, description: e.target.value },
              })
            }
            className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Main Visual Image
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sections.narrative?.image || ""}
              onChange={(e) =>
                setSections({
                  ...sections,
                  narrative: { ...sections.narrative, image: e.target.value },
                })
              }
              className="flex-1 bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
            <label className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10">
              <Upload size={13} />
              <span>{isUploading ? "Uploading..." : "Upload"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* Pillars */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans">
            Formulation Pillars
          </label>
          {(sections.narrative?.pillars || []).map((pillar: FormulationPillar, idx: number) => (
            <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-[#81998D]">
                  Pillar #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentPillars = sections.narrative?.pillars || [];
                    const updated = currentPillars.filter((_: FormulationPillar, i: number) => i !== idx);
                    setSections({
                      ...sections,
                      narrative: { ...sections.narrative, pillars: updated },
                    });
                  }}
                  className="text-white/40 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="text"
                value={pillar.title || ""}
                onChange={(e) => {
                  const currentPillars = sections.narrative?.pillars || [];
                  const updated = [...currentPillars];
                  updated[idx] = { ...updated[idx], title: e.target.value };
                  setSections({
                    ...sections,
                    narrative: { ...sections.narrative, pillars: updated },
                  });
                }}
                placeholder="Pillar Title (e.g. Evidence-Guided Synergies)"
                className="w-full bg-[#0A1410] border border-white/10 px-3 py-1.5 text-xs text-white rounded-xs focus:border-[#81998D] outline-none"
              />
              <textarea
                rows={2}
                value={pillar.desc || ""}
                onChange={(e) => {
                  const currentPillars = sections.narrative?.pillars || [];
                  const updated = [...currentPillars];
                  updated[idx] = { ...updated[idx], desc: e.target.value };
                  setSections({
                    ...sections,
                    narrative: { ...sections.narrative, pillars: updated },
                  });
                }}
                placeholder="Pillar Description"
                className="w-full bg-[#0A1410] border border-white/10 px-3 py-1.5 text-xs text-white rounded-xs focus:border-[#81998D] outline-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const current = sections.narrative?.pillars || [];
              setSections({
                ...sections,
                narrative: {
                  ...sections.narrative,
                  pillars: [...current, { title: "", desc: "" }],
                },
              });
            }}
            className="text-xs text-[#81998D] hover:text-white transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider"
          >
            <Plus size={13} />
            <span>Add Pillar</span>
          </button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8 space-y-5">
        <h2 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
          Bottom Enquiry Call to Action
        </h2>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            CTA Heading
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
            CTA Description
          </label>
          <input
            type="text"
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
              Button Label
            </label>
            <input
              type="text"
              value={sections.cta?.ctaLabel || ""}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, ctaLabel: e.target.value },
                })
              }
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              Button Destination
            </label>
            <input
              type="text"
              value={sections.cta?.ctaLink || ""}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, ctaLink: e.target.value },
                })
              }
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8 space-y-5">
        <h2 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
          About Page SEO
        </h2>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Meta Title
          </label>
          <input
            type="text"
            value={seo.metaTitle || ""}
            onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
            placeholder="About Celife Health Solutions | Science, Botanicals & Quality"
            className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Meta Description
          </label>
          <textarea
            rows={2}
            value={seo.metaDescription || ""}
            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
            placeholder="Learn about Celife Health Solutions philosophy..."
            className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
