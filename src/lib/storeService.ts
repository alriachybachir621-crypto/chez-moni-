import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_SHOP_SETTINGS,
} from '../data/seedData';
import { Category, Product, ShopSettings } from '../types/store';
import {
  db,
  handleFirestoreError,
  OperationType,
  storage,
} from './firebase';

export function sanitizeId(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return cleaned || `item-${Date.now()}`;
}

export function subscribeProducts(
  onData: (items: Product[]) => void
): () => void {
  const path = 'products';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Product[] = snapshot.docs.map((d) => ({
        ...(d.data() as Product),
        id: d.id,
      }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeCategories(
  onData: (items: Category[]) => void
): () => void {
  const path = 'categories';
  const q = query(collection(db, path), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Category[] = snapshot.docs.map((d) => ({
        ...(d.data() as Category),
        id: d.id,
      }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeShopSettings(
  onData: (settings: ShopSettings | null) => void
): () => void {
  const path = 'settings/shop';
  return onSnapshot(
    doc(db, 'settings', 'shop'),
    (snap) => {
      if (snap.exists()) {
        onData(snap.data() as ShopSettings);
      } else {
        onData(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function seedFirestoreIfEmpty(pinConfigured: boolean): Promise<void> {
  try {
    const settingsRef = doc(db, 'settings', 'shop');
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, {
        ...DEFAULT_SHOP_SETTINGS,
        pinConfigured,
        updatedAt: serverTimestamp(),
      });
    } else if (pinConfigured && !settingsSnap.data()?.pinConfigured) {
      await updateDoc(settingsRef, {
        pinConfigured: true,
        updatedAt: serverTimestamp(),
      });
    }

    const catSnap = await getDocs(collection(db, 'categories'));
    if (catSnap.empty) {
      const batch = writeBatch(db);
      for (const cat of DEFAULT_CATEGORIES) {
        const id = sanitizeId(cat.id);
        batch.set(doc(db, 'categories', id), {
          id,
          slug: sanitizeId(cat.slug),
          name: cat.name.slice(0, 80),
          nameAr: cat.nameAr.slice(0, 80),
          image: cat.image.slice(0, 1000),
          order: cat.order,
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
    }

    const prodSnap = await getDocs(collection(db, 'products'));
    if (prodSnap.empty) {
      const batch = writeBatch(db);
      for (const prod of DEFAULT_PRODUCTS) {
        const id = sanitizeId(prod.id);
        batch.set(doc(db, 'products', id), {
          id,
          name: prod.name.slice(0, 140),
          nameAr: (prod.nameAr || '').slice(0, 140),
          category: sanitizeId(prod.category).slice(0, 80),
          price: Math.max(0, Math.min(100000, Number(prod.price) || 0)),
          oldPrice:
            prod.oldPrice != null && prod.oldPrice > 0
              ? Math.max(0, Math.min(100000, Number(prod.oldPrice)))
              : null,
          colors: (prod.colors || []).slice(0, 12).map((c) => c.slice(0, 60)),
          images: (prod.images.length > 0 ? prod.images : ['/catalog/hero-showcase.png'])
            .slice(0, 10)
            .map((img) => img.slice(0, 1000)),
          inStock: Boolean(prod.inStock),
          isNew: Boolean(prod.isNew),
          isSale: Boolean(prod.isSale),
          description: (prod.description || '').slice(0, 1500),
          descriptionAr: (prod.descriptionAr || '').slice(0, 1500),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
  }
}

export async function saveProduct(
  product: Omit<Product, 'createdAt' | 'updatedAt'>,
  isNewDoc: boolean
): Promise<void> {
  const id = sanitizeId(product.id);
  const path = `products/${id}`;
  const docRef = doc(db, 'products', id);

  const images = (product.images || [])
    .map((s) => s.trim().slice(0, 1000))
    .filter(Boolean)
    .slice(0, 10);

  if (images.length === 0) {
    images.push('/catalog/hero-showcase.png');
  }

  const colors = (product.colors || [])
    .map((s) => s.trim().slice(0, 60))
    .filter(Boolean)
    .slice(0, 12);

  const normalizedOldPrice =
    product.oldPrice != null && Number(product.oldPrice) > 0
      ? Math.max(0, Math.min(100000, Number(product.oldPrice)))
      : null;

  const basePayload = {
    id,
    name: product.name.trim().slice(0, 140) || 'Tech Item',
    nameAr: (product.nameAr || '').trim().slice(0, 140),
    category: sanitizeId(product.category || 'accessories').slice(0, 80),
    price: Math.max(0, Math.min(100000, Number(product.price) || 0)),
    oldPrice: normalizedOldPrice,
    colors,
    images,
    inStock: Boolean(product.inStock),
    isNew: Boolean(product.isNew),
    isSale: Boolean(product.isSale),
    description: (product.description || '').trim().slice(0, 1500),
    descriptionAr: (product.descriptionAr || '').trim().slice(0, 1500),
    updatedAt: serverTimestamp(),
  };

  try {
    if (isNewDoc) {
      await setDoc(docRef, {
        ...basePayload,
        createdAt: serverTimestamp(),
      });
    } else {
      const existingSnap = await getDoc(docRef);
      if (!existingSnap.exists()) {
        await setDoc(docRef, {
          ...basePayload,
          createdAt: serverTimestamp(),
        });
      } else {
        const { id: _ignoreId, ...updateFields } = basePayload;
        void _ignoreId;
        await updateDoc(docRef, updateFields);
      }
    }
  } catch (error) {
    handleFirestoreError(
      error,
      isNewDoc ? OperationType.CREATE : OperationType.UPDATE,
      path
    );
  }
}

export async function removeProduct(productId: string): Promise<void> {
  const id = sanitizeId(productId);
  const path = `products/${id}`;
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveCategory(
  category: Omit<Category, 'updatedAt'>,
  isNewDoc: boolean
): Promise<void> {
  const id = sanitizeId(category.id);
  const path = `categories/${id}`;
  const docRef = doc(db, 'categories', id);

  const payload = {
    slug: sanitizeId(category.slug || id).slice(0, 80),
    name: category.name.trim().slice(0, 80) || 'Category',
    nameAr: (category.nameAr || '').trim().slice(0, 80),
    image: (category.image || '/catalog/hero-showcase.png').trim().slice(0, 1000),
    order: Math.max(0, Math.min(1000, Number(category.order) || 1)),
    updatedAt: serverTimestamp(),
  };

  try {
    if (isNewDoc) {
      await setDoc(docRef, { id, ...payload });
    } else {
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        await setDoc(docRef, { id, ...payload });
      } else {
        await updateDoc(docRef, payload);
      }
    }
  } catch (error) {
    handleFirestoreError(
      error,
      isNewDoc ? OperationType.CREATE : OperationType.UPDATE,
      path
    );
  }
}

export async function removeCategory(categoryId: string): Promise<void> {
  const id = sanitizeId(categoryId);
  const path = `categories/${id}`;
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveShopSettings(
  settings: Omit<ShopSettings, 'updatedAt'>
): Promise<void> {
  const path = 'settings/shop';
  const docRef = doc(db, 'settings', 'shop');

  const payload = {
    heroTitle: (settings.heroTitle || 'Your Tech Partner').trim().slice(0, 120),
    heroTitleAr: (settings.heroTitleAr || '').trim().slice(0, 120),
    heroSubtitle: (settings.heroSubtitle || '').trim().slice(0, 400),
    heroSubtitleAr: (settings.heroSubtitleAr || '').trim().slice(0, 400),
    heroImages: (settings.heroImages || [])
      .map((s) => s.trim().slice(0, 1000))
      .filter(Boolean)
      .slice(0, 8),
    whatsapp: (settings.whatsapp || '81 922 013').trim().slice(0, 30),
    secondaryPhone: (settings.secondaryPhone || '').trim().slice(0, 30),
    address: (settings.address || 'Zahle, Lebanon').trim().slice(0, 240),
    addressAr: (settings.addressAr || '').trim().slice(0, 240),
    mapsEmbedUrl: (settings.mapsEmbedUrl || '').trim().slice(0, 1000),
    mapsLink: (settings.mapsLink || '').trim().slice(0, 1000),
    hours: (settings.hours || '').trim().slice(0, 160),
    hoursAr: (settings.hoursAr || '').trim().slice(0, 160),
    facebookUrl: (settings.facebookUrl || '').trim().slice(0, 500),
    instagramUrl: (settings.instagramUrl || '').trim().slice(0, 500),
    tiktokUrl: (settings.tiktokUrl || '').trim().slice(0, 500),
    pinConfigured: Boolean(settings.pinConfigured),
    updatedAt: serverTimestamp(),
  };

  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function uploadStoreImage(
  file: File,
  folder: 'products' | 'categories' | 'hero'
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 60);
  const storageRef = ref(storage, `${folder}/${Date.now()}-${safeName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
