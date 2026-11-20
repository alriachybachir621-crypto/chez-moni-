import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  X,
  Upload,
  KeyRound,
  Save,
  Package,
  FolderKanban,
  Store,
} from 'lucide-react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from 'firebase/auth';
import {
  Category,
  Language,
  Product,
  ShopSettings,
} from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';
import { auth, MANAGER_EMAIL, PASSCODE_SUFFIX } from '../lib/firebase';
import {
  removeCategory,
  removeProduct,
  sanitizeId,
  saveCategory,
  saveProduct,
  saveShopSettings,
  uploadStoreImage,
} from '../lib/storeService';

interface StoreManagerModalProps {
  open: boolean;
  lang: Language;
  products: Product[];
  categories: Category[];
  settings: ShopSettings;
  onClose: () => void;
}

type TabKey = 'products' | 'categories' | 'shop' | 'passcode';

export const StoreManagerModal: React.FC<StoreManagerModalProps> = ({
  open,
  lang,
  products,
  categories,
  settings,
  onClose,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<TabKey>('products');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodFormOpen, setProdFormOpen] = useState(false);
  const [pName, setPName] = useState('');
  const [pNameAr, setPNameAr] = useState('');
  const [pCategory, setPCategory] = useState(
    categories[0]?.slug || 'smartwatches'
  );
  const [pPrice, setPPrice] = useState('');
  const [pOldPrice, setPOldPrice] = useState('');
  const [pColors, setPColors] = useState('');
  const [pImages, setPImages] = useState<string[]>([]);
  const [pImageInput, setPImageInput] = useState('');
  const [pInStock, setPInStock] = useState(true);
  const [pIsNew, setPIsNew] = useState(false);
  const [pIsSale, setPIsSale] = useState(false);
  const [pDesc, setPDesc] = useState('');
  const [pDescAr, setPDescAr] = useState('');

  // Category Form State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [cName, setCName] = useState('');
  const [cNameAr, setCNameAr] = useState('');
  const [cSlug, setCSlug] = useState('');
  const [cOrder, setCOrder] = useState('1');
  const [cImage, setCImage] = useState('');

  // Shop Settings Form State
  const [sHeroTitle, setSHeroTitle] = useState(settings.heroTitle);
  const [sHeroTitleAr, setSHeroTitleAr] = useState(settings.heroTitleAr);
  const [sHeroSub, setSHeroSub] = useState(settings.heroSubtitle);
  const [sHeroSubAr, setSHeroSubAr] = useState(settings.heroSubtitleAr);
  const [sHeroImages, setSHeroImages] = useState<string[]>(settings.heroImages);
  const [sHeroImgInput, setSHeroImgInput] = useState('');
  const [sWhatsapp, setSWhatsapp] = useState(settings.whatsapp);
  const [sPhone, setSPhone] = useState(settings.secondaryPhone);
  const [sAddress, setSAddress] = useState(settings.address);
  const [sAddressAr, setSAddressAr] = useState(settings.addressAr);
  const [sMapsEmbed, setSMapsEmbed] = useState(settings.mapsEmbedUrl);
  const [sMapsLink, setSMapsLink] = useState(settings.mapsLink);
  const [sHours, setSHours] = useState(settings.hours);
  const [sHoursAr, setSHoursAr] = useState(settings.hoursAr);
  const [sFacebook, setSFacebook] = useState(settings.facebookUrl);
  const [sInstagram, setSInstagram] = useState(settings.instagramUrl);
  const [sTiktok, setSTiktok] = useState(settings.tiktokUrl);

  // Change Code Form State
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    if (open) {
      setSHeroTitle(settings.heroTitle);
      setSHeroTitleAr(settings.heroTitleAr);
      setSHeroSub(settings.heroSubtitle);
      setSHeroSubAr(settings.heroSubtitleAr);
      setSHeroImages(settings.heroImages || []);
      setSWhatsapp(settings.whatsapp);
      setSPhone(settings.secondaryPhone);
      setSAddress(settings.address);
      setSAddressAr(settings.addressAr);
      setSMapsEmbed(settings.mapsEmbedUrl);
      setSMapsLink(settings.mapsLink);
      setSHours(settings.hours);
      setSHoursAr(settings.hoursAr);
      setSFacebook(settings.facebookUrl);
      setSInstagram(settings.instagramUrl);
      setSTiktok(settings.tiktokUrl);
      setStatusMessage('');
      setErrorMessage('');
    }
  }, [open, settings]);

  if (!open) return null;

  const notify = (msg: string, isErr = false) => {
    if (isErr) {
      setErrorMessage(msg);
      setStatusMessage('');
    } else {
      setStatusMessage(msg);
      setErrorMessage('');
    }
  };

  const openNewProduct = () => {
    setEditingProductId(null);
    setPName('');
    setPNameAr('');
    setPCategory(categories[0]?.slug || 'smartwatches');
    setPPrice('');
    setPOldPrice('');
    setPColors('Black, White');
    setPImages([]);
    setPImageInput('');
    setPInStock(true);
    setPIsNew(true);
    setPIsSale(false);
    setPDesc('');
    setPDescAr('');
    setProdFormOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setPName(p.name);
    setPNameAr(p.nameAr);
    setPCategory(p.category);
    setPPrice(String(p.price));
    setPOldPrice(p.oldPrice != null ? String(p.oldPrice) : '');
    setPColors((p.colors || []).join(', '));
    setPImages(p.images || []);
    setPImageInput('');
    setPInStock(p.inStock);
    setPIsNew(p.isNew);
    setPIsSale(p.isSale);
    setPDesc(p.description || '');
    setPDescAr(p.descriptionAr || '');
    setProdFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingProductId || sanitizeId(pName || `prod-${Date.now()}`);
      const colorsArr = pColors
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const imgs = [...pImages];
      if (pImageInput.trim()) imgs.push(pImageInput.trim());

      await saveProduct(
        {
          id,
          name: pName,
          nameAr: pNameAr,
          category: pCategory,
          price: Number(pPrice) || 0,
          oldPrice: pOldPrice ? Number(pOldPrice) : null,
          colors: colorsArr,
          images: imgs.length > 0 ? imgs : ['/catalog/hero-showcase.png'],
          inStock: pInStock,
          isNew: pIsNew,
          isSale: pIsSale,
          description: pDesc,
          descriptionAr: pDescAr,
        },
        !editingProductId
      );
      setProdFormOpen(false);
      notify('Product saved.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save product.', true);
    }
  };

  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: 'products' | 'categories' | 'hero',
    onUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadStoreImage(file, folder);
      onUrl(url);
      notify('Image uploaded.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Upload failed.', true);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const openNewCategory = () => {
    setEditingCatId(null);
    setCName('');
    setCNameAr('');
    setCSlug('');
    setCOrder(String(categories.length + 1));
    setCImage('/catalog/hero-showcase.png');
    setCatFormOpen(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCatId(c.id);
    setCName(c.name);
    setCNameAr(c.nameAr);
    setCSlug(c.slug);
    setCOrder(String(c.order));
    setCImage(c.image);
    setCatFormOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = sanitizeId(cSlug || cName);
      const id = editingCatId || slug;
      await saveCategory(
        {
          id,
          slug,
          name: cName,
          nameAr: cNameAr,
          image: cImage || '/catalog/hero-showcase.png',
          order: Number(cOrder) || 1,
        },
        !editingCatId
      );
      setCatFormOpen(false);
      notify('Category saved.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save category.', true);
    }
  };

  const handleSaveShopInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const heroImgs = [...sHeroImages];
      if (sHeroImgInput.trim()) heroImgs.push(sHeroImgInput.trim());
      await saveShopSettings({
        heroTitle: sHeroTitle,
        heroTitleAr: sHeroTitleAr,
        heroSubtitle: sHeroSub,
        heroSubtitleAr: sHeroSubAr,
        heroImages: heroImgs,
        whatsapp: sWhatsapp,
        secondaryPhone: sPhone,
        address: sAddress,
        addressAr: sAddressAr,
        mapsEmbedUrl: sMapsEmbed,
        mapsLink: sMapsLink,
        hours: sHours,
        hoursAr: sHoursAr,
        facebookUrl: sFacebook,
        instagramUrl: sInstagram,
        tiktokUrl: sTiktok,
        pinConfigured: true,
      });
      setSHeroImages(heroImgs);
      setSHeroImgInput('');
      notify('Shop info updated.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update shop info.', true);
    }
  };

  const handleChangeCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(currentPin) || !/^\d{4}$/.test(newPin)) {
      notify('Please enter valid 4-digit codes.', true);
      return;
    }
    if (newPin !== confirmPin) {
      notify(t.pinMismatch, true);
      return;
    }
    const user = auth.currentUser;
    if (!user) return;
    try {
      const cred = EmailAuthProvider.credential(
        MANAGER_EMAIL,
        currentPin + PASSCODE_SUFFIX
      );
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPin + PASSCODE_SUFFIX);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      notify(t.codeUpdated);
    } catch {
      notify(t.pinWrong, true);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050A18]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[92vh] rounded-3xl bg-[#0E1A3B] border border-white/15 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#070E22] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/chez-moni-logo.png"
              alt="Chez Moni"
              className="w-9 h-9 rounded-full object-cover"
            />
            <h2 className="font-display text-lg font-bold text-white">
              {t.panelTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logout}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#101E44] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 py-3 bg-[#0B1530] border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#1E6BFF] text-white'
                : 'bg-[#101E44] text-slate-300 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t.tabProducts}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#1E6BFF] text-white'
                : 'bg-[#101E44] text-slate-300 hover:text-white'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>{t.tabCategories}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-[#1E6BFF] text-white'
                : 'bg-[#101E44] text-slate-300 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t.tabShopInfo}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('passcode')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'passcode'
                ? 'bg-[#1E6BFF] text-white'
                : 'bg-[#101E44] text-slate-300 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>{t.tabPasscode}</span>
          </button>
        </div>

        {(statusMessage || errorMessage) && (
          <div
            className={`px-5 py-2.5 text-xs font-semibold ${
              errorMessage
                ? 'bg-rose-500/20 text-rose-200'
                : 'bg-emerald-500/20 text-emerald-200'
            }`}
          >
            {errorMessage || statusMessage}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-300 tabular-nums">
                  {products.length} {t.tabProducts}
                </p>
                <button
                  type="button"
                  onClick={openNewProduct}
                  className="px-4 py-2.5 rounded-xl bg-[#1E6BFF] hover:bg-[#1557D6] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addProduct}</span>
                </button>
              </div>

              {prodFormOpen && (
                <form
                  onSubmit={handleSaveProduct}
                  className="rounded-2xl bg-[#070E22] border border-[#1E6BFF]/40 p-5 space-y-4"
                >
                  <h3 className="font-display text-base font-bold text-white">
                    {editingProductId ? t.editProduct : t.addProduct}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Product Name (EN)"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                    />
                    <input
                      placeholder="Product Name (AR)"
                      value={pNameAr}
                      onChange={(e) => setPNameAr(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                    />

                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Price ($)"
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                      />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Old Price ($)"
                        value={pOldPrice}
                        onChange={(e) => setPOldPrice(e.target.value)}
                        className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                      />
                    </div>

                    <input
                      placeholder="Colors (comma separated, e.g. Black, Silver)"
                      value={pColors}
                      onChange={(e) => setPColors(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white sm:col-span-2"
                    />

                    <textarea
                      rows={2}
                      placeholder="Description (EN)"
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      className="p-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description (AR)"
                      value={pDescAr}
                      onChange={(e) => setPDescAr(e.target.value)}
                      className="p-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                    />
                  </div>

                  {/* Flags */}
                  <div className="flex flex-wrap items-center gap-5 text-xs text-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pInStock}
                        onChange={(e) => setPInStock(e.target.checked)}
                      />
                      <span>{t.available}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pIsNew}
                        onChange={(e) => setPIsNew(e.target.checked)}
                      />
                      <span>{t.badgeNew}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pIsSale}
                        onChange={(e) => setPIsSale(e.target.checked)}
                      />
                      <span>{t.badgeSale}</span>
                    </label>
                  </div>

                  {/* Images Manager */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-slate-300">
                      Product Images
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/15"
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPImages((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center text-[10px] cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <input
                        placeholder="Paste image URL & click Add"
                        value={pImageInput}
                        onChange={(e) => setPImageInput(e.target.value)}
                        className="flex-1 min-w-[200px] h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!pImageInput.trim()) return;
                          setPImages((prev) => [...prev, pImageInput.trim()]);
                          setPImageInput('');
                        }}
                        className="px-3.5 h-10 rounded-xl bg-[#101E44] border border-white/15 text-xs font-semibold text-white cursor-pointer"
                      >
                        Add URL
                      </button>
                      <label className="px-3.5 h-10 rounded-xl bg-[#1E6BFF]/20 border border-[#1E6BFF]/50 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploading ? t.uploading : t.uploadImage}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleUploadFile(e, 'products', (url) =>
                              setPImages((prev) => [...prev, url])
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setProdFormOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#1E6BFF] text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{t.saveChanges}</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-[#070E22] border border-white/10 p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.images[0] || '/catalog/hero-showcase.png'}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#101E44]"
                      />
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold text-white truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-400 tabular-nums">
                          ${p.price} · {p.inStock ? t.available : t.soldOut}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditProduct(p)}
                        className="w-9 h-9 rounded-xl bg-[#101E44] hover:bg-[#1E6BFF] text-white flex items-center justify-center cursor-pointer"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void removeProduct(p.id).then(() =>
                            notify('Product deleted.')
                          );
                        }}
                        className="w-9 h-9 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white flex items-center justify-center cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-300 tabular-nums">
                  {categories.length} {t.tabCategories}
                </p>
                <button
                  type="button"
                  onClick={openNewCategory}
                  className="px-4 py-2.5 rounded-xl bg-[#1E6BFF] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {catFormOpen && (
                <form
                  onSubmit={handleSaveCategory}
                  className="rounded-2xl bg-[#070E22] border border-[#1E6BFF]/40 p-5 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Category Name (EN)"
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                    />
                    <input
                      placeholder="Category Name (AR)"
                      value={cNameAr}
                      onChange={(e) => setCNameAr(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                    />
                    <input
                      required
                      placeholder="Slug (e.g. smartwatches)"
                      value={cSlug}
                      onChange={(e) => setCSlug(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Order"
                      value={cOrder}
                      onChange={(e) => setCOrder(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <input
                      required
                      placeholder="Category Image URL"
                      value={cImage}
                      onChange={(e) => setCImage(e.target.value)}
                      className="flex-1 min-w-[200px] h-10 px-3 rounded-xl bg-[#101E44] border border-white/15 text-xs text-white"
                    />
                    <label className="px-3.5 h-10 rounded-xl bg-[#1E6BFF]/20 border border-[#1E6BFF]/50 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? t.uploading : t.uploadImage}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleUploadFile(e, 'categories', setCImage)
                        }
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setCatFormOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#1E6BFF] text-xs font-semibold text-white cursor-pointer"
                    >
                      {t.saveChanges}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="rounded-2xl bg-[#070E22] border border-white/10 p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold text-white truncate">
                          {cat.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {cat.nameAr} · #{cat.order}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditCategory(cat)}
                        className="w-9 h-9 rounded-xl bg-[#101E44] hover:bg-[#1E6BFF] text-white flex items-center justify-center cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void removeCategory(cat.id).then(() =>
                            notify('Category deleted.')
                          );
                        }}
                        className="w-9 h-9 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHOP & HERO TAB */}
          {activeTab === 'shop' && (
            <form onSubmit={handleSaveShopInfo} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Hero Title (EN)
                  </label>
                  <input
                    required
                    value={sHeroTitle}
                    onChange={(e) => setSHeroTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Hero Title (AR)
                  </label>
                  <input
                    value={sHeroTitleAr}
                    onChange={(e) => setSHeroTitleAr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Hero Subtitle (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={sHeroSub}
                    onChange={(e) => setSHeroSub(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Hero Subtitle (AR)
                  </label>
                  <textarea
                    rows={2}
                    value={sHeroSubAr}
                    onChange={(e) => setSHeroSubAr(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
              </div>

              {/* Hero Images */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-300">
                  Hero Showcase Images
                </p>
                <div className="flex flex-wrap gap-2">
                  {sHeroImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-16 rounded-xl overflow-hidden border border-white/15"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSHeroImages((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/80 text-white text-[10px] cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    placeholder="Paste hero image URL"
                    value={sHeroImgInput}
                    onChange={(e) => setSHeroImgInput(e.target.value)}
                    className="flex-1 min-w-[200px] h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!sHeroImgInput.trim()) return;
                      setSHeroImages((prev) => [...prev, sHeroImgInput.trim()]);
                      setSHeroImgInput('');
                    }}
                    className="px-3.5 h-10 rounded-xl bg-[#101E44] border border-white/15 text-xs font-semibold text-white cursor-pointer"
                  >
                    Add URL
                  </button>
                  <label className="px-3.5 h-10 rounded-xl bg-[#1E6BFF]/20 border border-[#1E6BFF]/50 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? t.uploading : t.uploadImage}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleUploadFile(e, 'hero', (url) =>
                          setSHeroImages((prev) => [...prev, url])
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    WhatsApp Phone
                  </label>
                  <input
                    required
                    value={sWhatsapp}
                    onChange={(e) => setSWhatsapp(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Secondary Phone
                  </label>
                  <input
                    value={sPhone}
                    onChange={(e) => setSPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Address (EN)
                  </label>
                  <input
                    required
                    value={sAddress}
                    onChange={(e) => setSAddress(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Address (AR)
                  </label>
                  <input
                    value={sAddressAr}
                    onChange={(e) => setSAddressAr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Opening Hours (EN)
                  </label>
                  <input
                    value={sHours}
                    onChange={(e) => setSHours(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Opening Hours (AR)
                  </label>
                  <input
                    value={sHoursAr}
                    onChange={(e) => setSHoursAr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Google Maps Embed URL
                  </label>
                  <input
                    value={sMapsEmbed}
                    onChange={(e) => setSMapsEmbed(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Google Maps Link
                  </label>
                  <input
                    value={sMapsLink}
                    onChange={(e) => setSMapsLink(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Facebook URL
                  </label>
                  <input
                    value={sFacebook}
                    onChange={(e) => setSFacebook(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Instagram URL
                  </label>
                  <input
                    value={sInstagram}
                    onChange={(e) => setSInstagram(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">
                    TikTok URL
                  </label>
                  <input
                    value={sTiktok}
                    onChange={(e) => setSTiktok(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#070E22] border border-white/15 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1E6BFF] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.saveChanges}</span>
                </button>
              </div>
            </form>
          )}

          {/* CHANGE CODE TAB */}
          {activeTab === 'passcode' && (
            <form
              onSubmit={handleChangeCode}
              className="max-w-md space-y-4 rounded-2xl bg-[#070E22] border border-white/10 p-5"
            >
              <h3 className="font-display text-base font-bold text-white">
                {t.changeCodeTitle}
              </h3>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {t.currentCode}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="\d{4}"
                  required
                  value={currentPin}
                  onChange={(e) =>
                    setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                  className="w-full h-11 px-3 rounded-xl bg-[#101E44] border border-white/15 text-white tracking-widest text-center text-lg"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {t.newCode}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="\d{4}"
                  required
                  value={newPin}
                  onChange={(e) =>
                    setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                  className="w-full h-11 px-3 rounded-xl bg-[#101E44] border border-white/15 text-white tracking-widest text-center text-lg"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {t.confirmNewCode}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="\d{4}"
                  required
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                  className="w-full h-11 px-3 rounded-xl bg-[#101E44] border border-white/15 text-white tracking-widest text-center text-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1E6BFF] text-white text-sm font-semibold cursor-pointer"
              >
                {t.updateCodeBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
