export interface StoreSettings {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  contactEmail: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  seoTitle: string;
  seoDescription: string;
  currency: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
  createdAt?: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  oldPrice?: number;
  currency: string;
  categoryId?: string;
  affiliateUrl: string;
  ctaText?: string;
  badge?: string;
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface AffiliateClick {
  id?: string;
  storeId: string;
  productId: string;
  timestamp: string; // ISO string
  referrer?: string;
  userAgent?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  role: 'admin';
}
