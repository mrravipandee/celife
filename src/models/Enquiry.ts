import mongoose, { Schema, Document } from "mongoose";
import {
  PROJECT_TYPES,
  PROJECT_STAGES,
  BUSINESS_STATUSES,
  ENQUIRY_STATUSES,
  type EnquiryStatus,
  type ProjectType,
  type ProjectStage,
  type BusinessStatus,
} from "@/types/enquiry";

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  productId?: mongoose.Types.ObjectId;
  productNameSnapshot?: string;
  productSlug?: string;
  productCategory?: string;
  product?: string;
  company?: string;
  city?: string;
  location?: string;
  projectType: ProjectType;
  projectStage?: ProjectStage;
  businessStatus?: BusinessStatus;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    productNameSnapshot: {
      type: String,
      required: false,
      trim: true,
      maxlength: 200,
    },
    productSlug: {
      type: String,
      required: false,
      trim: true,
      maxlength: 200,
    },
    productCategory: {
      type: String,
      required: false,
      trim: true,
      maxlength: 150,
    },
    product: {
      type: String,
      required: false,
      trim: true,
      maxlength: 200,
    },
    company: {
      type: String,
      required: false,
      trim: true,
      maxlength: 150,
    },
    city: {
      type: String,
      required: false,
      trim: true,
      maxlength: 150,
    },
    location: {
      type: String,
      required: false,
      trim: true,
      maxlength: 150,
    },
    projectType: {
      type: String,
      required: true,
      enum: PROJECT_TYPES,
      default: "Product Enquiry",
      trim: true,
    },
    projectStage: {
      type: String,
      required: false,
      enum: PROJECT_STAGES,
      trim: true,
    },
    businessStatus: {
      type: String,
      required: false,
      enum: BUSINESS_STATUSES,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 3000,
    },
    status: {
      type: String,
      required: true,
      enum: ENQUIRY_STATUSES,
      default: "new",
      trim: true,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
      maxlength: 5000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Optimize sorting by date, filtering by status, productSlug, and looking up email/phone
EnquirySchema.index({ status: 1 });
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ status: 1, createdAt: -1 });
EnquirySchema.index({ productId: 1 });
EnquirySchema.index({ productSlug: 1 });
EnquirySchema.index({ email: 1 });
EnquirySchema.index({ phone: 1 });

const Enquiry = mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
