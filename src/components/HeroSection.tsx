import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, ShopSettings } from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';
import { formatWhatsappNumber } from '../lib/whatsapp';

interface HeroSectionProps {
  lang: Language;
  settings: ShopSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang, settings }) => {
  const t = TRANSLATIONS[lang];
  const images =
    settings.heroImages && settings.heroImages.length > 0
      ? settings.heroImages
      : ['/catalog/hero-showcase.png'];

  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setActiveIdx(0);
    setImgError(false);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
      setImgError(false);
    }, 5500);
    return () => clearInterval(timer);
  }, [images.length]);

  const title =
    lang === 'ar' && settings.heroTitleAr
      ? settings.heroTitleAr
      : settings.heroTitle || 'Your Tech Partner';
  const subtitle =
    lang === 'ar' && settings.heroSubtitleAr
      ? settings.heroSubtitleAr
      : settings.heroSubtitle;

  const waUrl = `https://wa.me/${formatWhatsappNumber(settings.whatsapp)}`;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,rgba(30,107,255,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(242,182,50,0.08),transparent_45%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Copy & Brand Crest */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="/chez-moni-logo.png"
                alt="Chez Moni Crest"
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-[#F2B632]/60 shadow-[0_0_24px_rgba(30,107,255,0.45)] shrink-0"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F2B632]">
                  Chez Moni · Zahle
                </p>
                <p className="text-sm text-slate-300">
                  {lang === 'ar'
                    ? 'إكسسوارات الهواتف والإلكترونيات'
                    : 'Mobile Accessories & Electronics'}
                </p>
              </div>
            </div>

            <h1
              className="font-display font-bold text-white leading-[1.08] max-w-xl"
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)',
                textWrap: 'balance',
              }}
            >
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#catalog"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1E6BFF] hover:bg-[#1557D6] text-white font-semibold text-sm sm:text-base tech-glow-btn whitespace-nowrap"
              >
                <span>{t.shopNow}</span>
                <ArrowIcon className="w-4 h-4" />
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#101E44] hover:bg-[#162859] border border-white/15 hover:border-[#F2B632]/50 text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap"
              >
                <span>{t.orderWhatsapp}</span>
              </a>
            </div>

            {/* Trust Strip (clean unboxed typographic separators) */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm font-medium text-slate-200">
              <span className="text-[#F2B632] font-semibold">
                {t.trustQuality}
              </span>
              <span aria-hidden="true" className="text-slate-500">
                •
              </span>
              <span>{t.trustPrices}</span>
              <span aria-hidden="true" className="text-slate-500">
                •
              </span>
              <span>{t.trustDelivery}</span>
            </div>
          </div>

          {/* Right Replaceable Product Showcase Pedestal */}
          <div className="lg:col-span-6 flex items-stretch">
            <div className="relative w-full min-h-[300px] sm:min-h-[380px] rounded-2xl bg-[#070E22] border border-[#1E6BFF]/30 overflow-hidden tech-glow-card flex flex-col justify-between">
              <div className="relative flex-1 w-full h-full min-h-[280px] sm:min-h-[360px] flex items-center justify-center bg-gradient-to-b from-[#101E44]/50 to-[#070E22]">
                {!imgError ? (
                  <img
                    src={images[activeIdx]}
                    alt="Chez Moni Featured Electronics"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full max-h-[440px] object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <img
                      src="/chez-moni-logo.png"
                      alt="Chez Moni"
                      className="w-28 h-28 rounded-full mx-auto object-cover"
                    />
                    <p className="text-sm text-slate-300">{title}</p>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveIdx(
                          (prev) => (prev - 1 + images.length) % images.length
                        );
                        setImgError(false);
                      }}
                      className="absolute start-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#070E22]/80 hover:bg-[#1E6BFF] border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Previous showcase image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveIdx((prev) => (prev + 1) % images.length);
                        setImgError(false);
                      }}
                      className="absolute end-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#070E22]/80 hover:bg-[#1E6BFF] border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Next showcase image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="px-4 py-3 bg-[#070E22]/95 border-t border-white/10 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-300 font-medium">
                    {lang === 'ar'
                      ? 'متوفر الآن في زحلة وكافة المناطق'
                      : 'In Stock · Zahle Storefront'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveIdx(idx);
                          setImgError(false);
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === activeIdx
                            ? 'w-6 bg-[#1E6BFF]'
                            : 'w-2 bg-white/25 hover:bg-white/50'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
