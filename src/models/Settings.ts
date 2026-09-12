import mongoose, { Schema, Document } from "mongoose";

// ─── Sub-document interfaces ──────────────────────────────────────────────────

export interface IContactSettings {
  email: string;
  phone: string;
  address: string;
  website: string;
}

export interface ISocialSettings {
  linkedin: string;
  instagram: string;
  youtube: string;
  facebook: string;
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
  contact: IContactSettings;
  social: ISocialSettings;
  notifications: INotificationSettings;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const ContactSchema = new Schema<IContactSettings>(
  {
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    website: { type: String, default: "" },
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
    contact: { type: ContactSchema, default: () => ({}) },
    social: { type: SocialSchema, default: () => ({}) },
    notifications: { type: NotificationSchema, default: () => ({}) },
  },
  { timestamps: true }
);

const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
