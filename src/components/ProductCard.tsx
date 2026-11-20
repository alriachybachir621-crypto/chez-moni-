import React, { useState } from 'react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Language, Product } from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';

interface ProductCardProps {
  product: Product;
  categoryLabel: string;
  lang: Language;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenModal: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryLabel,
  lang,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenModal,
}) => {
  const t = TRANSLATIONS[lang];
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const title =
    lang === 'ar' && product.nameAr ? product.nameAr : product.name;
  const primaryImage = product.images[0] || '/catalog/hero-showcase.png';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => onOpenModal(product)}
      className="group rounded-2xl bg-[#101E44] border border-white/10 overflow-hidden tech-glow-card flex flex-col cursor-pointer"
    >
      {/* 4:3 Image Area */}
      <div className="relative aspect-[4/3] w-full bg-[#070E22] overflow-hidden">
        {!imgError ? (
          <img
            src={primaryImage}
            alt={title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-[#101E44] to-[#070E22]">
            <span className="font-display text-sm font-semibold text-slate-300 text-center">
              {title}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between gap-2">
          {/* At most one subtle text status tag */}
          <div>
            {product.isSale ? (
              <span className="inline-block px-2.5 py-1 rounded-lg bg-[#F2B632] text-[#070E22] text-[11px] font-bold tracking-wide">
                {t.badgeSale}
              </span>
            ) : product.isNew ? (
              <span className="inline-block px-2.5 py-1 rounded-lg bg-[#1E6BFF] text-white text-[11px] font-bold tracking-wide">
                {t.badgeNew}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-[#F2B632]/20 border-[#F2B632] text-[#F2B632]'
                : 'bg-[#070E22]/75 border-white/15 text-white hover:border-[#F2B632]/60'
            }`}
            aria-label={isWishlisted ? t.wishlistRemoved : t.wishlistAdded}
          >
            <Heart
              className="w-4 h-4"
              fill={isWishlisted ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
            <span className="truncate">{categoryLabel}</span>
            <span
              className={`font-semibold whitespace-nowrap ${
                product.inStock ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {product.inStock ? t.available : t.soldOut}
            </span>
          </div>

          <h3 className="font-display text-base sm:text-lg font-semibold text-white leading-snug line-clamp-2">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="font-display text-lg font-bold text-white">
              ${product.price}
            </span>
            {product.oldPrice != null && product.oldPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ${product.oldPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleQuickAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              !product.inStock
                ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                : justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1E6BFF] hover:bg-[#1557D6] text-white tech-glow-btn'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.inStock ? t.addToCart : t.soldOut}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
