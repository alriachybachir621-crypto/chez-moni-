import React, { useState } from 'react';
import { Minus, Plus, Trash2, X, MessageCircle, ShoppingBag } from 'lucide-react';
import { CartItem, Language } from '../types/store';
import { TRANSLATIONS } from '../i18n/translations';
import { buildCartWhatsappUrl } from '../lib/whatsapp';

interface CartDrawerProps {
  open: boolean;
  lang: Language;
  items: CartItem[];
  whatsappPhone: string;
  onClose: () => void;
  onUpdateQty: (productId: string, color: string, delta: number) => void;
  onRemoveItem: (productId: string, color: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  lang,
  items,
  whatsappPhone,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const t = TRANSLATIONS[lang];
  const [region, setRegion] = useState<'zahle' | 'lebanon'>('zahle');
  const [note, setNote] = useState('');

  if (!open) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const formattedSubtotal = subtotal.toFixed(2).replace(/\.00$/, '');
  const whatsappUrl = buildCartWhatsappUrl(
    whatsappPhone,
    items,
    region,
    note,
    lang
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050A18]/75 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md h-full bg-[#0E1A3B] border-s border-white/15 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1E6BFF]" />
            <h2 className="font-display text-lg font-bold text-white">
              {t.cartTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#070E22] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#070E22] border border-white/10 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-display text-base font-semibold text-white">
                {t.cartEmpty}
              </p>
              <p className="text-sm text-slate-400 max-w-xs">{t.cartEmptySub}</p>
            </div>
          ) : (
            items.map((item) => {
              const title =
                lang === 'ar' && item.nameAr ? item.nameAr : item.name;
              const lineTotal = (item.price * item.quantity)
                .toFixed(2)
                .replace(/\.00$/, '');
              return (
                <div
                  key={`${item.productId}::${item.color}`}
                  className="rounded-2xl bg-[#070E22] border border-white/10 p-3.5 flex gap-3.5"
                >
                  <img
                    src={item.image}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#101E44]"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-semibold text-white truncate">
                          {title}
                        </h3>
                        {item.color && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.color}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.productId, item.color)}
                        className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="inline-flex items-center rounded-lg bg-[#101E44] border border-white/10 p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(item.productId, item.color, -1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(item.productId, item.color, 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-display text-sm font-bold text-white tabular-nums">
                        ${lineTotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 bg-[#070E22] border-t border-white/10 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">
                {t.cartRegionLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegion('zahle')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    region === 'zahle'
                      ? 'bg-[#1E6BFF] border-[#1E6BFF] text-white'
                      : 'bg-[#101E44] border-white/10 text-slate-300'
                  }`}
                >
                  {t.cartRegionZahle}
                </button>
                <button
                  type="button"
                  onClick={() => setRegion('lebanon')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    region === 'lebanon'
                      ? 'bg-[#1E6BFF] border-[#1E6BFF] text-white'
                      : 'bg-[#101E44] border-white/10 text-slate-300'
                  }`}
                >
                  {t.cartRegionLebanon}
                </button>
              </div>
            </div>

            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.cartNotePlaceholder}
              className="w-full h-10 px-3.5 rounded-xl bg-[#101E44] border border-white/15 focus:border-[#1E6BFF] text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />

            <div className="flex items-center justify-between text-base font-bold text-white pt-1">
              <span>{t.cartSubtotal}</span>
              <span className="font-display text-xl tabular-nums text-[#F2B632]">
                ${formattedSubtotal}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClearCart}
                className="px-4 py-3.5 rounded-xl bg-[#101E44] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer whitespace-nowrap"
              >
                {t.clearCart}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-[#051B0D] text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.sendOrderWhatsapp}</span>
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
