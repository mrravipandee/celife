export interface ProductHighlight {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  shortDescription: string;
  description: string;
  formulation: string;
  form: string;
  packaging: string;
  keyFocus: string[];
  highlights: ProductHighlight[];
  wellnessFocus: string;
  usageAdvice?: string;
  image: string;
  featured?: boolean;
}
