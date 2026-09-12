import mongoose, { Schema, Document } from "mongoose";
import {
  CASE_STUDY_STATUSES,
  PROPERTY_TYPES,
  CASE_STUDY_PROJECT_TYPES,
  CASE_STUDY_SERVICES,
  type CaseStudyStatus,
  type PropertyType,
  type CaseStudyProjectType,
  type CaseStudyService,
  type ICaseStudyCoverImage,
  type ICaseStudyClient,
  type ICaseStudyResult,
  type ICaseStudySEO,
} from "@/types/case-study";

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  client: ICaseStudyClient;
  location: string;
  propertyType: PropertyType;
  projectType: CaseStudyProjectType;
  overview: string;
  challenge: string;
  solution: string;
  results: ICaseStudyResult[];
  services: CaseStudyService[];
  coverImage: ICaseStudyCoverImage;
  gallery?: ICaseStudyCoverImage[];
  status: CaseStudyStatus;
  publishedAt?: Date;
  seo?: ICaseStudySEO;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    industry: {
      type: String,
      required: false,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false }
);

const ResultSchema = new Schema(
  {
    metric: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    value: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 300,
    },
  },
  { _id: false }
);

const CoverImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
  },
  { _id: false }
);

const SEOSchema = new Schema(
  {
    metaTitle: {
      type: String,
      required: false,
      trim: true,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      required: false,
      trim: true,
      maxlength: 160,
    },
    keywords: {
      type: [String],
      required: false,
      default: [],
    },
    canonicalUrl: {
      type: String,
      required: false,
      trim: true,
    },
    ogImage: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { _id: false }
);

const CaseStudySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 220,
    },
    client: {
      type: ClientSchema,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    propertyType: {
      type: String,
      required: true,
      enum: PROPERTY_TYPES,
    },
    projectType: {
      type: String,
      required: true,
      enum: CASE_STUDY_PROJECT_TYPES,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 5000,
    },
    challenge: {
      type: String,
      required: true,
      trim: true,
      minlength: 30,
      maxlength: 5000,
    },
    solution: {
      type: String,
      required: true,
      trim: true,
      minlength: 30,
      maxlength: 10000,
    },
    results: {
      type: [ResultSchema],
      required: true,
      default: [],
    },
    services: {
      type: [String],
      required: true,
      enum: CASE_STUDY_SERVICES,
    },
    coverImage: {
      type: CoverImageSchema,
      required: true,
    },
    gallery: {
      type: [CoverImageSchema],
      required: false,
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: CASE_STUDY_STATUSES,
      default: "draft",
    },
    publishedAt: {
      type: Date,
      required: false,
    },
    seo: {
      type: SEOSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize sorting, category, filters lookups
CaseStudySchema.index({ status: 1 });
CaseStudySchema.index({ publishedAt: -1 });
CaseStudySchema.index({ propertyType: 1 });
CaseStudySchema.index({ projectType: 1 });
CaseStudySchema.index({ location: 1 });

const CaseStudy = mongoose.models.CaseStudy || mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);

export default CaseStudy;
