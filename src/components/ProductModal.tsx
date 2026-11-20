import React, { useEffect, useState } from 'react';
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  X,
  MessageCircle,
  Check,
} from 'lucide-react';
import { Language, Product } from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';
import { buildSingleProductWhatsappUrl } from '../lib/whatsapp';

interface ProductModalProps {
  product: Product | null;
  categoryLabel: string;
  lang: Language;
  whatsappPhone: string;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, color: string, quantity: number) => void;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categoryLabel,
  lang,
  whatsappPhone,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onClose,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImageIdx(0);
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
      setAddedFeedback(false);
    }
  }, [product]);

  if (!product) return null;

  const title =
    lang === 'ar' && product.nameAr ? product.nameAr : product.name;
  const description =
    lang === 'ar' && product.descriptionAr
      ? product.descriptionAr
      : product.description;

  const images =
    product.images.length > 0 ? product.images : ['/catalog/hero-showcase.png'];
  const activeImage = images[selectedImageIdx] || images[0];

  const whatsappUrl = buildSingleProductWhatsappUrl(
    whatsappPhone,
    product,
    selectedColor,
    quantity,
    lang
  );

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, selectedColor, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050A18]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-[#0E1A3B] border border-white/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 px-5 py-4 bg-[#0E1A3B]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                product.inStock
                  ? 'text-emerald-400 font-semibold'
                  : 'text-rose-400 font-semibold'
              }
            >
              {product.inStock ? t.available : t.soldOut}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-[#F2B632]/15 border-[#F2B632] text-[#F2B632]'
                  : 'bg-[#070E22] border-white/15 text-slate-200 hover:border-[#F2B632]'
              }`}
              aria-label={t.savedOnly}
            >
              <Heart
                className="w-4 h-4"
                fill={isWishlisted ? 'currentColor' : 'none'}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[#070E22] border border-white/15 text-slate-200 hover:text-white flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Gallery */}
          <div className="md:col-span-6 space-y-3">
            <div className="aspect-[4/3] w-full rounded-2xl bg-[#070E22] border border-white/10 overflow-hidden">
              <img
                src={activeImage}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-14 rounded-xl overflow-hidden border shrink-0 cursor-pointer transition-all ${
                      idx === selectedImageIdx
                        ? 'border-[#1E6BFF] ring-2 ring-[#1E6BFF]/40'
                        : 'border-white/15 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${title} ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchase Module */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.isNew && (
                  <span className="px-2.5 py-0.5 rounded-md bg-[#1E6BFF] text-white text-xs font-bold">
                    {t.badgeNew}
                  </span>
                )}
                {product.isSale && (
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F2B632] text-[#070E22] text-xs font-bold">
                    {t.badgeSale}
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold text-white leading-tight">
                {title}
              </h2>

              <div className="flex items-baseline gap-3 tabular-nums">
                <span className="font-display text-3xl font-bold text-white">
                  ${product.price}
                </span>
                {product.oldPrice != null &&
                  product.oldPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      ${product.oldPrice}
                    </span>
                  )}
              </div>

              {description && (
                <p className="text-sm text-slate-300 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="pt-2 space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {t.colorLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          selectedColor === color
                            ? 'bg-[#1E6BFF] border-[#1E6BFF] text-white'
                            : 'bg-[#070E22] border-white/15 text-slate-200 hover:border-[#1E6BFF]/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t.quantityLabel}
                </label>
                <div className="inline-flex items-center rounded-xl bg-[#070E22] border border-white/15 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-200 hover:bg-white/10 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-200 hover:bg-white/10 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={product.inStock ? whatsappUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!product.inStock) e.preventDefault();
                }}
                className={`w-full py-3.5 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors ${
                  product.inStock
                    ? 'bg-[#25D366] hover:bg-[#1EBE5D] text-[#051B0D] shadow-lg'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.orderOnWhatsappBtn}</span>
              </a>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAdd}
                className={`w-full py-3.5 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  !product.inStock
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                    : addedFeedback
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#1E6BFF] hover:bg-[#1557D6] text-white tech-glow-btn'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.addedToCart}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToCart}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
