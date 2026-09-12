export interface NavSubItem {
  label: string;
  href: string;
  tagline?: string;
}

export interface NavItem {
  label: string;
  href: string;
  items?: NavSubItem[];
}

export const serviceNavItems: NavSubItem[] = [
  {
    label: "Hospitality Audit Services",
    href: "/services/hospitality-audit",
    tagline: "Audit. Identify. Improve. Perform.",
  },
  {
    label: "Consulting Services",
    href: "/services/consulting-services",
    tagline: "Strategy. Operations. Turnaround. Growth.",
  },
];

export const navItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Founder", href: "/founder" },
  {
    label: "Services",
    href: "/services/consulting-services",
    items: serviceNavItems,
  },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
