"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  User,
  Building2,
  Phone,
  Share2,
  Bell,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface BrandSettings {
  companyName: string;
  logo: string;
  favicon: string;
  tagline: string;
}

interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  website: string;
  whatsapp?: string;
  businessHours?: string;
  googleMaps?: string;
}

interface SocialSettings {
  linkedin: string;
  instagram: string;
  youtube: string;
  facebook: string;
}

interface FooterSettings {
  description: string;
  copyright: string;
  disclaimer: string;
}

interface SEOSettings {
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
}

interface NotificationSettings {
  newInquiryEmail: boolean;
  weeklyDigest: boolean;
  systemAlerts: boolean;
}

interface SiteSettings {
  brand?: BrandSettings;
  contact?: ContactSettings;
  social?: SocialSettings;
  footer?: FooterSettings;
  seo?: SEOSettings;
  notifications?: NotificationSettings;
}

type TabType =
  | "brand"
  | "contact"
  | "social"
  | "footer"
  | "seo"
  | "notifications"
  | "security"
  | "account";

type SaveState = "idle" | "saving" | "success" | "error";

// ─── Field Components ─────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-wider text-white/70 font-sans font-medium block mb-1">
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
        className="w-full bg-[#0A1410] border border-white/10 text-xs text-white px-4 py-2.5 rounded-xs outline-none font-sans placeholder:text-white/40 focus:border-[#81998D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="flex items-center justify-between pt-4 border-t border-white/10">
      <div className="text-xs font-sans">
        {state === "saving" && (
          <span className="flex items-center gap-2 text-white/50">
            <Loader2 size={12} className="animate-spin" />
            Saving changes…
          </span>
        )}
        {state === "success" && (
          <span className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={12} />
            Settings saved and revalidated.
          </span>
        )}
        {state === "error" && (
          <span className="flex items-center gap-2 text-red-400">
            <AlertCircle size={12} />
            {errorMessage || "Unable to save changes. Please check input fields."}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={state === "saving"}
        className="flex items-center gap-2 bg-[#123C2D] hover:bg-[#294F3D] border border-white/10 text-white text-xs uppercase tracking-wider font-sans font-semibold px-5 py-2.5 rounded-xs transition-all disabled:opacity-50 cursor-pointer shadow-xs"
      >
        {state === "saving" ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            Saving…
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
}

export default function SettingsDashboardPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [activeTab, setActiveTab] = useState<TabType>("brand");

  // ── Session ──
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Settings data ──

  // Brand
  const [brand, setBrand] = useState<BrandSettings>({
    companyName: "Celife Health Solutions",
    logo: "",
    favicon: "",
    tagline: "Targeted Botanical & Nutritional Wellness Formulations",
  });
  const [brandSave, setBrandSave] = useState<SaveState>("idle");
  const [brandError, setBrandError] = useState<string | undefined>();

  // Contact
  const [contact, setContact] = useState<ContactSettings>({
    email: "enquiry@celifehealth.com",
    phone: "+91 98200 12345",
    address: "Mumbai, Maharashtra, India",
    website: "https://celifehealth.com",
    whatsapp: "+91 98200 12345",
    businessHours: "Mon – Fri: 9:00 AM – 6:00 PM IST",
    googleMaps: "",
  });
  const [contactSave, setContactSave] = useState<SaveState>("idle");
  const [contactError, setContactError] = useState<string | undefined>();

  // Social
  const [social, setSocial] = useState<SocialSettings>({
    linkedin: "",
    instagram: "",
    youtube: "",
    facebook: "",
  });
  const [socialSave, setSocialSave] = useState<SaveState>("idle");
  const [socialError, setSocialError] = useState<string | undefined>();

  // Footer
  const [footer, setFooter] = useState<FooterSettings>({
    description: "Celife Health Solutions is a dedicated healthcare, nutraceutical, and herbal wellness brand creating evidence-guided botanical and nutritional formulations.",
    copyright: "© 2026 Celife Health Solutions. All rights reserved.",
    disclaimer: "Information on this website is for educational and trade purposes and is not a substitute for professional medical advice.",
  });
  const [footerSave, setFooterSave] = useState<SaveState>("idle");
  const [footerError, setFooterError] = useState<string | undefined>();

  // SEO
  const [seo, setSeo] = useState<SEOSettings>({
    defaultTitle: "Celife Health Solutions | Premium Wellness & Healthcare Formulations",
    defaultDescription: "Celife Health Solutions crafts high-potency nutritional and herbal healthcare formulations developed with pure extracts and strict quality benchmarks.",
    defaultOgImage: "/images/hero/celife-wellness-hero.jpg",
  });
  const [seoSave, setSeoSave] = useState<SaveState>("idle");
  const [seoError, setSeoError] = useState<string | undefined>();

  // Notifications
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newInquiryEmail: true,
    weeklyDigest: false,
    systemAlerts: true,
  });
  const [notifSave, setNotifSave] = useState<SaveState>("idle");
  const [notifError, setNotifError] = useState<string | undefined>();

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSave, setPasswordSave] = useState<SaveState>("idle");
  const [passwordMessage, setPasswordMessage] = useState<string | undefined>();

  // Fetch session & settings
  useEffect(() => {
    async function init() {
      try {
        const [sessRes, setRes] = await Promise.all([
          fetch("/api/auth/session"),
          fetch("/api/settings"),
        ]);

        const sessBody = await sessRes.json();
        if (sessBody.success && sessBody.data?.authenticated) {
          setUser(sessBody.data.user);
        } else {
          setError("User session is unauthenticated.");
        }

        const setBody = await setRes.json();
        if (setBody.success && setBody.data?.settings) {
          const s = setBody.data.settings;
          if (s.brand) setBrand(s.brand);
          if (s.contact) setContact(s.contact);
          if (s.social) setSocial(s.social);
          if (s.footer) setFooter(s.footer);
          if (s.seo) setSeo(s.seo);
          if (s.notifications) setNotifications(s.notifications);
        }
      } catch (err: unknown) {
        console.error(err);
        setError("Unable to load settings data.");
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const patchSettings = async (payload: Partial<SiteSettings>) => {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body?.error?.message || "Unable to save changes.");
    }
    return body.data.settings as SiteSettings;
  };

  const saveBrand = async () => {
    setBrandSave("saving");
    setBrandError(undefined);
    try {
      const updated = await patchSettings({ brand });
      if (updated.brand) setBrand(updated.brand);
      setBrandSave("success");
      setTimeout(() => setBrandSave("idle"), 3000);
    } catch (err: unknown) {
      setBrandError(err instanceof Error ? err.message : "Failed to save brand settings");
      setBrandSave("error");
    }
  };

  const saveContact = async () => {
    setContactSave("saving");
    setContactError(undefined);
    try {
      const updated = await patchSettings({ contact });
      if (updated.contact) setContact(updated.contact);
      setContactSave("success");
      setTimeout(() => setContactSave("idle"), 3000);
    } catch (err: unknown) {
      setContactError(err instanceof Error ? err.message : "Failed to save contact settings");
      setContactSave("error");
    }
  };

  const saveSocial = async () => {
    setSocialSave("saving");
    setSocialError(undefined);
    try {
      const updated = await patchSettings({ social });
      if (updated.social) setSocial(updated.social);
      setSocialSave("success");
      setTimeout(() => setSocialSave("idle"), 3000);
    } catch (err: unknown) {
      setSocialError(err instanceof Error ? err.message : "Failed to save social links");
      setSocialSave("error");
    }
  };

  const saveFooter = async () => {
    setFooterSave("saving");
    setFooterError(undefined);
    try {
      const updated = await patchSettings({ footer });
      if (updated.footer) setFooter(updated.footer);
      setFooterSave("success");
      setTimeout(() => setFooterSave("idle"), 3000);
    } catch (err: unknown) {
      setFooterError(err instanceof Error ? err.message : "Failed to save footer settings");
      setFooterSave("error");
    }
  };

  const saveSeo = async () => {
    setSeoSave("saving");
    setSeoError(undefined);
    try {
      const updated = await patchSettings({ seo });
      if (updated.seo) setSeo(updated.seo);
      setSeoSave("success");
      setTimeout(() => setSeoSave("idle"), 3000);
    } catch (err: unknown) {
      setSeoError(err instanceof Error ? err.message : "Failed to save SEO settings");
      setSeoSave("error");
    }
  };

  const saveNotifications = async () => {
    setNotifSave("saving");
    setNotifError(undefined);
    try {
      const updated = await patchSettings({ notifications });
      if (updated.notifications) setNotifications(updated.notifications);
      setNotifSave("success");
      setTimeout(() => setNotifSave("idle"), 3000);
    } catch (err: unknown) {
      setNotifError(err instanceof Error ? err.message : "Failed to save notification settings");
      setNotifSave("error");
    }
  };

  const savePassword = async () => {
    setPasswordSave("saving");
    setPasswordMessage(undefined);
    try {
      if (!currentPassword) throw new Error("Current password is required");
      if (newPassword.length < 8) throw new Error("New password must be at least 8 characters");
      if (newPassword !== confirmPassword) throw new Error("Passwords do not match");

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body?.error?.message || "Failed to change password");
      }

      setPasswordSave("success");
      setPasswordMessage("Password changed! Redirecting to sign in…");
      setTimeout(() => router.push("/login"), 1800);
    } catch (err: unknown) {
      setPasswordMessage(err instanceof Error ? err.message : "Failed to change password");
      setPasswordSave("error");
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string; size?: number }> }[] = [
    { id: "brand", label: "Brand Profile", icon: Building2 },
    { id: "contact", label: "Contact & Hours", icon: Phone },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "footer", label: "Footer Management", icon: FileText },
    { id: "seo", label: "Default SEO", icon: Search },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Password", icon: KeyRound },
    { id: "account", label: "Admin Account", icon: User },
  ];

  if (isLoading) return <LoadingState variant="spinner" text="Loading settings…" />;
  if (error || !user) {
    return (
      <ErrorState
        title="Authentication Required"
        description="Your session has expired. Please sign in to view settings."
        onRetry={() => router.push("/login")}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-20 select-none"
    >
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#81998D] font-sans font-semibold mb-1">
          <span>CELIFE CMS</span>
          <span>/</span>
          <span>CONFIGURATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Site Settings & Brand Controls
        </h1>
        <p className="text-xs text-white/60 font-sans mt-0.5">
          Manage brand identifiers, contact coordinates, social channels, footer copy, and SEO metadata.
        </p>
      </div>

      {/* Grid: Nav Sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 border-b lg:border-b-0 border-white/10 lg:border-r lg:border-white/10 lg:pr-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xs text-xs font-sans font-medium uppercase tracking-wider transition-all duration-200 outline-none text-left whitespace-nowrap lg:w-full cursor-pointer select-none ${
                  active
                    ? "bg-[#123C2D] text-white font-semibold shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={14} className={active ? "text-[#C4D5C7]" : "text-white/40"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel (9 cols) */}
        <div className="lg:col-span-9 bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8">
          
          {/* ── BRAND ── */}
          {activeTab === "brand" && (
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base font-serif font-bold text-white">Brand Profile</h2>
                <p className="text-xs text-white/50 font-sans">
                  Core identity and brand taglines reflected across navigation and footers.
                </p>
              </div>

              <div className="space-y-4">
                <FieldInput
                  label="Company Name"
                  value={brand.companyName}
                  onChange={(v) => setBrand({ ...brand, companyName: v })}
                  placeholder="Celife Health Solutions"
                />
                <FieldInput
                  label="Short Tagline"
                  value={brand.tagline}
                  onChange={(v) => setBrand({ ...brand, tagline: v })}
                  placeholder="Targeted Botanical & Nutritional Wellness Formulations"
                />
                <FieldInput
                  label="Logo Image URL or Path"
                  value={brand.logo}
                  onChange={(v) => setBrand({ ...brand, logo: v })}
                  placeholder="/images/general/celife-logo.png"
                />
                <FieldInput
                  label="Favicon URL or Path"
                  value={brand.favicon}
                  onChange={(v) => setBrand({ ...brand, favicon: v })}
                  placeholder="/favicon.ico"
                />

                <SaveBar
                  state={brandSave}
                  errorMessage={brandError}
                  onSave={saveBrand}
                />
              </div>
            </div>
          )}

          {/* ── CONTACT ── */}
          {activeTab === "contact" && (
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base font-serif font-bold text-white">Contact & Operating Hours</h2>
                <p className="text-xs text-white/50 font-sans">
                  Official communications desk coordinates and customer support availability.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldInput
                    label="Official Enquiry Email"
                    type="email"
                    value={contact.email}
                    onChange={(v) => setContact({ ...contact, email: v })}
                    placeholder="enquiry@celifehealth.com"
                  />
                  <FieldInput
                    label="Telephone Number"
                    value={contact.phone}
                    onChange={(v) => setContact({ ...contact, phone: v })}
                    placeholder="+91 98200 12345"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldInput
                    label="WhatsApp Helpline"
                    value={contact.whatsapp || ""}
                    onChange={(v) => setContact({ ...contact, whatsapp: v })}
                    placeholder="+91 98200 12345"
                  />
                  <FieldInput
                    label="Business Hours"
                    value={contact.businessHours || ""}
                    onChange={(v) => setContact({ ...contact, businessHours: v })}
                    placeholder="Mon – Fri: 9:00 AM – 6:00 PM IST"
                  />
                </div>

                <FieldInput
                  label="Headquarters Address"
                  value={contact.address}
                  onChange={(v) => setContact({ ...contact, address: v })}
                  placeholder="Mumbai, Maharashtra, India"
                />

                <FieldInput
                  label="Website Base URL"
                  value={contact.website}
                  onChange={(v) => setContact({ ...contact, website: v })}
                  placeholder="https://celifehealth.com"
                />

                <SaveBar
                  state={contactSave}
                  errorMessage={contactError}
                  onSave={saveContact}
                />
              </div>
            </div>
          )}

          {/* ── SOCIAL ── */}
          {activeTab === "social" && (
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base font-serif font-bold text-white">Social Channel Links</h2>
                <p className="text-xs text-white/50 font-sans">
                  Official social network profiles linked in headers, footers, and sharing cards.
                </p>
              </div>

              <div className="space-y-4">
                <FieldInput
                  label="LinkedIn URL"
                  type="url"
                  value={social.linkedin}
                  onChange={(v) => setSocial({ ...social, linkedin: v })}
                  placeholder="https://linkedin.com/company/celifehealth"
                />
                <FieldInput
                  label="Instagram URL"
                  type="url"
                  value={social.instagram}
                  onChange={(v) => setSocial({ ...social, instagram: v })}
                  placeholder="https://instagram.com/celifehealth"
                />
                <FieldInput
                  label="YouTube Channel URL"
                  type="url"
                  value={social.youtube}
                  onChange={(v) => setSocial({ ...social, youtube: v })}
                  placeholder="https://youtube.com/@celifehealth"
                />
                <FieldInput
                  label="Facebook Page URL"
                  type="url"
                  value={social.facebook}
                  onChange={(v) => setSocial({ ...social, facebook: v })}
                  placeholder="https://facebook.com/celifehealth"
                />

                <SaveBar
                  state={socialSave}
                  errorMessage={socialError}
                  onSave={saveSocial}
                />
              </div>
            </div>
          )}

          {/* ── FOOTER ── */}
          {activeTab === "footer" && (
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base font-serif font-bold text-white">Footer Management</h2>
                <p className="text-xs text-white/50 font-sans">
                  Global footer description, regulatory healthcare disclaimer, and copyright notices.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <FieldLabel>Footer Brand Narrative</FieldLabel>
                  <textarea
                    rows={3}
                    value={footer.description}
                    onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-xs text-white rounded-xs focus:border-[#81998D] outline-none font-sans"
                  />
                </div>

                <FieldInput
                  label="Copyright Notice"
                  value={footer.copyright}
                  onChange={(v) => setFooter({ ...footer, copyright: v })}
                  placeholder="© 2026 Celife Health Solutions. All rights reserved."
                />

                <div>
                  <FieldLabel>Regulatory / Educational Disclaimer</FieldLabel>
                  <textarea
                    rows={3}
                    value={footer.disclaimer}
                    onChange={(e) => setFooter({ ...footer, disclaimer: e.target.value })}
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-xs text-white rounded-xs focus:border-[#81998D] outline-none font-sans"
                  />
                </div>

                <SaveBar
                  state={footerSave}
                  errorMessage={footerError}
                  onSave={saveFooter}
                />
              </div>
            </div>
          )}

          {/* ── SEO ── */}
          {activeTab === "seo" && (
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base font-serif font-bold text-white">Default Search Engine Optimization</h2>
                <p className="text-xs text-white/50 font-sans">
                  Fallback metadata tags rendered when a specific page or article does not supply its own.
                </p>
              </div>

              <div className="space-y-4">
                <FieldInput
                  label="Default Meta Title"
                  value={seo.defaultTitle}
                  onChange={(v) => setSeo({ ...seo, defaultTitle: v })}
                  placeholder="Celife Health Solutions | Premium Wellness & Healthcare Formulations"
                />

                <div>
                  <FieldLabel>Default Meta Description</FieldLabel>
                  <textarea
                    rows={3}
                    value={seo.defaultDescription}
                    onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
                    className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-xs text-white rounded-xs focus:border-[#81998D] outline-none font-sans"
                  />
                </div>

                <FieldInput
                  label="Default Open Graph (OG) Image URL"
                  value={seo.defaultOgImage}
                  onChange={(v) => setSeo({ ...seo, defaultOgImage: v })}
                  placeholder="/images/hero/celife-wellness-hero.jpg"
                />

                <SaveBar
                  state={seoSave}
                  errorMessage={seoError}
                  onSave={saveSeo}
                />
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base font-serif font-bold text-white">Notification Preferences</h2>
                <p className="text-xs text-white/50 font-sans">
                  Email notifications dispatched when clients submit enquiries or require urgent advisory.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xs">
                  <div>
                    <strong className="text-xs font-sans text-white block">
                      New Enquiry Email Dispatch
                    </strong>
                    <span className="text-[11px] text-white/50 font-sans">
                      Notify administrative desk immediately when a new product enquiry is received.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.newInquiryEmail}
                    onChange={(e) =>
                      setNotifications({ ...notifications, newInquiryEmail: e.target.checked })
                    }
                    className="rounded-xs w-4 h-4 accent-[#123C2D] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xs">
                  <div>
                    <strong className="text-xs font-sans text-white block">
                      Weekly Digest
                    </strong>
                    <span className="text-[11px] text-white/50 font-sans">
                      Receive weekly summary of product inquiry trends and active catalogue stats.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.weeklyDigest}
                    onChange={(e) =>
                      setNotifications({ ...notifications, weeklyDigest: e.target.checked })
                    }
                    className="rounded-xs w-4 h-4 accent-[#123C2D] cursor-pointer"
                  />
                </div>

                <SaveBar
                  state={notifSave}
                  errorMessage={notifError}
                  onSave={saveNotifications}
                />
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base font-serif font-bold text-white">Operator Security & Credentials</h2>
                <p className="text-xs text-white/50 font-sans">
                  Update administrative password for your operator account.
                </p>
              </div>

              <div className="space-y-4">
                <FieldInput
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  placeholder="••••••••"
                />

                <FieldInput
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Minimum 8 characters"
                />

                <FieldInput
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat new password"
                />

                <SaveBar
                  state={passwordSave}
                  errorMessage={passwordMessage}
                  onSave={savePassword}
                />
              </div>
            </div>
          )}

          {/* ── ACCOUNT ── */}
          {activeTab === "account" && (
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base font-serif font-bold text-white">Admin Operator Session</h2>
                <p className="text-xs text-white/50 font-sans">
                  Current authenticated operator session details.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <FieldLabel>Operator Name</FieldLabel>
                  <div className="bg-[#0A1410] border border-white/10 text-xs text-white/90 px-4 py-2.5 rounded-xs font-sans">
                    {user.name}
                  </div>
                </div>

                <div>
                  <FieldLabel>Access Role</FieldLabel>
                  <div className="flex items-center gap-2 bg-[#0A1410] border border-white/10 text-xs text-white/90 px-4 py-2 rounded-xs font-sans">
                    <ShieldCheck size={14} className="text-[#81998D]" />
                    <span className="uppercase tracking-wide text-xs font-semibold text-[#81998D]">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="bg-[#0A1410] border border-white/10 text-xs text-white/90 px-4 py-2.5 rounded-xs font-sans">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
