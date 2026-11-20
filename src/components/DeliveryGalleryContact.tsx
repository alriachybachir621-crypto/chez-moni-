import React from 'react';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { GALLERY_POSTS } from '../data/seedData';
import { Language, ShopSettings } from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';
import { formatWhatsappNumber } from '../lib/whatsapp';

interface DeliveryGalleryContactProps {
  lang: Language;
  settings: ShopSettings;
  onLogoTap: () => void;
}

export const DeliveryGalleryContact: React.FC<DeliveryGalleryContactProps> = ({
  lang,
  settings,
  onLogoTap,
}) => {
  const t = TRANSLATIONS[lang];
  const waHref = `https://wa.me/${formatWhatsappNumber(settings.whatsapp)}`;
  const telHref = `tel:+961${settings.secondaryPhone.replace(/\D/g, '')}`;
  const address =
    lang === 'ar' && settings.addressAr ? settings.addressAr : settings.address;
  const hours =
    lang === 'ar' && settings.hoursAr ? settings.hoursAr : settings.hours;

  return (
    <>
      {/* Delivery Section */}
      <section
        id="delivery"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-white/10"
      >
        <div className="rounded-3xl bg-gradient-to-br from-[#101E44] to-[#070E22] border border-[#1E6BFF]/30 p-6 sm:p-10 tech-glow-card">
          <div className="max-w-3xl space-y-3 mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F2B632]">
              {t.deliveryBadge}
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug"
              style={{ textWrap: 'balance' }}
            >
              {t.deliveryHeadline}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t.deliverySubtext}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-[#0B1530]/90 border border-white/10 p-5 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1E6BFF]/15 text-[#1E6BFF] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-semibold text-white">
                {t.deliveryZahleTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.deliveryZahleDesc}
              </p>
            </div>

            <div className="rounded-2xl bg-[#0B1530]/90 border border-white/10 p-5 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F2B632]/15 text-[#F2B632] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-semibold text-white">
                {t.deliveryLebanonTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.deliveryLebanonDesc}
              </p>
            </div>

            <div className="rounded-2xl bg-[#0B1530]/90 border border-white/10 p-5 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-semibold text-white">
                {t.deliveryCodTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.deliveryCodDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery & Social Channels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {t.galleryTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1">
              {t.gallerySubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={settings.facebookUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>{t.followFacebook}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={settings.instagramUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#101E44] hover:bg-[#162859] border border-white/15 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>{t.followInstagram}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={settings.tiktokUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#101E44] hover:bg-[#162859] border border-white/15 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>{t.followTiktok}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {GALLERY_POSTS.map((post) => {
            const caption = lang === 'ar' ? post.captionAr : post.captionEn;
            return (
              <a
                key={post.id}
                href={settings.facebookUrl || waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden bg-[#070E22] border border-white/10 tech-glow-card"
              >
                <img
                  src={post.image}
                  alt={caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070E22]/90 via-[#070E22]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-xs font-medium text-white leading-snug line-clamp-2">
                    {caption}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Contact & Google Maps Embed */}
      <section
        id="contact"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-white/10"
      >
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {t.contactTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#101E44] border border-white/10 hover:border-[#25D366]/60 p-5 flex items-center gap-4 transition-colors tech-glow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{t.whatsappLabel}</p>
                <p
                  dir="ltr"
                  className="font-display text-lg font-bold text-white tabular-nums mt-0.5"
                >
                  {settings.whatsapp}
                </p>
              </div>
            </a>

            <a
              href={telHref}
              className="rounded-2xl bg-[#101E44] border border-white/10 hover:border-[#1E6BFF]/60 p-5 flex items-center gap-4 transition-colors tech-glow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1E6BFF]/15 text-[#1E6BFF] flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{t.secondPhoneLabel}</p>
                <p
                  dir="ltr"
                  className="font-display text-lg font-bold text-white tabular-nums mt-0.5"
                >
                  {settings.secondaryPhone}
                </p>
              </div>
            </a>

            <div className="rounded-2xl bg-[#101E44] border border-white/10 p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F2B632]/15 text-[#F2B632] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">{t.addressLabel}</p>
                <p className="font-medium text-white text-sm sm:text-base">
                  {address}
                </p>
                {settings.mapsLink && (
                  <a
                    href={settings.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E6BFF] hover:text-[#F2B632] transition-colors pt-1"
                  >
                    <span>{t.openInMaps}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-[#101E44] border border-white/10 p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-slate-200 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{t.hoursLabel}</p>
                <p className="font-medium text-white text-sm sm:text-base mt-0.5">
                  {hours}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl overflow-hidden bg-[#070E22] border border-white/10 min-h-[300px] lg:min-h-full">
            <iframe
              title="Chez Moni Zahle Location"
              src={
                settings.mapsEmbedUrl ||
                'https://www.google.com/maps?q=Zahle,+Lebanon&output=embed'
              }
              className="w-full h-full min-h-[320px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070E22] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            type="button"
            onClick={onLogoTap}
            className="flex items-center gap-3.5 text-start cursor-pointer focus:outline-none rounded-xl"
            aria-label="Chez Moni"
          >
            <img
              src="/chez-moni-logo.png"
              alt="Chez Moni"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover ring-1 ring-[#1E6BFF]/50"
            />
            <div>
              <p className="font-display font-bold text-white text-base">
                {t.brandName}
              </p>
              <p className="text-xs text-slate-400">{t.footerTagline}</p>
            </div>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
            <a href="#categories" className="hover:text-white transition-colors">
              {t.navCategories}
            </a>
            <a href="#catalog" className="hover:text-white transition-colors">
              {t.navCatalog}
            </a>
            <a href="#delivery" className="hover:text-white transition-colors">
              {t.navDelivery}
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              {t.navContact}
            </a>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {t.footerRights}
          </p>
        </div>
      </footer>
    </>
  );
};
