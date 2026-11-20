import { CartItem, Language, Product } from '../types/store';

export function formatWhatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('961')) return digits;
  if (digits.startsWith('0')) return `961${digits.slice(1)}`;
  return `961${digits}`;
}

export function buildSingleProductWhatsappUrl(
  whatsappPhone: string,
  product: Product,
  color: string,
  quantity: number,
  lang: Language
): string {
  const number = formatWhatsappNumber(whatsappPhone || '81922013');
  const title = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
  const total = (product.price * quantity).toFixed(2).replace(/\.00$/, '');

  const lines =
    lang === 'ar'
      ? [
          `مرحباً Chez Moni، أود طلب المنتج التالي:`,
          `• المنتج: ${title}`,
          color ? `• اللون: ${color}` : null,
          `• الكمية: ${quantity}`,
          `• السعر: $${product.price} (المجموع: $${total})`,
        ]
      : [
          `Hello Chez Moni! I would like to order:`,
          `• Product: ${title}`,
          color ? `• Color: ${color}` : null,
          `• Quantity: ${quantity}`,
          `• Price: $${product.price} (Total: $${total})`,
        ];

  const message = lines.filter(Boolean).join('\n');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildCartWhatsappUrl(
  whatsappPhone: string,
  items: CartItem[],
  region: 'zahle' | 'lebanon',
  note: string,
  lang: Language
): string {
  const number = formatWhatsappNumber(whatsappPhone || '81922013');
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formattedSubtotal = subtotal.toFixed(2).replace(/\.00$/, '');

  const regionLabel =
    lang === 'ar'
      ? region === 'zahle'
        ? 'زحلة (Toters / Lyxa)'
        : 'خارج زحلة (كل لبنان)'
      : region === 'zahle'
        ? 'Zahle (Toters / Lyxa)'
        : 'Outside Zahle (All Lebanon)';

  const itemLines = items.map((item, idx) => {
    const title = lang === 'ar' && item.nameAr ? item.nameAr : item.name;
    const lineTotal = (item.price * item.quantity).toFixed(2).replace(/\.00$/, '');
    const colorText = item.color ? ` (${item.color})` : '';
    return `${idx + 1}. ${title}${colorText} × ${item.quantity} — $${lineTotal}`;
  });

  const header =
    lang === 'ar'
      ? 'مرحباً Chez Moni! أود تأكيد الطلب التالي:'
      : 'Hello Chez Moni! I would like to place the following order:';

  const footer =
    lang === 'ar'
      ? [
          `المجموع الكلي: $${formattedSubtotal}`,
          `التوصيل: ${regionLabel}`,
          note.trim() ? `ملاحظة / العنوان: ${note.trim()}` : null,
        ]
      : [
          `Total: $${formattedSubtotal}`,
          `Delivery: ${regionLabel}`,
          note.trim() ? `Address / Note: ${note.trim()}` : null,
        ];

  const message = [header, '', ...itemLines, '', ...footer.filter(Boolean)].join('\n');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
