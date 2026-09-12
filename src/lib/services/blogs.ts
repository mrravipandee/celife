import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { cache } from "react";

export interface BlogItem {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: {
    url: string;
    alt: string;
    publicId?: string;
  };
  category: string;
  tags: string[];
  author: {
    name: string;
    id?: string;
  };
  status: string;
  publishedAt?: string;
  readTime: number;
  createdAt?: string;
}

interface RawBlogDoc {
  _id?: { toString(): string };
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: {
    url: string;
    alt: string;
    publicId?: string;
  };
  category: string;
  tags?: string[];
  author?: {
    name: string;
    id?: { toString(): string };
  };
  status: string;
  publishedAt?: { toISOString(): string } | Date;
  createdAt?: { toISOString(): string } | Date;
  readTime: number;
}

function getISODate(val: Date | { toISOString(): string } | string | undefined): string {
  if (!val) return "";
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "object" && typeof val.toISOString === "function") {
    return val.toISOString();
  }
  if (typeof val === "string") return val;
  return "";
}

// Serializable plain object mapper
function serializeBlog(doc: RawBlogDoc): BlogItem {
  return {
    _id: doc._id?.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    coverImage: {
      url: doc.coverImage?.url || "/images/hero/hotel-lobby.jpg",
      alt: doc.coverImage?.alt || doc.title,
      publicId: doc.coverImage?.publicId,
    },
    category: doc.category,
    tags: doc.tags || [],
    author: {
      name: doc.author?.name || "THEDCO Advisory Team",
      id: doc.author?.id?.toString(),
    },
    status: doc.status,
    publishedAt: getISODate(doc.publishedAt) || getISODate(doc.createdAt),
    readTime: doc.readTime || 5,
    createdAt: getISODate(doc.createdAt),
  };
}

// Fallback high-end advisory mock articles
const MOCK_BLOGS: BlogItem[] = [
  {
    title: "HOW TO GET UNSTUCK WITHOUT HIRING ANOTHER ADVISOR",
    slug: "how-to-get-unstuck-without-hiring-another-advisor",
    excerpt: "How founders and operators regain clarity through direct, brutally honest operational audits and actionable peer frameworks.",
    content: `
# How to Get Unstuck Without Hiring Another Advisor

When a hospitality business stagnates, the instinctive response is often to hire more consultants. But most advisors offer generic playbooks.

## 1. Cut Through the Noise
Real clarity comes from deep operational diagnostics on the floor, not in boardrooms.

## 2. Focus on Unit Economics
Focus on labor cost optimization, waste reduction, and guest retention.
    `,
    coverImage: {
      url: "/images/hero/hotel-lobby.jpg",
      alt: "Luxury Hotel Lobby",
    },
    category: "Building & Growth",
    tags: ["Operations", "Strategy", "Growth"],
    author: { name: "Manav Chandak" },
    status: "published",
    publishedAt: "2025-12-20T10:00:00.000Z",
    readTime: 6,
  },
  {
    title: "THE QUIET WAY FOUNDERS SOLVE HARD PROBLEMS",
    slug: "the-quiet-way-founders-solve-hard-problems",
    excerpt: "How experienced hospitality operators think through complex financial and labor challenges without the media noise.",
    content: `
# The Quiet Way Founders Solve Hard Problems

Behind every successful resort or restaurant chain is a series of unseen, calculated decisions.

## 1. First-Principles Problem Solving
Break down your P&L line by line before making sweeping changes.
    `,
    coverImage: {
      url: "/images/services/fine-dining.jpg",
      alt: "Fine Dining Restaurant",
    },
    category: "Mindset & Decisions",
    tags: ["Leadership", "Problem Solving"],
    author: { name: "Vikram Malhotra" },
    status: "published",
    publishedAt: "2025-12-20T10:00:00.000Z",
    readTime: 5,
  },
  {
    title: "WHAT FOUNDERS ACTUALLY TALK ABOUT BEHIND CLOSED DOORS",
    slug: "what-founders-actually-talk-about",
    excerpt: "Honest conversations operators have when the room is private and the stakes are real.",
    content: `
# What Founders Actually Talk About

The unvarnished truth about managing cash flow, retaining top culinary talent, and scaling without diluting brand quality.
    `,
    coverImage: {
      url: "/images/general/detail-architecture.jpg",
      alt: "Architectural Detail",
    },
    category: "Founder Life",
    tags: ["Leadership", "Culture"],
    author: { name: "Ankit Sharma" },
    status: "published",
    publishedAt: "2026-02-12T10:00:00.000Z",
    readTime: 7,
  },
  {
    title: "WHY MOST FOUNDER COMMUNITIES DON'T WORK",
    slug: "why-most-founder-communities-dont-work",
    excerpt: "Peer support that actually works requires vulnerability, shared benchmarks, and unfiltered data.",
    content: `
# Why Most Operator Networks Fail

Networking without actionable insights is just noise; here is how we build true peer accountability.
    `,
    coverImage: {
      url: "/images/hero/hotel-lobby.jpg",
      alt: "Luxury Hotel",
    },
    category: "Squads & Community",
    tags: ["Community", "Networking"],
    author: { name: "Manav Chandak" },
    status: "published",
    publishedAt: "2025-12-20T10:00:00.000Z",
    readTime: 4,
  },
  {
    title: "STRUCTURING OPERATIONS BEFORE A LUXURY RESORT LAUNCH",
    slug: "structuring-operations-luxury-resort-launch",
    excerpt: "A 180-day pre-opening operational roadmap covering hiring, SOP implementation, and vendor onboarding.",
    content: `
# Structuring Operations Before A Launch

Key steps for a flawless luxury resort launch.
    `,
    coverImage: {
      url: "/images/services/fine-dining.jpg",
      alt: "Resort Launch",
    },
    category: "Operations",
    tags: ["Pre-Opening", "Hotels"],
    author: { name: "Manav Chandak" },
    status: "published",
    publishedAt: "2026-01-15T10:00:00.000Z",
    readTime: 8,
  },
  {
    title: "HOSPITALITY TRENDS SHAPING EMERGING MARKETS IN 2026",
    slug: "hospitality-trends-shaping-indias-emerging-markets",
    excerpt: "An in-depth analysis of shifting guest expectations, regional corridors, and tier 2 market expansion.",
    content: `
# Hospitality Trends In 2026

The seismic shift towards boutique and experiential hospitality in secondary markets.
    `,
    coverImage: {
      url: "/images/general/detail-architecture.jpg",
      alt: "Market Trends",
    },
    category: "Event",
    tags: ["Market Analysis", "Trends"],
    author: { name: "Vikram Malhotra" },
    status: "published",
    publishedAt: "2026-03-01T10:00:00.000Z",
    readTime: 5,
  },
];

export const getBlogs = cache(async (): Promise<BlogItem[]> => {
  try {
    await connectToDatabase();
    const docs = await Blog.find({ status: "published" }).sort({ publishedAt: -1 }).lean();
    if (!docs || docs.length === 0) {
      return MOCK_BLOGS;
    }
    return docs.map(serializeBlog);
  } catch (error) {
    console.warn("Failed to fetch blogs from database, using mock data fallback:", error);
    return MOCK_BLOGS;
  }
});

export const getBlogBySlug = cache(async (slug: string): Promise<BlogItem | null> => {
  try {
    await connectToDatabase();
    const doc = await Blog.findOne({ slug, status: "published" }).lean();
    if (!doc) {
      // Fallback search in mock data
      const mockMatch = MOCK_BLOGS.find((b) => b.slug === slug);
      return mockMatch || null;
    }
    return serializeBlog(doc);
  } catch (error) {
    console.warn("Failed to find blog by slug, searching mocks:", error);
    const mockMatch = MOCK_BLOGS.find((b) => b.slug === slug);
    return mockMatch || null;
  }
});
