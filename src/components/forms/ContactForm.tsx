"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { EnquiryFormSchema, type EnquiryFormData } from "@/lib/validations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const preferReduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(EnquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      projectType: "" as EnquiryFormData["projectType"],
      location: "",
      projectStage: "" as EnquiryFormData["projectStage"],
      businessStatus: "" as EnquiryFormData["businessStatus"],
      message: "",
    },
  });

  const formValues = watch();

  const onSubmit = async (data: EnquiryFormData) => {
    setSubmitStatus("loading");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    }
  };

  const handleRetry = () => {
    setSubmitStatus("idle");
  };

  // Shake animation for fields with active errors (2 oscillations, 6px, 250ms)
  const shakeVariant = (hasError: boolean) => {
    if (preferReduced || !hasError) return {};
    return {
      x: [0, -6, 6, -6, 6, 0],
      transition: { duration: 0.25, ease: "easeInOut" as const },
    };
  };

  return (
    <div id="contact-form" className="scroll-mt-24 w-full">
      <AnimatePresence mode="wait">
        {submitStatus === "success" ? (
          /* Success Screen with Animated Drawing Checkmark */
          <motion.div
            key="success-message"
            initial={{ opacity: 0, y: preferReduced ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center space-y-8 py-16 p-8 border border-white/10 bg-white/[0.015] rounded-sm"
          >
            {/* Animated Gold SVG Checkmark */}
            <div className="flex justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-primary">
                <motion.circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="#c9a24a"
                  strokeWidth="2"
                  initial={preferReduced ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <motion.path
                  d="M20 33L28 41L44 23"
                  stroke="#c9a24a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={preferReduced ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: preferReduced ? 0 : 0.4, ease: "easeOut" }}
                />
              </svg>
            </div>

            <span className="text-xs uppercase tracking-[0.35em] text-primary block font-semibold font-mono">
              ENQUIRY CONFIRMED
            </span>

            <h2 className="text-3xl sm:text-4xl font-serif uppercase tracking-tight text-white leading-tight">
              Your Requirements Have Been Received.
            </h2>

            <p className="text-sm md:text-base text-white/70 font-sans max-w-lg mx-auto leading-relaxed font-light">
              Our lead advisory team will review your project brief and reach out within 24 hours to schedule an introductory consultation.
            </p>

            <div className="pt-4 flex justify-center space-x-4">
              <button
                onClick={() => setSubmitStatus("idle")}
                className="text-xs uppercase tracking-[0.2em] bg-transparent text-primary border border-primary/40 hover:border-primary hover:bg-primary/10 px-8 py-3.5 transition-all duration-300 font-medium cursor-pointer"
              >
                Submit Another Enquiry
              </button>
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.2em] bg-transparent text-white border border-white/20 hover:border-white px-8 py-3.5 transition-all duration-300 font-medium"
              >
                Return to Home
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Active Form Screen */
          <motion.div
            key="form-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            {submitStatus === "error" && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-12 p-6 border border-red-500/30 bg-red-950/20 text-white max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 rounded-sm"
              >
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-red-400">
                    Submission Error
                  </h4>
                  <p className="text-xs text-white/70 font-sans">
                    Something went wrong submitting your form. Please try again or reach out to us directly via email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-xs uppercase tracking-[0.2em] border border-white/20 text-white hover:border-white hover:bg-white hover:text-black px-6 py-2.5 transition-all duration-300 font-semibold cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-12">
              {/* Honeypot hidden input */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Leave blank</label>
                <input id="website" type="text" autoComplete="off" {...register("website")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                {/* ─── Column 1: Primary Details ────────────────────────────────────── */}
                <div className="space-y-10">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-primary font-bold border-b border-primary/20 pb-2">
                    01 — Primary Details
                  </h3>

                  {/* Full Name */}
                  <motion.div animate={shakeVariant(Boolean(errors.name))} className="relative flex flex-col group">
                    <label
                      htmlFor="name"
                      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-200 block mb-1.5 ${
                        errors.name
                          ? "text-red-400"
                          : focusedField === "name"
                          ? "text-primary font-semibold"
                          : "text-white/60 group-hover:text-white/80"
                      }`}
                    >
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      className="bg-transparent text-white border-b border-white/15 py-2.5 font-sans outline-none w-full text-sm sm:text-base placeholder:text-white/20 transition-colors focus:border-transparent"
                      onFocus={() => setFocusedField("name")}
                      {...register("name", {
                        onBlur: () => setFocusedField(null),
                      })}
                    />
                    {/* Animated Underline */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none overflow-hidden">
                      <motion.div
                        animate={{
                          scaleX: focusedField === "name" || errors.name ? 1 : 0,
                          backgroundColor: errors.name ? "#ef4444" : "#c9a24a",
                        }}
                        style={{ transformOrigin: "left" }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.span
                          role="alert"
                          aria-live="polite"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[10px] uppercase tracking-[0.15em] text-red-400 mt-1.5 block overflow-hidden font-mono"
                        >
                          {errors.name.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Email Address */}
                  <motion.div animate={shakeVariant(Boolean(errors.email))} className="relative flex flex-col group">
                    <label
                      htmlFor="email"
                      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-200 block mb-1.5 ${
                        errors.email
                          ? "text-red-400"
                          : focusedField === "email"
                          ? "text-primary font-semibold"
                          : "text-white/60 group-hover:text-white/80"
                      }`}
                    >
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      className="bg-transparent text-white border-b border-white/15 py-2.5 font-sans outline-none w-full text-sm sm:text-base placeholder:text-white/20 transition-colors focus:border-transparent"
                      onFocus={() => setFocusedField("email")}
                      {...register("email", {
                        onBlur: () => setFocusedField(null),
                      })}
                    />
                    {/* Animated Underline */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none overflow-hidden">
                      <motion.div
                        animate={{
                          scaleX: focusedField === "email" || errors.email ? 1 : 0,
                          backgroundColor: errors.email ? "#ef4444" : "#c9a24a",
                        }}
                        style={{ transformOrigin: "left" }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span
                          role="alert"
                          aria-live="polite"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[10px] uppercase tracking-[0.15em] text-red-400 mt-1.5 block overflow-hidden font-mono"
                        >
                          {errors.email.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Phone Number */}
                  <motion.div animate={shakeVariant(Boolean(errors.phone))} className="relative flex flex-col group">
                    <label
                      htmlFor="phone"
                      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-200 block mb-1.5 ${
                        errors.phone
                          ? "text-red-400"
                          : focusedField === "phone"
                          ? "text-primary font-semibold"
                          : "text-white/60 group-hover:text-white/80"
                      }`}
                    >
                      Phone Number <span className="text-primary">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      className="bg-transparent text-white border-b border-white/15 py-2.5 font-sans outline-none w-full text-sm sm:text-base placeholder:text-white/20 transition-colors focus:border-transparent"
                      onFocus={() => setFocusedField("phone")}
                      {...register("phone", {
                        onBlur: () => setFocusedField(null),
                      })}
                    />
                    {/* Animated Underline */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none overflow-hidden">
                      <motion.div
                        animate={{
                          scaleX: focusedField === "phone" || errors.phone ? 1 : 0,
                          backgroundColor: errors.phone ? "#ef4444" : "#c9a24a",
                        }}
                        style={{ transformOrigin: "left" }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.span
                          role="alert"
                          aria-live="polite"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[10px] uppercase tracking-[0.15em] text-red-400 mt-1.5 block overflow-hidden font-mono"
                        >
                          {errors.phone.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Business / Company Name */}
                  <div className="relative flex flex-col group">
                    <label
                      htmlFor="company"
                      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-200 block mb-1.5 ${
                        focusedField === "company"
                          ? "text-primary font-semibold"
                          : "text-white/60 group-hover:text-white/80"
                      }`}
                    >
                      Business / Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="e.g. Panchavati Hospitality"
                      className="bg-transparent text-white border-b border-white/15 py-2.5 font-sans outline-none w-full text-sm sm:text-base placeholder:text-white/20 transition-colors focus:border-transparent"
                      onFocus={() => setFocusedField("company")}
                      {...register("company", {
                        onBlur: () => setFocusedField(null),
                      })}
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none overflow-hidden">
                      <motion.div
                        animate={{ scaleX: focusedField === "company" ? 1 : 0 }}
                        style={{ transformOrigin: "left" }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full bg-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* ─── Column 2: Project Profile ────────────────────────────────────── */}
                <div className="space-y-10">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-primary font-bold border-b border-primary/20 pb-2">
                    02 — Project Profile
                  </h3>

                  {/* Project Type */}
                  <motion.div animate={shakeVariant(Boolean(errors.projectType))} className="relative flex flex-col group">
                    <label
                      htmlFor="projectType"
                      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-200 block mb-1.5 ${
                        errors.projectType
                          ? "text-red-400"
                          : focusedField === "projectType"
                          ? "text-primary font-semibold"
                          : "text-white/60 group-hover:text-white/80"
                      }`}
                    >
                      Project Type <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="projectType"
                        className={`bg-transparent border-b border-white/15 py-2.5 font-sans outline-none w-full appearance-none cursor-pointer pr-10 text-sm sm:text-base transition-colors focus:border-transparent ${
                          formValues.projectType ? "text-white" : "text-white/40"
                        }`}
                        onFocus={() => setFocusedField("projectType")}
                        {...register("projectType", {
                          onBlur: () => setFocusedField(null),
                        })}
                      >
                        <option value="" disabled className="bg-[#111] text-white/40">
                          Select project type
                        </option>
                        <option value="Hotel" className="bg-[#111] text-white">Hotel</option>
                        <option value="Restaurant" className="bg-[#111] text-white">Restaurant</option>
                        <option value="Resort" className="bg-[#111] text-white">Resort</option>
                        <option value="Café" className="bg-[#111] text-white">Café</option>
                        <option value="QSR" className="bg-[#111] text-white">QSR</option>
                        <option value="Banquet / Events" className="bg-[#111] text-white">Banquet / Events</option>
                        <option value="Cloud Kitchen" className="bg-[#111] text-white">Cloud Kitchen</option>
                        <option value="Hospitality Investment" className="bg-[#111] text-white">Hospitality Investment</option>
                        <option value="Existing Business Improvement" className="bg-[#111] text-white">Existing Business Improvement</option>
                        <option value="Other" className="bg-[#111] text-white">Other</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary/70 group-hover:text-primary transition-colors">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.218 0.209-0.509 0.314-0.789 0.314s-0.571-0.105-0.789-0.314l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z" />
                        </svg>
                      </div>
                    </div>
                    {/* Animated Underline */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none overflow-hidden">
                      <motion.div
                        animate={{
                          scaleX: focusedField === "projectType" || errors.projectType ? 1 : 0,
                          backgroundColor: errors.projectType ? "#ef4444" : "#c9a24a",
                        }}
                        style={{ transformOrigin: "left" }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.projectType && (
                        <motion.span
                          role="alert"
                          aria-live="polite"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[10px] uppercase tracking-[0.15em] text-red-400 mt-1.5 block overflow-hidden font-mono"
                        >
                          {errors.projectType.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Location */}
                  <div className="relative flex flex-col group">
                    <label
                      htmlFor="location"
                      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-200 block mb-1.5 ${
                        focusedField === "location"
                          ? "text-primary font-semibold"
                          : "text-white/60 group-hover:text-white/80"
                      }`}
                    >
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="bg-transparent text-white border-b border-white/15 py-2.5 font-sans outline-none w-full text-sm sm:text-base placeholder:text-white/20 transition-colors focus:border-transparent"
                      onFocus={() => setFocusedField("location")}
                      {...register("location", {
                        onBlur: () => setFocusedField(null),
                      })}
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none overflow-hidden">
                      <motion.div
                        animate={{ scaleX: focusedField === "location" ? 1 : 0 }}
                        style={{ transformOrigin: "left" }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full bg-primary"
                      />
                    </div>
                  </div>

                  {/* Current Business Status */}
                  <div className="relative flex flex-col group">
                    <label
                      htmlFor="businessStatus"
                      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-200 block mb-1.5 ${
                        focusedField === "businessStatus"
                          ? "text-primary font-semibold"
                          : "text-white/60 group-hover:text-white/80"
                      }`}
                    >
                      Current Business Status
                    </label>
                    <div className="relative">
                      <select
                        id="businessStatus"
                        className={`bg-transparent border-b border-white/15 py-2.5 font-sans outline-none w-full appearance-none cursor-pointer pr-10 text-sm sm:text-base transition-colors focus:border-transparent ${
                          formValues.businessStatus ? "text-white" : "text-white/40"
                        }`}
                        onFocus={() => setFocusedField("businessStatus")}
                        {...register("businessStatus", {
                          onBlur: () => setFocusedField(null),
                        })}
                      >
                        <option value="" className="bg-[#111] text-white/40">Select status</option>
                        <option value="Planning a New Project" className="bg-[#111] text-white">Planning a New Project</option>
                        <option value="Currently Operating" className="bg-[#111] text-white">Currently Operating</option>
                        <option value="Renovation / Expansion" className="bg-[#111] text-white">Renovation / Expansion</option>
                        <option value="Looking for Improvement" className="bg-[#111] text-white">Looking for Improvement</option>
                        <option value="Investment Planning" className="bg-[#111] text-white">Investment Planning</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary/70 group-hover:text-primary transition-colors">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.218 0.209-0.509 0.314-0.789 0.314s-0.571-0.105-0.789-0.314l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none overflow-hidden">
                      <motion.div
                        animate={{ scaleX: focusedField === "businessStatus" ? 1 : 0 }}
                        style={{ transformOrigin: "left" }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full bg-primary"
                      />
                    </div>
                  </div>

                  {/* Approximate Project Stage */}
                  <div className="relative flex flex-col group">
                    <label
                      htmlFor="projectStage"
                      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-200 block mb-1.5 ${
                        focusedField === "projectStage"
                          ? "text-primary font-semibold"
                          : "text-white/60 group-hover:text-white/80"
                      }`}
                    >
                      Approximate Project Stage
                    </label>
                    <div className="relative">
                      <select
                        id="projectStage"
                        className={`bg-transparent border-b border-white/15 py-2.5 font-sans outline-none w-full appearance-none cursor-pointer pr-10 text-sm sm:text-base transition-colors focus:border-transparent ${
                          formValues.projectStage ? "text-white" : "text-white/40"
                        }`}
                        onFocus={() => setFocusedField("projectStage")}
                        {...register("projectStage", {
                          onBlur: () => setFocusedField(null),
                        })}
                      >
                        <option value="" className="bg-[#111] text-white/40">Select stage</option>
                        <option value="Concept" className="bg-[#111] text-white">Concept</option>
                        <option value="Planning" className="bg-[#111] text-white">Planning</option>
                        <option value="Pre-Opening" className="bg-[#111] text-white">Pre-Opening</option>
                        <option value="Operating" className="bg-[#111] text-white">Operating</option>
                        <option value="Expansion" className="bg-[#111] text-white">Expansion</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary/70 group-hover:text-primary transition-colors">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.218 0.209-0.509 0.314-0.789 0.314s-0.571-0.105-0.789-0.314l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none overflow-hidden">
                      <motion.div
                        animate={{ scaleX: focusedField === "projectStage" ? 1 : 0 }}
                        style={{ transformOrigin: "left" }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Message / Brief */}
              <motion.div animate={shakeVariant(Boolean(errors.message))} className="relative flex flex-col group pt-2">
                <label
                  htmlFor="message"
                  className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-200 block mb-1.5 ${
                    errors.message
                      ? "text-red-400"
                      : focusedField === "message"
                      ? "text-primary font-semibold"
                      : "text-white/60 group-hover:text-white/80"
                  }`}
                >
                  Tell us about your project <span className="text-primary">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Share a brief overview of your property, timelines, key challenges, or advisory objectives..."
                  className="bg-transparent text-white border-b border-white/15 py-2.5 font-sans outline-none resize-none w-full text-sm sm:text-base placeholder:text-white/20 transition-colors focus:border-transparent"
                  onFocus={() => setFocusedField("message")}
                  {...register("message", {
                    onBlur: () => setFocusedField(null),
                  })}
                />
                <div className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none overflow-hidden">
                  <motion.div
                    animate={{
                      scaleX: focusedField === "message" || errors.message ? 1 : 0,
                      backgroundColor: errors.message ? "#ef4444" : "#c9a24a",
                    }}
                    style={{ transformOrigin: "left" }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  />
                </div>
                <AnimatePresence>
                  {errors.message && (
                    <motion.span
                      role="alert"
                      aria-live="polite"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] uppercase tracking-[0.15em] text-red-400 mt-1.5 block overflow-hidden font-mono"
                    >
                      {errors.message.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Dynamic Submit Button (Idle -> Loading Spinner -> Disabled in Flight) */}
              <div className="pt-8 flex flex-col items-center">
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="group relative inline-flex items-center justify-center min-w-[260px] border border-white/80 bg-transparent px-12 py-5 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:border-primary hover:text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden rounded-sm"
                >
                  {/* Hover background fill */}
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100" />

                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    {submitStatus === "loading" ? (
                      <>
                        <motion.svg
                          animate={preferReduced ? {} : { rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 text-primary shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="#c9a24a" strokeWidth="2.5" strokeLinecap="round" />
                        </motion.svg>
                        <span className="font-mono text-[11px]">Transmitting Brief...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Enquiry</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
