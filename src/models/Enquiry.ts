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
  company?: string;
  projectType: ProjectType;
  location?: string;
  projectStage?: ProjectStage;
  businessStatus?: BusinessStatus;
  message: string;
  status: EnquiryStatus;
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
    company: {
      type: String,
      required: false,
      trim: true,
      maxlength: 150,
    },
    projectType: {
      type: String,
      required: true,
      enum: PROJECT_TYPES,
      trim: true,
    },
    location: {
      type: String,
      required: false,
      trim: true,
      maxlength: 150,
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
      minlength: 10,
      maxlength: 3000,
    },
    status: {
      type: String,
      required: true,
      enum: ENQUIRY_STATUSES,
      default: "new",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize sorting by date, filtering by status, and looking up email
EnquirySchema.index({ status: 1 });
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ email: 1 });

const Enquiry = mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
