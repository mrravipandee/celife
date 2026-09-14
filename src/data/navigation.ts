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

export const productCategoryNavItems: NavSubItem[] = [
  {
    label: "Neurological Wellness",
    href: "/products?category=Neurological+Wellness",
    tagline: "Cellular & neural vitality formulations",
  },
  {
    label: "Joint & Mobility",
    href: "/products?category=Joint+%26+Mobility",
    tagline: "Cartilage & musculoskeletal support",
  },
  {
    label: "Hepatic & Digestive",
    href: "/products?category=Hepatic+%26+Digestive",
    tagline: "Metabolic detoxification & gut comfort",
  },
  {
    label: "Immunity & Resilience",
    href: "/products?category=Immunity+%26+Resilience",
    tagline: "Antioxidant & daily defense matrix",
  },
];

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    href: "/products",
    items: productCategoryNavItems,
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
