import mongoose, { Schema, Document } from "mongoose";

// ─── Sub-document interfaces ──────────────────────────────────────────────────

export interface IBrandSettings {
  companyName: string;
  logo: string;
  favicon: string;
  tagline: string;
}

export interface IContactSettings {
  email: string;
  phone: string;
  address: string;
  website: string;
  whatsapp?: string;
  businessHours?: string;
  googleMaps?: string;
}

export interface ISocialSettings {
  linkedin: string;
  instagram: string;
  youtube: string;
  facebook: string;
}

export interface IFooterSettings {
  description: string;
  copyright: string;
  disclaimer: string;
}

export interface ISEOSettings {
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
}

export interface INotificationSettings {
  newInquiryEmail: boolean;
  weeklyDigest: boolean;
  systemAlerts: boolean;
}

// ─── Root document interface ──────────────────────────────────────────────────

export interface ISettings extends Document {
  /** Singleton sentinel — always "main" */
  _singleton: string;
  brand: IBrandSettings;
  contact: IContactSettings;
  social: ISocialSettings;
  footer: IFooterSettings;
  seo: ISEOSettings;
  notifications: INotificationSettings;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-document Schemas ─────────────────────────────────────────────────────

const BrandSchema = new Schema<IBrandSettings>(
  {
    companyName: { type: String, default: "Celife Health Solutions" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    tagline: { type: String, default: "Targeted Botanical & Nutritional Wellness Formulations" },
  },
  { _id: false }
);

const ContactSchema = new Schema<IContactSettings>(
  {
    email: { type: String, default: "enquiry@celifehealth.com" },
    phone: { type: String, default: "+91 98200 12345" },
    address: { type: String, default: "Mumbai, Maharashtra, India" },
    website: { type: String, default: "https://celifehealth.com" },
    whatsapp: { type: String, default: "+91 98200 12345" },
    businessHours: { type: String, default: "Mon – Fri: 9:00 AM – 6:00 PM IST" },
    googleMaps: { type: String, default: "" },
  },
  { _id: false }
);

const SocialSchema = new Schema<ISocialSettings>(
  {
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    facebook: { type: String, default: "" },
  },
  { _id: false }
);

const FooterSchema = new Schema<IFooterSettings>(
  {
    description: {
      type: String,
      default:
        "Celife Health Solutions is a dedicated healthcare, nutraceutical, and herbal wellness brand creating evidence-guided botanical and nutritional formulations.",
    },
    copyright: { type: String, default: "© 2026 Celife Health Solutions. All rights reserved." },
    disclaimer: {
      type: String,
      default:
        "Information on this website is for educational and trade purposes and is not a substitute for professional medical advice.",
    },
  },
  { _id: false }
);

const SEOSchema = new Schema<ISEOSettings>(
  {
    defaultTitle: {
      type: String,
      default: "Celife Health Solutions | Premium Wellness & Healthcare Formulations",
    },
    defaultDescription: {
      type: String,
      default:
        "Celife Health Solutions crafts high-potency nutritional and herbal healthcare formulations developed with pure extracts and strict quality benchmarks.",
    },
    defaultOgImage: { type: String, default: "/images/hero/celife-wellness-hero.jpg" },
  },
  { _id: false }
);

const NotificationSchema = new Schema<INotificationSettings>(
  {
    newInquiryEmail: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false },
    systemAlerts: { type: Boolean, default: true },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    _singleton: { type: String, default: "main", unique: true, immutable: true },
    brand: { type: BrandSchema, default: () => ({}) },
    contact: { type: ContactSchema, default: () => ({}) },
    social: { type: SocialSchema, default: () => ({}) },
    footer: { type: FooterSchema, default: () => ({}) },
    seo: { type: SEOSchema, default: () => ({}) },
    notifications: { type: NotificationSchema, default: () => ({}) },
  },
  { timestamps: true }
);

const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
