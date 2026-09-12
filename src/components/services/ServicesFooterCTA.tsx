"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

export function ServicesFooterCTA() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });

  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const preferReduced = useReducedMotion();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          projectType: "Hospitality Advisory",
          message: "Enquiry submitted via Services page 'Not Sure Where to Start' form.",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", company: "", phone: "", email: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <section className="bg-black text-white py-20 md:py-28 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        {/* Section Header */}
        <Reveal className="space-y-4 mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
            NOT SURE WHERE TO START
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase leading-snug">
            Not Sure Where to Start
          </h2>
          <p className="text-base md:text-lg text-white/80 leading-relaxed font-sans font-light max-w-xl mx-auto">
            Tell us a bit about your business and we’ll point you to the right service.
          </p>
        </Reveal>

        {/* Form Container */}
        <AnimatePresence mode="wait">
          {submitStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: preferReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-8 md:p-12 border border-primary/40 bg-white/[0.015] rounded-sm space-y-6"
            >
              <div className="w-12 h-12 rounded-full border border-primary text-primary mx-auto flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <h3 className="text-2xl font-serif uppercase text-white">Thank You</h3>
              <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                We have received your details. Our advisory team will review your message and reach out shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitStatus("idle")}
                className="text-xs uppercase tracking-[0.2em] text-primary border border-primary/40 px-6 py-3 hover:bg-primary/10 transition-colors"
              >
                Submit Another Response
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-left max-w-2xl mx-auto"
            >
              {submitStatus === "error" && (
                <div className="p-4 border border-red-500/40 bg-red-950/20 text-red-300 text-xs rounded-sm">
                  Something went wrong submitting your response. Please try again.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans block">
                    Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/15 focus:border-primary px-4 py-3 text-white text-sm outline-none transition-colors rounded-sm"
                  />
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <label htmlFor="company" className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans block">
                    Business Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/15 focus:border-primary px-4 py-3 text-white text-sm outline-none transition-colors rounded-sm"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans block">
                    Mobile Number <span className="text-primary">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/15 focus:border-primary px-4 py-3 text-white text-sm outline-none transition-colors rounded-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans block">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/15 focus:border-primary px-4 py-3 text-white text-sm outline-none transition-colors rounded-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="inline-block text-xs uppercase tracking-[0.25em] bg-primary text-black font-semibold hover:bg-white hover:text-black px-10 py-4 transition-all duration-300 rounded-sm cursor-pointer disabled:opacity-50"
                >
                  {submitStatus === "loading" ? "Submitting..." : "Get In Touch"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
