import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './firebase';
import { StoreSettings, Product, Category, AffiliateClick } from '../types';

export const DEFAULT_STORE_ID = 'main-store';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: DEFAULT_STORE_ID,
  name: 'Curated Finds & Gear',
  slug: 'curated-finds',
  logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&auto=format&fit=crop&q=80',
  description: 'Handpicked gadgets, creator gear, and daily essentials reviewed and recommended for modern lifestyle.',
  contactEmail: 'contact@curatedfinds.store',
  whatsapp: '+1 234 567 8900',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  tiktok: 'https://tiktok.com',
  seoTitle: 'Curated Finds & Gear | Best Handpicked Gadgets & Tech',
  seoDescription: 'Discover editor-tested tech, productivity essentials, and smart lifestyle tools with direct verified vendor links.',
  currency: 'USD',
  updatedAt: new Date().toISOString()
};

// Initial starter seed products and categories for immediate storefront experience
const SEED_CATEGORIES: Omit<Category, 'id'>[] = [
  {
    storeId: DEFAULT_STORE_ID,
    name: 'Tech & Audio',
    slug: 'tech-audio',
    description: 'Noise-cancelling headphones, Hi-Fi gear, and portable audio.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    order: 1
  },
  {
    storeId: DEFAULT_STORE_ID,
    name: 'Workspace & Desk',
    slug: 'workspace-desk',
    description: 'Ergonomic chairs, monitor arms, and mechanical keyboards.',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    order: 2
  },
  {
    storeId: DEFAULT_STORE_ID,
    name: 'Travel & Everyday Carry',
    slug: 'travel-edc',
    description: 'Minimalist backpacks, power banks, and durable accessories.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    order: 3
  },
  {
    storeId: DEFAULT_STORE_ID,
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Connected lighting, air quality sensors, and hub tech.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
    order: 4
  }
];

const SEED_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    storeId: DEFAULT_STORE_ID,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5-wireless-headphones',
    shortDescription: 'Industry-leading noise cancellation with dual processors and 8 microphones.',
    description: 'The Sony WH-1000XM5 rewrites the rules for distraction-free listening. With two processors controlling eight microphones, Auto NC Optimizer for automatically optimizing noise cancellation based on your wearing conditions and environment, and a specially designed driver unit.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    price: 399.99,
    oldPrice: 449.99,
    currency: 'USD',
    affiliateUrl: 'https://www.amazon.com/dp/B09XS7JWHH?tag=curatedfinds-20',
    ctaText: 'View on Amazon',
    badge: 'Best Overall',
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    storeId: DEFAULT_STORE_ID,
    name: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
    slug: 'keychron-q1-pro-wireless-mechanical-keyboard',
    shortDescription: 'Full aluminum body, custom double-gasket design, and hot-swappable switches.',
    description: 'A groundbreaking all-metal wireless mechanical keyboard supporting QMK/VIA. Along with numerous premium designs, including double-gasket design, PBT keycaps, and screw-in stabs, it delivers an unprecedented typing experience.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
    ],
    price: 199.00,
    oldPrice: 219.00,
    currency: 'USD',
    affiliateUrl: 'https://www.keychron.com/products/keychron-q1-pro-qmk-via-wireless-custom-mechanical-keyboard?ref=curatedfinds',
    ctaText: 'Buy on Keychron',
    badge: 'Staff Pick',
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    storeId: DEFAULT_STORE_ID,
    name: 'Peak Design Everyday Backpack 20L',
    slug: 'peak-design-everyday-backpack-20l',
    shortDescription: 'An iconic, award-winning pack for everyday and photo carry with MagLatch hardware.',
    description: 'Ultra-clean aesthetics, unmatched accessibility, and modular FlexFold dividers. 100% recycled 400D weatherproof shell keeps your laptop and gear safe from rain and drops.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    price: 279.95,
    currency: 'USD',
    affiliateUrl: 'https://www.peakdesign.com/products/everyday-backpack?rfsn=curatedfinds',
    ctaText: 'Get at Peak Design',
    badge: 'Editor Choice',
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    storeId: DEFAULT_STORE_ID,
    name: 'BenQ ScreenBar Pro Monitor Light',
    slug: 'benq-screenbar-pro-monitor-light',
    shortDescription: 'Auto-dimming e-reading LED monitor desk lamp with no screen glare.',
    description: 'Features real-time auto-dimming with ambient light sensor, asymmetrical optical design that eliminates reflective screen glare, and motion sensor auto-on/off.',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    price: 139.00,
    currency: 'USD',
    affiliateUrl: 'https://www.amazon.com/dp/B0CXDXC5T1?tag=curatedfinds-20',
    ctaText: 'Check Price',
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    storeId: DEFAULT_STORE_ID,
    name: 'Anker Prime 20,000mAh Power Bank (200W)',
    slug: 'anker-prime-20000mah-power-bank-200w',
    shortDescription: 'Ultra-fast multi-device fast charging power bank with smart digital display.',
    description: 'Equipped with two high-powered USB-C ports and one USB-A port totaling 200W output. Quickly charge two laptops simultaneously at 100W each for maximum efficiency.',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
    price: 129.99,
    oldPrice: 149.99,
    currency: 'USD',
    affiliateUrl: 'https://www.amazon.com/dp/B0BYP2F3SG?tag=curatedfinds-20',
    ctaText: 'View on Amazon',
    badge: 'Popular',
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// STORE SETTINGS
export async function getStoreSettings(storeId = DEFAULT_STORE_ID): Promise<StoreSettings> {
  try {
    const docRef = doc(db, 'stores', storeId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as StoreSettings;
    }
    // Only persist default store settings document if admin is authenticated
    if (auth.currentUser) {
      try {
        await setDoc(docRef, DEFAULT_STORE_SETTINGS);
      } catch (writeErr) {
        console.warn('Could not persist default store settings:', writeErr);
      }
    }
    return DEFAULT_STORE_SETTINGS;
  } catch (error) {
    console.warn('Using default store settings fallback:', error);
    return DEFAULT_STORE_SETTINGS;
  }
}

export async function updateStoreSettings(settings: StoreSettings): Promise<void> {
  const docRef = doc(db, 'stores', settings.id || DEFAULT_STORE_ID);
  await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
}

// SEED DATABASE HELPER (If brand new database and admin is signed in)
export async function seedInitialDataIfNeeded(storeId = DEFAULT_STORE_ID): Promise<void> {
  // Only attempt seeding Firestore documents if an admin is authenticated
  if (!auth.currentUser) {
    return;
  }
  try {
    const productsQuery = query(collection(db, 'products'), where('storeId', '==', storeId), limit(1));
    const prodSnap = await getDocs(productsQuery);
    if (!prodSnap.empty) {
      return; // Already initialized
    }

    // Seed Categories
    const categoryMap = new Map<string, string>();
    for (const cat of SEED_CATEGORIES) {
      const catRef = await addDoc(collection(db, 'categories'), {
        ...cat,
        createdAt: new Date().toISOString()
      });
      categoryMap.set(cat.name, catRef.id);
    }

    // Seed Products with categoryIds
    for (const prod of SEED_PRODUCTS) {
      let matchedCatId = '';
      if (prod.name.includes('Headphones')) matchedCatId = categoryMap.get('Tech & Audio') || '';
      else if (prod.name.includes('Keyboard') || prod.name.includes('BenQ')) matchedCatId = categoryMap.get('Workspace & Desk') || '';
      else if (prod.name.includes('Backpack') || prod.name.includes('Power Bank')) matchedCatId = categoryMap.get('Travel & Everyday Carry') || '';

      await addDoc(collection(db, 'products'), {
        ...prod,
        categoryId: matchedCatId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Seed Store document
    await setDoc(doc(db, 'stores', storeId), DEFAULT_STORE_SETTINGS, { merge: true });
    console.log('Seeded storefront initial inventory');
  } catch (err) {
    console.warn('Seed operation skipped or failed:', err);
  }
}

// CATEGORIES
export async function getCategories(storeId = DEFAULT_STORE_ID): Promise<Category[]> {
  try {
    const q = query(collection(db, 'categories'), where('storeId', '==', storeId));
    const snap = await getDocs(q);
    const list: Category[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Category);
    });
    if (list.length > 0) {
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    // If Firestore has no categories yet, return starter categories so storefront displays nicely
    return SEED_CATEGORIES.map((cat, i) => ({
      ...cat,
      id: `seed-cat-${i + 1}`
    }));
  } catch (err) {
    console.warn('Categories query notice, using default categories:', err);
    return SEED_CATEGORIES.map((cat, i) => ({
      ...cat,
      id: `seed-cat-${i + 1}`
    }));
  }
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'categories'), {
    ...data,
    createdAt: new Date().toISOString()
  });
  return ref.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  await updateDoc(doc(db, 'categories', id), data);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'categories', id));
}

// PRODUCTS
export async function getProducts(options?: {
  storeId?: string;
  categoryId?: string;
  status?: 'active' | 'inactive' | 'draft';
  featuredOnly?: boolean;
}): Promise<Product[]> {
  try {
    const storeId = options?.storeId || DEFAULT_STORE_ID;
    let q = query(collection(db, 'products'), where('storeId', '==', storeId));
    
    if (options?.status) {
      q = query(q, where('status', '==', options.status));
    }
    if (options?.categoryId) {
      q = query(q, where('categoryId', '==', options.categoryId));
    }
    if (options?.featuredOnly) {
      q = query(q, where('featured', '==', true));
    }

    const snap = await getDocs(q);
    const list: Product[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Product);
    });
    
    if (list.length > 0) {
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }

    // If Firestore has no products yet, provide starter inventory
    let fallback: Product[] = SEED_PRODUCTS.map((prod, i) => ({
      ...prod,
      id: `seed-prod-${i + 1}`,
      categoryId: i === 0 ? 'seed-cat-1' : (i === 1 || i === 3 ? 'seed-cat-2' : 'seed-cat-3')
    }));

    if (options?.status) {
      fallback = fallback.filter((p) => p.status === options.status);
    }
    if (options?.categoryId) {
      fallback = fallback.filter((p) => p.categoryId === options.categoryId);
    }
    if (options?.featuredOnly) {
      fallback = fallback.filter((p) => p.featured);
    }

    return fallback;
  } catch (err) {
    console.warn('Products query fallback:', err);
    let fallback: Product[] = SEED_PRODUCTS.map((prod, i) => ({
      ...prod,
      id: `seed-prod-${i + 1}`,
      categoryId: i === 0 ? 'seed-cat-1' : (i === 1 || i === 3 ? 'seed-cat-2' : 'seed-cat-3')
    }));

    if (options?.status) {
      fallback = fallback.filter((p) => p.status === options.status);
    }
    if (options?.categoryId) {
      fallback = fallback.filter((p) => p.categoryId === options.categoryId);
    }
    if (options?.featuredOnly) {
      fallback = fallback.filter((p) => p.featured);
    }

    return fallback;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const snap = await getDoc(doc(db, 'products', id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Product;
    }
    const seed = SEED_PRODUCTS.map((prod, i) => ({
      ...prod,
      id: `seed-prod-${i + 1}`,
      categoryId: i === 0 ? 'seed-cat-1' : (i === 1 || i === 3 ? 'seed-cat-2' : 'seed-cat-3')
    })).find((p) => p.id === id);
    return seed || null;
  } catch (err) {
    console.warn('Product lookup by ID fallback:', err);
    const seed = SEED_PRODUCTS.map((prod, i) => ({
      ...prod,
      id: `seed-prod-${i + 1}`,
      categoryId: i === 0 ? 'seed-cat-1' : (i === 1 || i === 3 ? 'seed-cat-2' : 'seed-cat-3')
    })).find((p) => p.id === id);
    return seed || null;
  }
}

export async function getProductBySlug(slug: string, storeId = DEFAULT_STORE_ID): Promise<Product | null> {
  try {
    const q = query(
      collection(db, 'products'), 
      where('storeId', '==', storeId),
      where('slug', '==', slug),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as Product;
    }
    const seed = SEED_PRODUCTS.map((prod, i) => ({
      ...prod,
      id: `seed-prod-${i + 1}`,
      categoryId: i === 0 ? 'seed-cat-1' : (i === 1 || i === 3 ? 'seed-cat-2' : 'seed-cat-3')
    })).find((p) => p.slug === slug);
    return seed || null;
  } catch (err) {
    console.warn('Product lookup by slug fallback:', err);
    const seed = SEED_PRODUCTS.map((prod, i) => ({
      ...prod,
      id: `seed-prod-${i + 1}`,
      categoryId: i === 0 ? 'seed-cat-1' : (i === 1 || i === 3 ? 'seed-cat-2' : 'seed-cat-3')
    })).find((p) => p.slug === slug);
    return seed || null;
  }
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// IMAGE UPLOAD
export async function uploadProductImage(file: File, pathPrefix = 'products'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const storageRef = ref(storage, `${pathPrefix}/${fileName}`);
  const uploadResult = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(uploadResult.ref);
  return downloadUrl;
}

// AFFILIATE CLICKS & ANALYTICS
export async function recordAffiliateClick(productId: string, storeId = DEFAULT_STORE_ID): Promise<string> {
  try {
    const clickData: AffiliateClick = {
      storeId,
      productId,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || '',
      userAgent: navigator.userAgent.substring(0, 150)
    };
    const ref = await addDoc(collection(db, 'clicks'), clickData);
    return ref.id;
  } catch (err) {
    console.warn('Affiliate click notice:', err);
    return '';
  }
}

export async function getAffiliateClicks(storeId = DEFAULT_STORE_ID): Promise<AffiliateClick[]> {
  try {
    const q = query(collection(db, 'clicks'), where('storeId', '==', storeId));
    const snap = await getDocs(q);
    const list: AffiliateClick[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as AffiliateClick);
    });
    return list;
  } catch (err) {
    console.warn('Affiliate clicks query notice:', err);
    return [];
  }
}
