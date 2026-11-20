import { Language } from '../types/store';

export const TRANSLATIONS: Record<
  Language,
  {
    brandName: string;
    navCategories: string;
    navCatalog: string;
    navDelivery: string;
    navContact: string;
    shopNow: string;
    orderWhatsapp: string;
    trustQuality: string;
    trustPrices: string;
    trustDelivery: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
    allCategories: string;
    catalogTitle: string;
    catalogSubtitle: string;
    searchPlaceholder: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    savedOnly: string;
    available: string;
    soldOut: string;
    badgeNew: string;
    badgeSale: string;
    addToCart: string;
    addedToCart: string;
    viewDetails: string;
    noProducts: string;
    resetFilters: string;
    colorLabel: string;
    quantityLabel: string;
    orderOnWhatsappBtn: string;
    deliveryBadge: string;
    deliveryHeadline: string;
    deliverySubtext: string;
    deliveryZahleTitle: string;
    deliveryZahleDesc: string;
    deliveryLebanonTitle: string;
    deliveryLebanonDesc: string;
    deliveryCodTitle: string;
    deliveryCodDesc: string;
    galleryTitle: string;
    gallerySubtitle: string;
    followFacebook: string;
    followInstagram: string;
    followTiktok: string;
    contactTitle: string;
    contactSubtitle: string;
    whatsappLabel: string;
    secondPhoneLabel: string;
    addressLabel: string;
    hoursLabel: string;
    openInMaps: string;
    cartTitle: string;
    cartEmpty: string;
    cartEmptySub: string;
    cartSubtotal: string;
    cartRegionLabel: string;
    cartRegionZahle: string;
    cartRegionLebanon: string;
    cartNotePlaceholder: string;
    sendOrderWhatsapp: string;
    clearCart: string;
    wishlistAdded: string;
    wishlistRemoved: string;
    footerTagline: string;
    footerRights: string;
    pinSetupTitle: string;
    pinSetupSubtitle: string;
    pinConfirmSubtitle: string;
    pinEnterTitle: string;
    pinEnterSubtitle: string;
    pinWrong: string;
    pinMismatch: string;
    pinLocked: string;
    pinAttemptsLeft: string;
    pinProviderHelp: string;
    clearKey: string;
    backKey: string;
    panelTitle: string;
    tabProducts: string;
    tabCategories: string;
    tabShopInfo: string;
    tabPasscode: string;
    logout: string;
    addProduct: string;
    editProduct: string;
    saveChanges: string;
    cancel: string;
    delete: string;
    uploadImage: string;
    uploading: string;
    changeCodeTitle: string;
    currentCode: string;
    newCode: string;
    confirmNewCode: string;
    updateCodeBtn: string;
    codeUpdated: string;
  }
> = {
  en: {
    brandName: 'Chez Moni',
    navCategories: 'Categories',
    navCatalog: 'Catalog',
    navDelivery: 'Delivery',
    navContact: 'Contact',
    shopNow: 'Shop Now',
    orderWhatsapp: 'WhatsApp Order',
    trustQuality: 'Great Quality',
    trustPrices: 'Best Prices',
    trustDelivery: 'Delivery all over Lebanon',
    categoriesTitle: 'Shop by Category',
    categoriesSubtitle: 'Curated mobile essentials, smart wearables & home security',
    allCategories: 'All Products',
    catalogTitle: 'Featured Tech Catalog',
    catalogSubtitle: 'Transparent USD pricing with direct WhatsApp checkout',
    searchPlaceholder: 'Search watches, earbuds, chargers...',
    sortFeatured: 'Featured',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    savedOnly: 'Wishlist',
    available: 'Available',
    soldOut: 'Sold out',
    badgeNew: 'New',
    badgeSale: 'Sale',
    addToCart: 'Add to Cart',
    addedToCart: 'Added',
    viewDetails: 'Details',
    noProducts: 'No products match your search or selected category.',
    resetFilters: 'Show All Products',
    colorLabel: 'Color',
    quantityLabel: 'Quantity',
    orderOnWhatsappBtn: 'Order on WhatsApp',
    deliveryBadge: 'Fast Dispatch',
    deliveryHeadline: 'Delivery in Zahle (Toters, Lyxa) and delivery to all Lebanon',
    deliverySubtext:
      'Order directly via WhatsApp or request rapid local courier drop-off anywhere in Zahle and across every Lebanese governorate.',
    deliveryZahleTitle: 'Zahle Same-Day Express',
    deliveryZahleDesc: 'Instant dispatch via Toters & Lyxa straight to your door in Zahle.',
    deliveryLebanonTitle: 'All Lebanon Courier',
    deliveryLebanonDesc: 'Reliable 24–48 hour shipping to Beirut, Mount Lebanon, North, South & Bekaa.',
    deliveryCodTitle: 'Cash on Delivery',
    deliveryCodDesc: 'Pay securely upon receiving and inspecting your order.',
    galleryTitle: 'Chez Moni Zahle Highlights',
    gallerySubtitle: 'Latest arrivals, daily deals & tech showcases from our store',
    followFacebook: 'Facebook · Chez Moni Zahle',
    followInstagram: 'Instagram',
    followTiktok: 'TikTok',
    contactTitle: 'Visit & Contact Us',
    contactSubtitle: 'Direct support in Zahle — message us on WhatsApp or visit the shop',
    whatsappLabel: 'WhatsApp Orders',
    secondPhoneLabel: 'Store Phone',
    addressLabel: 'Address',
    hoursLabel: 'Opening Hours',
    openInMaps: 'Open in Google Maps',
    cartTitle: 'Your Order Bag',
    cartEmpty: 'Your cart is empty',
    cartEmptySub: 'Browse smartwatches, earbuds, and chargers to build your order.',
    cartSubtotal: 'Subtotal',
    cartRegionLabel: 'Delivery Area',
    cartRegionZahle: 'Zahle (Toters / Lyxa)',
    cartRegionLebanon: 'Outside Zahle (All Lebanon)',
    cartNotePlaceholder: 'Delivery address or note (optional)',
    sendOrderWhatsapp: 'Send Order on WhatsApp',
    clearCart: 'Clear Bag',
    wishlistAdded: 'Saved to wishlist',
    wishlistRemoved: 'Removed from wishlist',
    footerTagline: 'Your Tech Partner — Zahle, Lebanon',
    footerRights: 'Chez Moni. All rights reserved.',
    pinSetupTitle: 'Set your 4-digit code',
    pinSetupSubtitle: 'Create a 4-digit security code for store management.',
    pinConfirmSubtitle: 'Re-enter your 4-digit code to confirm.',
    pinEnterTitle: 'Enter 4-digit code',
    pinEnterSubtitle: 'Unlock store catalog & settings management.',
    pinWrong: 'Wrong code',
    pinMismatch: 'Codes did not match. Try again.',
    pinLocked: 'Too many attempts. Try again in',
    pinAttemptsLeft: 'attempts remaining',
    pinProviderHelp:
      'Enable Email/Password authentication in Firebase Console → Authentication → Sign-in method to save this code.',
    clearKey: 'Clear',
    backKey: 'Del',
    panelTitle: 'Store Manager',
    tabProducts: 'Products',
    tabCategories: 'Categories',
    tabShopInfo: 'Hero & Shop Info',
    tabPasscode: 'Change code',
    logout: 'Log out',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    uploadImage: 'Upload Image',
    uploading: 'Uploading...',
    changeCodeTitle: 'Change 4-digit code',
    currentCode: 'Current 4-digit code',
    newCode: 'New 4-digit code',
    confirmNewCode: 'Confirm new 4-digit code',
    updateCodeBtn: 'Update code',
    codeUpdated: 'Security code updated successfully.',
  },
  ar: {
    brandName: 'شيه موني',
    navCategories: 'الأقسام',
    navCatalog: 'المنتجات',
    navDelivery: 'التوصيل',
    navContact: 'تواصل معنا',
    shopNow: 'تسوّق الآن',
    orderWhatsapp: 'اطلب عبر واتساب',
    trustQuality: 'جودة عالية',
    trustPrices: 'أفضل الأسعار',
    trustDelivery: 'توصيل لكل لبنان',
    categoriesTitle: 'تسوّق حسب القسم',
    categoriesSubtitle: 'إكسسوارات الهواتف، الساعات الذكية، السماعات وكاميرات المراقبة',
    allCategories: 'كل المنتجات',
    catalogTitle: 'المنتجات المتوفرة',
    catalogSubtitle: 'أسعار واضحة بالدولار الأمريكي مع طلب مباشر عبر واتساب',
    searchPlaceholder: 'ابحث عن ساعة، سماعة، شاحن...',
    sortFeatured: 'الأكثر تميزاً',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    savedOnly: 'المفضلة',
    available: 'متوفر',
    soldOut: 'نفذت الكمية',
    badgeNew: 'جديد',
    badgeSale: 'تخفيض',
    addToCart: 'أضف إلى السلة',
    addedToCart: 'تمت الإضافة',
    viewDetails: 'التفاصيل',
    noProducts: 'لا توجد منتجات مطابقة للبحث أو القسم المختار.',
    resetFilters: 'عرض جميع المنتجات',
    colorLabel: 'اللون',
    quantityLabel: 'الكمية',
    orderOnWhatsappBtn: 'اطلب عبر واتساب',
    deliveryBadge: 'شحن سريع',
    deliveryHeadline: 'توصيل في زحلة (Toters، Lyxa) وتوصيل إلى كافة المناطق اللبنانية',
    deliverySubtext:
      'اطلب مباشرة عبر واتساب أو اطلب التوصيل الفوري داخل زحلة وشحن موثوق إلى جميع المحافظات اللبنانية.',
    deliveryZahleTitle: 'توصيل فوري في زحلة',
    deliveryZahleDesc: 'إرسال سريع عبر Toters و Lyxa مباشرة إلى باب منزلك في زحلة.',
    deliveryLebanonTitle: 'توصيل لكل لبنان',
    deliveryLebanonDesc: 'توصيل خلال ٢٤ إلى ٤٨ ساعة إلى بيروت، جبل لبنان، الشمال، الجنوب والبقاع.',
    deliveryCodTitle: 'الدفع عند الاستلام',
    deliveryCodDesc: 'ادفع بأمان عند استلام طلبك ومعاينته.',
    galleryTitle: 'أحدث عروض شيه موني زحلة',
    gallerySubtitle: 'أجدد المنتجات والعروض اليومية من متجرنا',
    followFacebook: 'فيسبوك · Chez Moni Zahle',
    followInstagram: 'إنستغرام',
    followTiktok: 'تيك توك',
    contactTitle: 'موقعنا وتواصل معنا',
    contactSubtitle: 'خدمة مباشرة في زحلة — راسلنا على واتساب أو تفضل بزيارتنا',
    whatsappLabel: 'طلبات واتساب',
    secondPhoneLabel: 'هاتف المتجر',
    addressLabel: 'العنوان',
    hoursLabel: 'ساعات العمل',
    openInMaps: 'افتح في خرائط غوغل',
    cartTitle: 'سلة الطلبات',
    cartEmpty: 'سلتك فارغة حالياً',
    cartEmptySub: 'تصفح الساعات الذكية والسماعات والشواحن لإضافة منتجاتك.',
    cartSubtotal: 'المجموع',
    cartRegionLabel: 'منطقة التوصيل',
    cartRegionZahle: 'زحلة (Toters / Lyxa)',
    cartRegionLebanon: 'خارج زحلة (كل لبنان)',
    cartNotePlaceholder: 'العنوان التفصيلي أو ملاحظة (اختياري)',
    sendOrderWhatsapp: 'إرسال الطلب عبر واتساب',
    clearCart: 'إفراغ السلة',
    wishlistAdded: 'تم الحفظ في المفضلة',
    wishlistRemoved: 'تمت الإزالة من المفضلة',
    footerTagline: 'شريكك في التكنولوجيا — زحلة، لبنان',
    footerRights: 'شيه موني. جميع الحقوق محفوظة.',
    pinSetupTitle: 'تعيين رمز من ٤ أرقام',
    pinSetupSubtitle: 'أنشئ رمز حماية من ٤ أرقام لإدارة المتجر.',
    pinConfirmSubtitle: 'أعد إدخال الرمز المكون من ٤ أرقام للتأكيد.',
    pinEnterTitle: 'أدخل الرمز المكون من ٤ أرقام',
    pinEnterSubtitle: 'افتح لوحة إدارة المنتجات وإعدادات المتجر.',
    pinWrong: 'رمز غير صحيح',
    pinMismatch: 'الرمزان غير متطابقين. حاول مجدداً.',
    pinLocked: 'محاولات خاطئة كثيرة. حاول مجدداً بعد',
    pinAttemptsLeft: 'محاولات متبقية',
    pinProviderHelp:
      'قم بتفعيل Email/Password في لوحة Firebase Console → Authentication → Sign-in method لحفظ الرمز.',
    clearKey: 'مسح',
    backKey: 'حذف',
    panelTitle: 'إدارة المتجر',
    tabProducts: 'المنتجات',
    tabCategories: 'الأقسام',
    tabShopInfo: 'الواجهة ومعلومات المتجر',
    tabPasscode: 'تغيير الرمز',
    logout: 'تسجيل الخروج',
    addProduct: 'إضافة منتج',
    editProduct: 'تعديل المنتج',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    delete: 'حذف',
    uploadImage: 'رفع صورة',
    uploading: 'جاري الرفع...',
    changeCodeTitle: 'تغيير رمز الحماية',
    currentCode: 'الرمز الحالي (٤ أرقام)',
    newCode: 'الرمز الجديد (٤ أرقام)',
    confirmNewCode: 'تأكيد الرمز الجديد',
    updateCodeBtn: 'تحديث الرمز',
    codeUpdated: 'تم تحديث رمز الحماية بنجاح.',
  },
};
