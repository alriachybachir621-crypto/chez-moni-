import React, { useState } from 'react';
import { Category, Language } from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';

interface CategoriesSectionProps {
  lang: Language;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

const CategoryImage: React.FC<{ src: string; alt: string }> = ({
  src,
  alt,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#101E44] to-[#070E22] flex items-center justify-center p-4">
        <span className="font-display text-sm font-semibold text-slate-300 text-center">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  );
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  lang,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const t = TRANSLATIONS[lang];

  const handleChoose = (slug: string) => {
    onSelectCategory(slug);
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="categories"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {t.categoriesTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1">
            {t.categoriesSubtitle}
          </p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="text-sm font-semibold text-[#1E6BFF] hover:text-[#F2B632] transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            {t.allCategories}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const label = lang === 'ar' && cat.nameAr ? cat.nameAr : cat.name;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleChoose(cat.slug)}
              className={`group text-start rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col bg-[#101E44] tech-glow-card ${
                isSelected
                  ? 'border-[#1E6BFF] ring-2 ring-[#1E6BFF]/40'
                  : 'border-white/10'
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#070E22]">
                <CategoryImage src={cat.image} alt={label} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070E22]/75 via-transparent to-transparent" />
              </div>
              <div className="p-3 flex-1 flex items-center justify-between gap-2">
                <span className="font-display text-xs sm:text-sm font-semibold text-white leading-snug">
                  {label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
