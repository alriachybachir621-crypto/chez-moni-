export type Language = 'en' | 'ar';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  colors: string[];
  images: string[];
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  description: string;
  descriptionAr: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  image: string;
  order: number;
  updatedAt?: unknown;
}

export interface ShopSettings {
  heroTitle: string;
  heroTitleAr: string;
  heroSubtitle: string;
  heroSubtitleAr: string;
  heroImages: string[];
  whatsapp: string;
  secondaryPhone: string;
  address: string;
  addressAr: string;
  mapsEmbedUrl: string;
  mapsLink: string;
  hours: string;
  hoursAr: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  pinConfigured: boolean;
  updatedAt?: unknown;
}

export interface CartItem {
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  color: string;
  quantity: number;
  image: string;
}
