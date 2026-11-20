import React from 'react';
import { Search, Heart, SlidersHorizontal } from 'lucide-react';
import { Category, Language, Product } from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';
import { ProductCard } from './ProductCard';

export type SortOption = 'featured' | 'price_asc' | 'price_desc';

interface ProductGridProps {
  lang: Language;
  products: Product[];
  categories: Category[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  wishlistOnly: boolean;
  onToggleWishlistOnly: () => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenModal: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  lang,
  products,
  categories,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  wishlistOnly,
  onToggleWishlistOnly,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onOpenModal,
  onResetFilters,
}) => {
  const t = TRANSLATIONS[lang];

  const getCategoryLabel = (slug: string) => {
    const match = categories.find((c) => c.slug === slug);
    if (!match) return slug;
    return lang === 'ar' && match.nameAr ? match.nameAr : match.name;
  };

  return (
    <section
      id="catalog"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-white/10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {t.catalogTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1">
            {t.catalogSubtitle}
          </p>
        </div>

        {/* Search + Sort + Wishlist */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full h-11 ps-10 pe-4 rounded-xl bg-[#070E22] border border-white/15 focus:border-[#1E6BFF] text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="relative shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-11 ps-9 pe-8 rounded-xl bg-[#070E22] border border-white/15 focus:border-[#1E6BFF] text-sm text-white focus:outline-none cursor-pointer"
              aria-label="Sort products"
            >
              <option value="featured">{t.sortFeatured}</option>
              <option value="price_asc">{t.sortPriceAsc}</option>
              <option value="price_desc">{t.sortPriceDesc}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onToggleWishlistOnly}
            className={`h-11 px-4 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              wishlistOnly
                ? 'bg-[#F2B632] border-[#F2B632] text-[#070E22]'
                : 'bg-[#070E22] border-white/15 text-slate-200 hover:border-[#F2B632]/50'
            }`}
          >
            <Heart
              className="w-4 h-4"
              fill={wishlistOnly ? 'currentColor' : 'none'}
            />
            <span>{t.savedOnly}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Segmented Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-7">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#1E6BFF] text-white tech-glow-btn'
              : 'bg-[#101E44] text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          {t.allCategories}
        </button>

        {categories.map((cat) => {
          const active = selectedCategory === cat.slug;
          const label = lang === 'ar' && cat.nameAr ? cat.nameAr : cat.name;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? 'bg-[#1E6BFF] text-white tech-glow-btn'
                  : 'bg-[#101E44] text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      {products.length === 0 ? (
        <div className="rounded-2xl bg-[#101E44] border border-white/10 p-10 text-center space-y-4">
          <p className="text-slate-300 text-base">{t.noProducts}</p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#1E6BFF] hover:bg-[#1557D6] text-white text-sm font-semibold cursor-pointer"
          >
            {t.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryLabel={getCategoryLabel(product.category)}
              lang={lang}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      )}
    </section>
  );
};
