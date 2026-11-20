import React from 'react';
import { Heart, ShoppingBag, Globe } from 'lucide-react';
import { Language } from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  cartCount: number;
  wishlistCount: number;
  wishlistActive: boolean;
  onToggleWishlistFilter: () => void;
  onOpenCart: () => void;
  onLogoTap: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  cartCount,
  wishlistCount,
  wishlistActive,
  onToggleWishlistFilter,
  onOpenCart,
  onLogoTap,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#070E22]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Mark (5-tap triggers hidden manager pad) */}
        <button
          type="button"
          onClick={onLogoTap}
          className="flex items-center gap-3 text-start shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BFF] rounded-xl py-1"
          aria-label="Chez Moni"
        >
          <img
            src="/chez-moni-logo.png"
            alt="Chez Moni Logo"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover ring-1 ring-[#1E6BFF]/50 shadow-[0_0_16px_rgba(30,107,255,0.35)] shrink-0"
          />
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            {t.brandName}
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#categories"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1E6BFF]"
          >
            {t.navCategories}
          </a>
          <a
            href="#catalog"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1E6BFF]"
          >
            {t.navCatalog}
          </a>
          <a
            href="#delivery"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1E6BFF]"
          >
            {t.navDelivery}
          </a>
          <a
            href="#contact"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1E6BFF]"
          >
            {t.navContact}
          </a>
        </nav>

        {/* Zone 3: Compact Store Actions (Language, Wishlist, Cart) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleLang}
            className="h-10 px-3 rounded-xl bg-[#101E44] border border-white/10 hover:border-[#1E6BFF]/50 text-xs font-semibold text-slate-100 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#1E6BFF]" />
            <span>{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleWishlistFilter}
            className={`relative h-10 w-10 rounded-xl border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
              wishlistActive
                ? 'bg-[#F2B632]/15 border-[#F2B632] text-[#F2B632]'
                : 'bg-[#101E44] border-white/10 hover:border-[#1E6BFF]/50 text-slate-200'
            }`}
            aria-label={t.savedOnly}
            title={t.savedOnly}
          >
            <Heart
              className="w-4 h-4"
              fill={wishlistActive ? 'currentColor' : 'none'}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F2B632] text-[#070E22] text-[10px] font-bold flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative h-10 px-3.5 rounded-xl bg-[#1E6BFF] hover:bg-[#1557D6] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 tech-glow-btn whitespace-nowrap shrink-0 cursor-pointer"
            aria-label={t.cartTitle}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="tabular-nums font-bold">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
