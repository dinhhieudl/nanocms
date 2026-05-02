export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_desc: string | null;
  price: number;
  sale_price: number | null;
  sku: string | null;
  stock: number;
  attributes: Attribute[];
  images: string[];
  category_id: string | null;
  category_name?: string;
  category_slug?: string;
  is_active: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_desc: string | null;
  avg_rating?: number;
  review_count?: number;
  effective_price?: number;
  created_at: string;
  updated_at: string;
}

export interface Attribute {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  attributes: Record<string, string>;
  price: number | null;
  stock: number;
  image_url: string | null;
  is_active: boolean;
}

export interface CartItem {
  product_id: string;
  variant_id?: string;
  name: string;
  sku?: string;
  qty: number;
  unit_price: number;
  total: number;
  image?: string;
  attributes?: Record<string, string>;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: string;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  line_items: CartItem[];
  shipping_address: Address;
  billing_address: Address;
  coupon_code: string | null;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

export interface Address {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  country: string;
}

export interface SiteOption {
  header: {
    logo_url: string;
    sticky: boolean;
    transparent: boolean;
    nav_items: { label: string; href: string }[];
    cta: { label: string; href: string; icon: string };
  };
  footer: {
    columns: { title: string; links: { label: string; href: string }[] }[];
    copyright: string;
    social: Record<string, string>;
  };
  homepage: {
    sections: Section[];
  };
}

export interface Section {
  type: string;
  data: Record<string, any>;
}

export interface BuilderBlock {
  id: string;
  type: 'section' | 'row' | 'column' | 'text' | 'image' | 'banner' | 'product_grid' | 'hero' | 'spacer' | 'button';
  props: Record<string, any>;
  children?: BuilderBlock[];
}
