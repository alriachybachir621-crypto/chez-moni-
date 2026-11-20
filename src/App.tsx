import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_SHOP_SETTINGS,
} from './data/seedData';
import { auth, MANAGER_EMAIL } from './lib/firebase';
import {
  subscribeCategories,
  subscribeProducts,
  subscribeShopSettings,
} from './lib/storeService';
import {
  CartItem,
  Category,
  Language,
  Product,
  ShopSettings,
} from './types/store';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductGrid, SortOption } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { DeliveryGalleryContact } from './components/DeliveryGalleryContact';
import { CartDrawer } from './components/CartDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PinPadModal } from './components/PinPadModal';
import { StoreManagerModal } from './components/StoreManagerModal';

const WISHLIST_KEY = 'chez_moni_wishlist';
const CART_KEY = 'chez_moni_cart';
const LANG_KEY = 'chez_moni_lang';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === 'ar' ? 'ar' : 'en';
  });

  const [fsProducts, setFsProducts] = useState<Product[] | null>(null);
  const [fsCategories, setFsCategories] = useState<Category[] | null>(null);
  const [fsSettings, setFsSettings] = useState<ShopSettings | null>(null);

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [wishlistOnly, setWishlistOnly] = useState(false);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  // Sync HTML lang & RTL direction
  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Firebase Auth & Firestore Subscriptions
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    const unsubProd = subscribeProducts((items) => setFsProducts(items));
    const unsubCat = subscribeCategories((items) => setFsCategories(items));
    const unsubSettings = subscribeShopSettings((s) => setFsSettings(s));

    return () => {
      unsubAuth();
      unsubProd();
      unsubCat();
      unsubSettings();
    };
  }, []);

  const products = useMemo(
    () =>
      fsProducts && fsProducts.length > 0 ? fsProducts : DEFAULT_PRODUCTS,
    [fsProducts]
  );

  const categories = useMemo(
    () =>
      fsCategories && fsCategories.length > 0
        ? fsCategories
        : DEFAULT_CATEGORIES,
    [fsCategories]
  );

  const settings = useMemo(
    () => fsSettings || DEFAULT_SHOP_SETTINGS,
    [fsSettings]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (wishlistOnly && !wishlistIds.includes(p.id)) {
        return false;
      }
      if (q) {
        const hay = `${p.name} ${p.nameAr} ${p.description} ${p.descriptionAr} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, selectedCategory, wishlistOnly, wishlistIds, searchQuery, sortBy]);

  const handleToggleWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const handleAddToCart = useCallback(
    (product: Product, chosenColor?: string, qty = 1) => {
      const color = chosenColor ?? product.colors[0] ?? '';
      const image = product.images[0] || '/catalog/hero-showcase.png';
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === product.id && item.color === color
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
          };
          return updated;
        }
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            color,
            quantity: qty,
            image,
          },
        ];
      });
    },
    []
  );

  const handleUpdateCartQty = useCallback(
    (productId: string, color: string, delta: number) => {
      setCart((prev) =>
        prev
          .map((item) =>
            item.productId === productId && item.color === color
              ? { ...item, quantity: item.quantity + delta }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  const handleRemoveCartItem = useCallback(
    (productId: string, color: string) => {
      setCart((prev) =>
        prev.filter(
          (item) => !(item.productId === productId && item.color === color)
        )
      );
    },
    []
  );

  const handleLogoTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current > 2500) {
      tapCountRef.current = 1;
    } else {
      tapCountRef.current += 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      if (authUser && authUser.email === MANAGER_EMAIL) {
        setManagerOpen(true);
      } else {
        setPinModalOpen(true);
      }
    }
  }, [authUser]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const activeProductCategoryLabel = useMemo(() => {
    if (!activeProduct) return '';
    const match = categories.find((c) => c.slug === activeProduct.category);
    if (!match) return activeProduct.category;
    return lang === 'ar' && match.nameAr ? match.nameAr : match.name;
  }, [activeProduct, categories, lang]);

  return (
    <div className="min-h-screen bg-[#0B1530] text-white flex flex-col">
      <Navbar
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        wishlistActive={wishlistOnly}
        onToggleWishlistFilter={() => {
          setWishlistOnly((prev) => !prev);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onOpenCart={() => setCartOpen(true)}
        onLogoTap={handleLogoTap}
      />

      <main className="flex-1">
        <HeroSection lang={lang} settings={settings} />

        <CategoriesSection
          lang={lang}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <ProductGrid
          lang={lang}
          products={filteredProducts}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          wishlistOnly={wishlistOnly}
          onToggleWishlistOnly={() => setWishlistOnly((prev) => !prev)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={(p) => handleAddToCart(p)}
          onOpenModal={(p) => setActiveProduct(p)}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setWishlistOnly(false);
            setSortBy('featured');
          }}
        />

        <DeliveryGalleryContact
          lang={lang}
          settings={settings}
          onLogoTap={handleLogoTap}
        />
      </main>

      <ProductModal
        product={activeProduct}
        categoryLabel={activeProductCategoryLabel}
        lang={lang}
        whatsappPhone={settings.whatsapp}
        isWishlisted={
          activeProduct ? wishlistIds.includes(activeProduct.id) : false
        }
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onClose={() => setActiveProduct(null)}
      />

      <CartDrawer
        open={cartOpen}
        lang={lang}
        items={cart}
        whatsappPhone={settings.whatsapp}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
      />

      <FloatingWhatsApp whatsappPhone={settings.whatsapp} />

      <PinPadModal
        open={pinModalOpen}
        lang={lang}
        pinConfigured={Boolean(settings.pinConfigured)}
        onClose={() => setPinModalOpen(false)}
        onSuccess={() => {
          setPinModalOpen(false);
          setManagerOpen(true);
        }}
      />

      <StoreManagerModal
        open={managerOpen && authUser?.email === MANAGER_EMAIL}
        lang={lang}
        products={products}
        categories={categories}
        settings={settings}
        onClose={() => setManagerOpen(false)}
      />
    </div>
  );
}
