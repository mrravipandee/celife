"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<"email" | "password" | "account" | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorField(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorField("email");
      setErrorMessage("Please enter your operator email address.");
      return;
    }

    if (!password) {
      setErrorField("password");
      setErrorMessage("Please enter your security password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const body = await res.json();

      if (!res.ok || !body.success) {
        const field = body.error?.field || (body.error?.message?.toLowerCase().includes("email") ? "email" : body.error?.message?.toLowerCase().includes("password") ? "password" : null);
        const msg = body.error?.message || body.error || "Authentication failed. Please verify your credentials.";
        setErrorField(field);
        setErrorMessage(msg);
        return;
      }

      // Success -> Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Unable to connect to the authentication server. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@celife.in");
    setPassword("admin@321");
    setErrorMessage(null);
    setErrorField(null);
  };

  return (
    <div className="min-h-screen bg-[#070F0B] text-white flex flex-col justify-between selection:bg-[#123C2D] selection:text-white">
      {/* Top Brand Header */}
      <header className="border-b border-white/5 py-6 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ED1C24]" />
            <span className="text-base font-serif font-bold tracking-wider text-white">
              CELIFE
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-white/40 font-sans tracking-widest uppercase">
            Health Solutions
          </span>
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] text-[#81998D] font-mono font-medium">
          CMS Portal
        </span>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0.05 : 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="w-full max-w-md bg-[#0C1712] border border-white/10 p-8 md:p-10 rounded-xs shadow-2xl relative space-y-8"
        >
          {/* Subtle green line accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#81998D]/60 to-transparent" />

          {/* Heading */}
          <div className="space-y-2 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-[#81998D] block font-semibold">
              Management Access
            </span>
            <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
              Sign In to Dashboard
            </h1>
            <p className="text-sm text-white/70 font-sans">
              Enter your administrative credentials to manage products, page content, and enquiries.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xs flex items-center gap-3 text-red-300 text-xs md:text-sm font-sans"
            >
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] text-white/75 font-sans font-semibold block">
                Operator Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    errorField === "email" ? "text-red-400" : "text-white/40"
                  }`}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorField === "email") {
                      setErrorField(null);
                      setErrorMessage(null);
                    }
                  }}
                  placeholder="admin@celife.in"
                  className={`w-full bg-[#0a0a0a] border pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 rounded-xs outline-none transition-colors font-sans ${
                    errorField === "email"
                      ? "border-red-500/60 focus:border-red-400"
                      : "border-white/15 focus:border-primary/60"
                  }`}
                />
              </div>
              {errorField === "email" && (
                <p className="text-xs text-red-400 font-sans mt-1">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] text-white/75 font-sans font-semibold block">
                Security Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    errorField === "password" ? "text-red-400" : "text-white/40"
                  }`}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorField === "password") {
                      setErrorField(null);
                      setErrorMessage(null);
                    }
                  }}
                  placeholder="••••••••••••"
                  className={`w-full bg-[#0a0a0a] border pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 rounded-xs outline-none transition-colors font-sans ${
                    errorField === "password"
                      ? "border-red-500/60 focus:border-red-400"
                      : "border-white/15 focus:border-primary/60"
                  }`}
                />
              </div>
              {errorField === "password" && (
                <p className="text-xs text-red-400 font-sans mt-1">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary text-black hover:bg-white transition-all duration-300 font-sans text-xs md:text-sm uppercase tracking-[0.2em] font-semibold rounded-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/10"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credential Filler */}
          <div className="pt-4 border-t border-white/5 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs uppercase tracking-[0.15em] text-white/55 hover:text-primary transition-colors flex items-center gap-1.5 font-mono cursor-pointer font-medium"
            >
              <ShieldCheck size={13} className="text-primary/80" />
              <span>Fill Default Admin Credentials</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs uppercase tracking-widest text-white/50 font-mono">
        © {new Date().getFullYear()} Celife Health Solutions. All rights reserved.
      </footer>
    </div>
  );
}

