import { Metadata } from "next";
import { siteConfig } from "./site";

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonical,
  keywords = siteConfig.keywords,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  keywords?: string[] | string;
  noIndex?: boolean;
} = {}): Metadata {
  const metaTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${siteConfig.url}${canonical.startsWith("/") ? "" : "/"}${canonical}`
    : siteConfig.url;

  const imageUrl = image.startsWith("http") ? image : `${siteConfig.url}${image.startsWith("/") ? "" : "/"}${image}`;

  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: Array.isArray(keywords) ? keywords : [keywords],
    authors: [{ name: "Celife Health Solutions Pvt. Ltd.", url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: "Celife Health Solutions Pvt. Ltd.",
    category: "Healthcare, Herbal Wellness & Nutraceuticals",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — Evidence-Guided Botanical & Nutraceutical Formulations`,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      images: [imageUrl],
      creator: "@celifehealth",
      site: "@celifehealth",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.png", type: "image/png", sizes: "32x32" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
    },
    manifest: "/site.webmanifest",
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/celife-brand.png`,
    image: `${siteConfig.url}/og-image.jpg`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      email: siteConfig.contact.email,
    },
    sameAs: [siteConfig.socials.linkedin, siteConfig.socials.instagram, siteConfig.socials.twitter].filter(Boolean),
  };
}

