"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  User,
  Settings as SettingsIcon,
  Phone,
  Share2,
  Bell,
  Lock,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  website: string;
}

interface SocialSettings {
  linkedin: string;
  instagram: string;
  youtube: string;
  facebook: string;
}

interface NotificationSettings {
  newInquiryEmail: boolean;
  weeklyDigest: boolean;
  systemAlerts: boolean;
}

interface SiteSettings {
  contact: ContactSettings;
  social: SocialSettings;
  notifications: NotificationSettings;
}

type TabType = "account" | "general" | "contact" | "social" | "notifications" | "security";
type SaveState = "idle" | "saving" | "success" | "error";

// ─── Reusable field components ────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-wide text-white/70 font-sans font-medium block">
      {children}
    </span>
  );
}

function FieldInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-black border border-white/5 text-sm text-white/90 px-4 py-3 rounded-xs outline-none font-sans placeholder:text-white/50 focus:border-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function SaveBar({
  state,
  errorMessage,
  onSave,
}: {
  state: SaveState;
  errorMessage?: string;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/5">
      <div className="text-sm font-sans">
        {state === "saving" && (
          <span className="flex items-center gap-2 text-white/50">
            <Loader2 size={12} className="animate-spin" />
            Saving…
          </span>
        )}
        {state === "success" && (
          <span className="flex items-center gap-2 text-emerald-400/80">
            <CheckCircle2 size={12} />
            Changes saved.
          </span>
        )}
        {state === "error" && (
          <span className="flex items-center gap-2 text-red-400/80">
            <AlertCircle size={12} />
            {errorMessage || "Unable to save changes. Please try again."}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={state === "saving"}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-sm uppercase tracking-wide font-sans font-semibold px-5 py-2.5 rounded-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {state === "saving" ? (
          <>
            <Loader2 size={11} className="animate-spin" />
            Saving…
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 outline-none ${
        checked ? "border-primary/60 bg-primary/20" : "border-white/10 bg-black"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-3 w-3 rounded-full shadow transform transition-transform duration-200 mt-px ${
          checked ? "translate-x-4 bg-primary" : "translate-x-px bg-white/30"
        }`}
      />
    </button>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function SettingsDashboardPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [activeTab, setActiveTab] = useState<TabType>("account");

  // ── Session ──
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // ── Settings data ──
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // ── Contact form ──
  const [contact, setContact] = useState<ContactSettings>({ email: "", phone: "", address: "", website: "" });
  const [contactSave, setContactSave] = useState<SaveState>("idle");
  const [contactError, setContactError] = useState<string | undefined>();

  // ── Social form ──
  const [social, setSocial] = useState<SocialSettings>({ linkedin: "", instagram: "", youtube: "", facebook: "" });
  const [socialSave, setSocialSave] = useState<SaveState>("idle");
  const [socialError, setSocialError] = useState<string | undefined>();

  // ── Notifications ──
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newInquiryEmail: true,
    weeklyDigest: false,
    systemAlerts: true,
  });
  const [notifSave, setNotifSave] = useState<SaveState>("idle");
  const [notifError, setNotifError] = useState<string | undefined>();

  // ── Password ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSave, setPasswordSave] = useState<SaveState>("idle");
  const [passwordMessage, setPasswordMessage] = useState<string | undefined>();
  const [passwordFieldError, setPasswordFieldError] = useState<Record<string, string>>({});

  // ── Fetch session ──
  useEffect(() => {
    let active = true;
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) throw new Error(`Failed to fetch session. Status: ${res.status}`);
        const body = await res.json();
        if (!body.success || !body.data?.authenticated) throw new Error("User session is unauthenticated.");
        if (active) setUser(body.data.user);
      } catch (err: unknown) {
        console.error(err);
        if (active) setError("Unable to load settings session.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchSession();
    return () => { active = false; };
  }, [retryTrigger]);

  // ── Fetch settings ──
  const fetchSettings = useCallback(async () => {
    try {
      setSettingsLoading(true);
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load settings.");
      const body = await res.json();
      if (body.success && body.data?.settings) {
        const s: SiteSettings = body.data.settings;
        setSettings(s);
        setContact(s.contact);
        setSocial(s.social);
        setNotifications(s.notifications);
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (user) {
      void (async () => {
        try {
          const res = await fetch("/api/settings");
          if (!res.ok) throw new Error("Failed to load settings.");
          const body = await res.json();
          if (active && body.success && body.data?.settings) {
            const s: SiteSettings = body.data.settings;
            setSettings(s);
            setContact(s.contact);
            setSocial(s.social);
            setNotifications(s.notifications);
          }
        } catch (err) {
          if (active) console.error("Settings fetch error:", err);
        }
      })();
    }
    return () => {
      active = false;
    };
  }, [user]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRetryTrigger((prev) => prev + 1);
  };

  // ── Generic PATCH helper ──
  const patchSettings = async (payload: Partial<SiteSettings>) => {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body?.error?.message || "Unable to save changes. Please try again.");
    }
    return body.data.settings as SiteSettings;
  };

  // ── Save: Contact ──
  const saveContact = async () => {
    setContactSave("saving");
    setContactError(undefined);
    try {
      const updated = await patchSettings({ contact });
      setSettings(updated);
      setContact(updated.contact);
      setContactSave("success");
      setTimeout(() => setContactSave("idle"), 3500);
    } catch (err: unknown) {
      setContactError(err instanceof Error ? err.message : "Unable to save changes. Please try again.");
      setContactSave("error");
    }
  };

  // ── Save: Social ──
  const saveSocial = async () => {
    setSocialSave("saving");
    setSocialError(undefined);
    try {
      const updated = await patchSettings({ social });
      setSettings(updated);
      setSocial(updated.social);
      setSocialSave("success");
      setTimeout(() => setSocialSave("idle"), 3500);
    } catch (err: unknown) {
      setSocialError(err instanceof Error ? err.message : "Unable to save changes. Please try again.");
      setSocialSave("error");
    }
  };

  // ── Save: Notifications (auto-save on toggle) ──
  const saveNotifications = useCallback(async (next: NotificationSettings) => {
    setNotifSave("saving");
    setNotifError(undefined);
    try {
      const updated = await patchSettings({ notifications: next });
      setSettings(updated);
      setNotifications(updated.notifications);
      setNotifSave("success");
      setTimeout(() => setNotifSave("idle"), 2500);
    } catch (err: unknown) {
      setNotifError(err instanceof Error ? err.message : "Unable to save. Please try again.");
      setNotifSave("error");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (field: keyof NotificationSettings, value: boolean) => {
    const next = { ...notifications, [field]: value };
    setNotifications(next);
    saveNotifications(next);
  };

  // ── Save: Password ──
  const savePassword = async () => {
    setPasswordFieldError({});
    setPasswordMessage(undefined);

    // Client-side pre-validation
    const fieldErrors: Record<string, string> = {};
    if (!currentPassword) fieldErrors.currentPassword = "Current password is required";
    if (newPassword.length < 8) fieldErrors.newPassword = "New password must be at least 8 characters";
    if (newPassword !== confirmPassword) fieldErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(fieldErrors).length > 0) {
      setPasswordFieldError(fieldErrors);
      setPasswordSave("error");
      return;
    }

    setPasswordSave("saving");
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const body = await res.json();

      if (!res.ok || !body.success) {
        // Field-level error from server
        if (body?.error?.field) {
          setPasswordFieldError({ [body.error.field]: body.error.message });
        }
        throw new Error(body?.error?.message || "Unable to change password. Please try again.");
      }

      // Success — session destroyed, redirect to login
      setPasswordSave("success");
      setPasswordMessage("Password changed. Redirecting to sign in…");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/login"), 2200);
    } catch (err: unknown) {
      setPasswordMessage(err instanceof Error ? err.message : "Unable to change password. Please try again.");
      setPasswordSave("error");
    }
  };

  // ─── Tabs ───────────────────────────────────────────────────────────────────

  const tabs: { id: TabType; label: string; icon: React.ReactNode; isLocked: boolean }[] = [
    { id: "account", label: "Account Details", icon: <User size={14} />, isLocked: false },
    { id: "general", label: "General Settings", icon: <SettingsIcon size={14} />, isLocked: true },
    { id: "contact", label: "Contact Info", icon: <Phone size={14} />, isLocked: false },
    { id: "social", label: "Social Links", icon: <Share2 size={14} />, isLocked: false },
    { id: "notifications", label: "Notifications", icon: <Bell size={14} />, isLocked: false },
    { id: "security", label: "Security", icon: <KeyRound size={14} />, isLocked: false },
  ];

  // ─── Loading / Error gates ───────────────────────────────────────────────────

  if (isLoading) {
    return <LoadingState variant="spinner" text="Loading system settings…" />;
  }

  if (error || !user) {
    const isAuthError =
      (error && (error.includes("unauthenticated") || error.includes("401") || error.includes("Unauthorized"))) ||
      !user;
    return (
      <ErrorState
        title={isAuthError ? "Authentication Required" : "Unable to load settings"}
        description={
          isAuthError
            ? "Your operator session has expired or is invalid. Please sign in to view and manage settings."
            : "Failed to retrieve your active administrative session credentials. Please check your network and retry."
        }
        onRetry={isAuthError ? () => router.push("/login") : handleRetry}
      />
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReduced ? 0.05 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className="space-y-6 select-none"
    >
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-white/60 font-sans mb-1">
          <span>DASHBOARD</span>
          <span>/</span>
          <span className="text-white/60">SETTINGS</span>
        </div>
        <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">Settings</h2>
        <p className="text-sm text-white/65 font-sans tracking-wide">
          Manage your dashboard and website configuration.
        </p>
      </div>

      {/* Main Settings Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 border-b lg:border-b-0 border-white/5 lg:border-r lg:border-white/5 lg:pr-4 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xs text-sm uppercase tracking-wide font-sans font-semibold transition-all duration-300 outline-none text-left whitespace-nowrap lg:w-full cursor-pointer select-none ${
                activeTab === tab.id
                  ? "bg-white/5 text-primary border-l-2 border-primary pl-3.5"
                  : "text-white/65 hover:text-white/80 hover:bg-white/[0.02] border-l-2 border-transparent"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.isLocked && <Lock size={10} className="ml-auto text-white/20" />}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 min-h-[300px]">

          {/* ── TAB 1: Account Details ─────────────────────────────────────── */}
          {activeTab === "account" && (
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h4 className="text-sm uppercase tracking-[0.16em] text-white/90 font-sans font-medium">
                  Account Details
                </h4>
                <p className="text-sm text-white/60 font-sans mt-0.5">
                  Current authenticated operator session credentials.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <FieldLabel>Operator Name</FieldLabel>
                    <div className="bg-black border border-white/5 text-sm text-white/90 px-4 py-3 rounded-xs font-sans">
                      {user.name}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <FieldLabel>Access Role</FieldLabel>
                    <div className="flex items-center gap-2 bg-black border border-white/5 text-sm text-white/90 px-4 py-2.5 rounded-xs font-sans">
                      <ShieldCheck size={14} className="text-primary" />
                        <span className="uppercase tracking-wide text-xs font-semibold text-primary">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="bg-black border border-white/5 text-sm text-white/90 px-4 py-3 rounded-xs font-sans">
                    {user.email}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/55 font-sans pt-2 leading-relaxed">
                  <CheckCircle2 size={12} className="text-[#C9A24A]/60 shrink-0" />
                  <span>
                    Session verified via secure JWT token cookie. To change your password, visit the{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("security")}
                      className="text-primary/70 hover:text-primary underline underline-offset-2 cursor-pointer"
                    >
                      Security
                    </button>{" "}
                    tab.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: General Settings (read-only, static config) ─────────── */}
          {activeTab === "general" && (
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6 relative overflow-hidden">
              <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 p-4 rounded-xs text-sm text-white/60 font-sans leading-relaxed">
                <Lock size={14} className="text-primary/70 shrink-0" />
                <span>
                  <strong>Read-only:</strong> General brand values are defined inside static deployment config
                  tokens and are not backed by a database model schema. Exposing site updates via write endpoints
                  is currently unsupported.
                </span>
              </div>

              <div className="border-b border-white/5 pb-4">
                <h4 className="text-sm uppercase tracking-[0.16em] text-white/90 font-sans font-medium">
                  General Settings
                </h4>
                <p className="text-sm text-white/60 font-sans mt-0.5">Global website brand parameters.</p>
              </div>

              <div className="space-y-4 opacity-50 pointer-events-none">
                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-wide text-white/70 font-sans font-medium block">
                    Site Name
                  </span>
                  <input
                    type="text"
                    value={siteConfig.name}
                    disabled
                    className="w-full bg-black border border-white/5 text-xs text-white px-4 py-3 rounded-xs outline-none font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-wide text-white/70 font-sans font-medium block">
                    Site Description
                  </span>
                  <textarea
                    rows={3}
                    value={siteConfig.description}
                    disabled
                    className="w-full bg-black border border-white/5 text-xs text-white px-4 py-3 rounded-xs outline-none font-sans resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs uppercase tracking-wide text-white/70 font-sans font-medium block">
                      Short Initials
                    </span>
                    <input
                      type="text"
                      value={siteConfig.shortName}
                      disabled
                      className="w-full bg-black border border-white/5 text-xs text-white px-4 py-3 rounded-xs outline-none font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs uppercase tracking-wide text-white/70 font-sans font-medium block">
                      Base URL
                    </span>
                    <input
                      type="text"
                      value={siteConfig.url}
                      disabled
                      className="w-full bg-black border border-white/5 text-xs text-white px-4 py-3 rounded-xs outline-none font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: Contact Info ────────────────────────────────────────── */}
          {activeTab === "contact" && (
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold">
                  Contact Coordinates
                </h4>
                <p className="text-[10px] text-white/40 font-sans mt-0.5">
                  Business and customer inquiry response coordinates.
                </p>
              </div>

              {settingsLoading ? (
                <div className="flex items-center gap-2 text-[10px] text-white/40 font-sans py-8 justify-center">
                  <Loader2 size={14} className="animate-spin text-primary" />
                  Loading contact settings…
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldInput
                      label="Inquiry Email"
                      type="email"
                      value={contact.email}
                      onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                      placeholder="advisory@example.com"
                    />
                    <FieldInput
                      label="Telephone"
                      value={contact.phone}
                      onChange={(v) => setContact((c) => ({ ...c, phone: v }))}
                      placeholder="+44 20 7946 0958"
                    />
                  </div>
                  <FieldInput
                    label="Headquarters Address"
                    value={contact.address}
                    onChange={(v) => setContact((c) => ({ ...c, address: v }))}
                    placeholder="Mayfair, London, UK"
                  />
                  <FieldInput
                    label="Website URL"
                    type="url"
                    value={contact.website}
                    onChange={(v) => setContact((c) => ({ ...c, website: v }))}
                    placeholder="https://thedco.com"
                  />

                  <SaveBar
                    state={contactSave}
                    errorMessage={contactError}
                    onSave={saveContact}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: Social Links ────────────────────────────────────────── */}
          {activeTab === "social" && (
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold">
                  Social Links
                </h4>
                <p className="text-[10px] text-white/40 font-sans mt-0.5">
                  Platform integration URLs rendered on client sections.
                </p>
              </div>

              {settingsLoading ? (
                <div className="flex items-center gap-2 text-[10px] text-white/40 font-sans py-8 justify-center">
                  <Loader2 size={14} className="animate-spin text-primary" />
                  Loading social settings…
                </div>
              ) : (
                <div className="space-y-4">
                  <FieldInput
                    label="LinkedIn URL"
                    type="url"
                    value={social.linkedin}
                    onChange={(v) => setSocial((s) => ({ ...s, linkedin: v }))}
                    placeholder="https://linkedin.com/company/thedco"
                  />
                  <FieldInput
                    label="Instagram URL"
                    type="url"
                    value={social.instagram}
                    onChange={(v) => setSocial((s) => ({ ...s, instagram: v }))}
                    placeholder="https://instagram.com/thedco"
                  />
                  <FieldInput
                    label="YouTube URL"
                    type="url"
                    value={social.youtube}
                    onChange={(v) => setSocial((s) => ({ ...s, youtube: v }))}
                    placeholder="https://youtube.com/@thedco"
                  />
                  <FieldInput
                    label="Facebook URL"
                    type="url"
                    value={social.facebook}
                    onChange={(v) => setSocial((s) => ({ ...s, facebook: v }))}
                    placeholder="https://facebook.com/thedco"
                  />

                  <SaveBar
                    state={socialSave}
                    errorMessage={socialError}
                    onSave={saveSocial}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── TAB 5: Notifications ──────────────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold">
                  Notification Dispatch Routing
                </h4>
                <p className="text-[10px] text-white/40 font-sans mt-0.5">
                  Define dispatch parameters for customer interactions.
                </p>
              </div>

              {settingsLoading ? (
                <div className="flex items-center gap-2 text-[10px] text-white/40 font-sans py-8 justify-center">
                  <Loader2 size={14} className="animate-spin text-primary" />
                  Loading notification preferences…
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Row */}
                  {(
                    [
                      { field: "newInquiryEmail", label: "Email Alert on New Inquiries", desc: "Receive an email when a visitor submits an inquiry" },
                      { field: "weeklyDigest", label: "Weekly Digest Reports", desc: "Summary of activity delivered every Monday" },
                      { field: "systemAlerts", label: "System Alerts", desc: "Critical system and security notifications" },
                    ] as { field: keyof NotificationSettings; label: string; desc: string }[]
                  ).map(({ field, label, desc }) => (
                    <div
                      key={field}
                      className="flex items-center justify-between p-4 border border-white/5 bg-black rounded-xs gap-4"
                    >
                      <div className="min-w-0">
                        <div className="font-sans text-xs text-white/70">{label}</div>
                        <div className="font-sans text-[10px] text-white/30 mt-0.5">{desc}</div>
                      </div>
                      <Toggle
                        checked={notifications[field]}
                        onChange={(v) => handleToggle(field, v)}
                      />
                    </div>
                  ))}

                  {/* Save state indicator */}
                  <div className="pt-2 text-[10px] font-sans">
                    {notifSave === "saving" && (
                      <span className="flex items-center gap-2 text-white/50">
                        <Loader2 size={12} className="animate-spin" />
                        Saving preferences…
                      </span>
                    )}
                    {notifSave === "success" && (
                      <span className="flex items-center gap-2 text-emerald-400/80">
                        <CheckCircle2 size={12} />
                        Preferences saved.
                      </span>
                    )}
                    {notifSave === "error" && (
                      <span className="flex items-center gap-2 text-red-400/80">
                        <AlertCircle size={12} />
                        {notifError || "Unable to save preferences. Please try again."}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 6: Security / Password ──────────────────────────────────── */}
          {activeTab === "security" && (
            <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold">
                  Security — Change Password
                </h4>
                <p className="text-[10px] text-white/40 font-sans mt-0.5">
                  Update your administrator account password. You will be signed out upon success.
                </p>
              </div>

              <div className="space-y-4">
                {/* Current Password */}
                <div className="space-y-1">
                  <FieldLabel>Current Password</FieldLabel>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (passwordFieldError.currentPassword) {
                          setPasswordFieldError((prev) => {
                            const next = { ...prev };
                            delete next.currentPassword;
                            return next;
                          });
                        }
                      }}
                      autoComplete="current-password"
                      placeholder="Enter current password"
                      className={`w-full bg-black border text-xs text-white/80 px-4 py-3 pr-10 rounded-xs outline-none font-sans placeholder:text-white/20 focus:border-primary/30 transition-colors ${
                        passwordFieldError.currentPassword ? "border-red-500/40" : "border-white/5"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                      tabIndex={-1}
                      aria-label={showCurrent ? "Hide password" : "Show password"}
                    >
                      {showCurrent ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  {passwordFieldError.currentPassword && (
                    <p className="text-[10px] text-red-400/80 font-sans">{passwordFieldError.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <FieldLabel>New Password</FieldLabel>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (passwordFieldError.newPassword) {
                          setPasswordFieldError((prev) => {
                            const next = { ...prev };
                            delete next.newPassword;
                            return next;
                          });
                        }
                      }}
                      autoComplete="new-password"
                      placeholder="Minimum 8 characters"
                      className={`w-full bg-black border text-xs text-white/80 px-4 py-3 pr-10 rounded-xs outline-none font-sans placeholder:text-white/20 focus:border-primary/30 transition-colors ${
                        passwordFieldError.newPassword ? "border-red-500/40" : "border-white/5"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                      tabIndex={-1}
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  {passwordFieldError.newPassword && (
                    <p className="text-[10px] text-red-400/80 font-sans">{passwordFieldError.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (passwordFieldError.confirmPassword) {
                          setPasswordFieldError((prev) => {
                            const next = { ...prev };
                            delete next.confirmPassword;
                            return next;
                          });
                        }
                      }}
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      className={`w-full bg-black border text-xs text-white/80 px-4 py-3 pr-10 rounded-xs outline-none font-sans placeholder:text-white/20 focus:border-primary/30 transition-colors ${
                        passwordFieldError.confirmPassword ? "border-red-500/40" : "border-white/5"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                      tabIndex={-1}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  {passwordFieldError.confirmPassword && (
                    <p className="text-[10px] text-red-400/80 font-sans">{passwordFieldError.confirmPassword}</p>
                  )}
                </div>

                {/* Security notice */}
                <div className="flex items-start gap-2 bg-white/[0.02] border border-white/5 p-3 rounded-xs">
                  <ShieldCheck size={13} className="text-primary/60 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/30 font-sans leading-relaxed">
                    Passwords are hashed server-side using bcrypt. Upon success, your current session will be
                    terminated and you will be redirected to the sign-in page.
                  </p>
                </div>

                {/* Save bar */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="text-[10px] font-sans">
                    {passwordSave === "saving" && (
                      <span className="flex items-center gap-2 text-white/50">
                        <Loader2 size={12} className="animate-spin" />
                        Changing password…
                      </span>
                    )}
                    {passwordSave === "success" && (
                      <span className="flex items-center gap-2 text-emerald-400/80">
                        <CheckCircle2 size={12} />
                        {passwordMessage}
                      </span>
                    )}
                    {passwordSave === "error" && !Object.keys(passwordFieldError).length && (
                      <span className="flex items-center gap-2 text-red-400/80">
                        <AlertCircle size={12} />
                        {passwordMessage || "Unable to change password. Please try again."}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={savePassword}
                    disabled={passwordSave === "saving" || passwordSave === "success"}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] uppercase tracking-widest font-sans font-semibold px-5 py-2.5 rounded-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {passwordSave === "saving" ? (
                      <>
                        <Loader2 size={11} className="animate-spin" />
                        Changing…
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
