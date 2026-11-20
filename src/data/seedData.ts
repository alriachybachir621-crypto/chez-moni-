import { Category, Product, ShopSettings } from '../types/store';

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  heroTitle: 'Your Tech Partner',
  heroTitleAr: 'شريكك في التكنولوجيا',
  heroSubtitle:
    'Genuine mobile accessories, smartwatches, wireless audio, power banks, and smart security gear in Zahle — curated quality with same-day local delivery.',
  heroSubtitleAr:
    'إكسسوارات الهواتف الذكية، الساعات الذكية، السماعات اللاسلكية، الباور بانك وكاميرات المراقبة الأصلية في زحلة — جودة مضمونة وتوصيل سريع لكافة المناطق اللبنانية.',
  heroImages: [
    '/catalog/hero-showcase.png',
    '/catalog/hero-zahle.png',
    '/catalog/bundle-essentials.png',
  ],
  whatsapp: '81 922 013',
  secondaryPhone: '71 856 742',
  address: 'Zahle, Bekaa Valley, Lebanon',
  addressAr: 'زحلة، البقاع، لبنان',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Zahle,+Lebanon&output=embed',
  mapsLink: 'https://maps.google.com/?q=Zahle,+Lebanon',
  hours: 'Mon – Sat · 9:00 AM – 8:00 PM',
  hoursAr: 'الإثنين – السبت · ٩:٠٠ صباحاً – ٨:٠٠ مساءً',
  facebookUrl: 'https://www.facebook.com/search/top?q=Chez%20Moni%20Zahle',
  instagramUrl: 'https://www.instagram.com/',
  tiktokUrl: 'https://www.tiktok.com/',
  pinConfigured: false,
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'smartwatches',
    slug: 'smartwatches',
    name: 'Smartwatches',
    nameAr: 'الساعات الذكية',
    image: '/catalog/watch-gtfit.png',
    order: 1,
  },
  {
    id: 'earbuds',
    slug: 'earbuds',
    name: 'AirPods & Earbuds',
    nameAr: 'سماعات وإيربودز',
    image: '/catalog/earbuds-bellagio.png',
    order: 2,
  },
  {
    id: 'speakers',
    slug: 'speakers',
    name: 'Speakers',
    nameAr: 'مكبرات الصوت',
    image: '/catalog/hero-showcase.png',
    order: 3,
  },
  {
    id: 'chargers',
    slug: 'chargers',
    name: 'Chargers & Cables',
    nameAr: 'شواحن وكابلات',
    image: '/catalog/bundle-essentials.png',
    order: 4,
  },
  {
    id: 'powerbanks',
    slug: 'powerbanks',
    name: 'Power Banks',
    nameAr: 'باور بانك',
    image: '/catalog/powerbank-pl100.png',
    order: 5,
  },
  {
    id: 'cameras',
    slug: 'cameras',
    name: 'Security Cameras',
    nameAr: 'كاميرات مراقبة',
    image: '/catalog/camera-d10.png',
    order: 6,
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: 'Accessories',
    nameAr: 'إكسسوارات متنوعة',
    image: '/catalog/hero-zahle.png',
    order: 7,
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'green-lion-gt-fit',
    name: 'Green Lion GT-FIT Smart Watch',
    nameAr: 'ساعة غرين ليون GT-FIT الذكية',
    category: 'smartwatches',
    price: 38,
    oldPrice: 45,
    colors: ['Midnight Black', 'Silver Titanium'],
    images: ['/catalog/watch-gtfit.png'],
    inStock: true,
    isNew: true,
    isSale: true,
    description:
      'Always-on HD AMOLED display, Bluetooth calling, multi-sport fitness tracking, IP68 water resistance, and 7-day battery endurance.',
    descriptionAr:
      'شاشة AMOLED عالية الدقة تعمل دائماً، مكالمات بلوتوث، تتبع الرياضات واللياقة، مقاومة للماء IP68 وبطارية تدوم حتى ٧ أيام.',
  },
  {
    id: 'green-lion-flex-46',
    name: 'Green Lion Flex 46 Smart Watch',
    nameAr: 'ساعة غرين ليون Flex 46 الذكية',
    category: 'smartwatches',
    price: 42,
    oldPrice: null,
    colors: ['Obsidian Black', 'Graphite'],
    images: ['/catalog/watch-flex46.png'],
    inStock: true,
    isNew: true,
    isSale: false,
    description:
      '2.01-inch IPS edge-to-edge display, instant WhatsApp message previews, Bluetooth calls, IP68 protection, and 10-day standby.',
    descriptionAr:
      'شاشة مقاس ٢.٠١ إنش عالية الوضوح، إشعارات واتساب، مكالمات بلوتوث، مقاومة للماء IP68 واستعداد حتى ١٠ أيام.',
  },
  {
    id: 'green-lion-bellagio-earbuds',
    name: 'Green Lion Bellagio Wireless Earbuds',
    nameAr: 'سماعات غرين ليون بيلاجيو اللاسلكية',
    category: 'earbuds',
    price: 22,
    oldPrice: 28,
    colors: ['Pearl White', 'Matte Black'],
    images: [
      '/catalog/earbuds-bellagio.png',
      '/catalog/earbuds-bellagio-promo.png',
    ],
    inStock: true,
    isNew: false,
    isSale: true,
    description:
      'Bluetooth 5.3 low-latency audio, dual-mic clear voice calls, touch controls, USB-C fast charging case, and rich balanced bass.',
    descriptionAr:
      'بلوتوث ٥.٣، مايكروفون مزدوج لمكالمات نقية، تحكم باللمس، علبة شحن سريع USB-C وصوت نقي مع باس عميق.',
  },
  {
    id: 'powerlynk-pl-100',
    name: 'PowerLynk Magnetic Power Bank PL-100',
    nameAr: 'باور بانك مغناطيسي باور لينك PL-100',
    category: 'powerbanks',
    price: 29,
    oldPrice: 35,
    colors: ['Carbon Black'],
    images: ['/catalog/powerbank-pl100.png'],
    inStock: true,
    isNew: true,
    isSale: true,
    description:
      '10,000mAh airplane-safe capacity with 15W MagSafe wireless charging, 22.5W PD wired fast charge, and built-in smart digital LED display.',
    descriptionAr:
      'سعة ١٠٠٠٠ مللي أمبير آمن للطائرة مع شحن لاسلكي مغناطيسي ١٥ واط، شحن سريع PD بقوة ٢٢.٥ واط وشاشة رقمية ذكية.',
  },
  {
    id: 'hoco-d10-outdoor-camera',
    name: 'Hoco D10 Outdoor PTZ HD Security Camera',
    nameAr: 'كاميرا مراقبة خارجية Hoco D10 HD',
    category: 'cameras',
    price: 44,
    oldPrice: null,
    colors: ['Pure White'],
    images: ['/catalog/camera-d10.png'],
    inStock: true,
    isNew: true,
    isSale: false,
    description:
      '2.4GHz Wi-Fi pan-tilt-zoom outdoor smart camera with full-color night vision, motion auto-tracking, two-way audio, and mobile alerts.',
    descriptionAr:
      'كاميرا ذكية خارجية واي فاي متحركة PTZ مع رؤية ليلية واضحة، تتبع تلقائي للحركة، صوت ثنائي الاتجاه وإشعارات فورية على الهاتف.',
  },
  {
    id: 'hoco-d5-indoor-camera',
    name: 'Hoco D5 Indoor PTZ HD Camera',
    nameAr: 'كاميرا مراقبة داخلية Hoco D5 HD',
    category: 'cameras',
    price: 32,
    oldPrice: 38,
    colors: ['Slate Black / White'],
    images: ['/catalog/camera-d5.png'],
    inStock: true,
    isNew: false,
    isSale: true,
    description:
      '360-degree smart indoor monitoring with 3MP crisp resolution, smart motion tracking, night vision, and real-time phone viewing.',
    descriptionAr:
      'مراقبة داخلية ذكية ٣٦٠ درجة بدقة ٣ ميجابكسل، تتبع ذكي للحركة، رؤية ليلية ومراقبة مباشرة عبر التطبيق.',
  },
  {
    id: 'kakusiga-ksc-1036-watch',
    name: 'Kakusiga Smart Sports Watch KSC-1036',
    nameAr: 'ساعة كاكوسيجا الرياضية الذكية KSC-1036',
    category: 'smartwatches',
    price: 26,
    oldPrice: null,
    colors: ['Stealth Black', 'Titanium'],
    images: ['/catalog/watch-kakusiga.png'],
    inStock: true,
    isNew: false,
    isSale: false,
    description:
      'Call-enabled sports smartwatch with heart-rate & sleep monitoring, 100+ workout modes, and durable aluminum alloy frame.',
    descriptionAr:
      'ساعة رياضية تدعم المكالمات مع قياس نبض القلب والنوم، أكثر من ١٠٠ وضع رياضي وإطار معدني متين.',
  },
  {
    id: 'rgb-party-bluetooth-speaker',
    name: 'Chez Moni RGB Cylindrical Bluetooth Speaker',
    nameAr: 'مكبر صوت بلوتوث مع إضاءة RGB',
    category: 'speakers',
    price: 34,
    oldPrice: 40,
    colors: ['Matte Black'],
    images: ['/catalog/hero-showcase.png', '/catalog/bundle-essentials.png'],
    inStock: true,
    isNew: false,
    isSale: true,
    description:
      'Deep punchy bass, dynamic ambient RGB light ring, TWS stereo pairing, USB/TF playback, and rugged woven fabric shell.',
    descriptionAr:
      'صوت باس قوي مع حلقة إضاءة RGB تفاعلية، دعم ربط سماعتين TWS، منفذ USB وبطاقة ذاكرة.',
  },
  {
    id: 'gan-65w-fast-charger-kit',
    name: '65W PD GaN Fast Wall Charger & Braided Cable',
    nameAr: 'شاحن جداري سريع 65W PD مع كابل مجدول',
    category: 'chargers',
    price: 18,
    oldPrice: null,
    colors: ['Arctic White', 'Charcoal Black'],
    images: ['/catalog/bundle-essentials.png'],
    inStock: true,
    isNew: true,
    isSale: false,
    description:
      'Dual-port USB-C + USB-A fast wall adapter paired with a heavy-duty braided USB-C cable for iPhone, Samsung, and laptops.',
    descriptionAr:
      'شاحن سريع بمنفذي USB-C و USB-A مع كابل قماشي مجدول فائق التحمل لأجهزة الآيفون والسامسونج واللابتوب.',
  },
  {
    id: 'm97-stereo-bass-earphones',
    name: 'M97 Stereo Bass Wired Earphones',
    nameAr: 'سماعات سلكية M97 ستيريو باس',
    category: 'accessories',
    price: 8,
    oldPrice: null,
    colors: ['Classic White'],
    images: ['/catalog/earphones-m97.png'],
    inStock: true,
    isNew: false,
    isSale: false,
    description:
      '1.2m tangle-resistant wired stereo earphones with crisp inline microphone and 3.5mm universal jack.',
    descriptionAr:
      'سماعات سلكية بطول ١.٢ متر بصوت ستيريو نقي وميكروفون مدمج للمكالمات مع مدخل ٣.٥ ملم.',
  },
];

export const GALLERY_POSTS = [
  {
    id: 'g1',
    image: '/catalog/hero-showcase.png',
    captionEn: 'Best Products & Best Prices — Zahle & All Lebanon',
    captionAr: 'أفضل المنتجات وأفضل الأسعار — زحلة وكافة المناطق اللبنانية',
  },
  {
    id: 'g2',
    image: '/catalog/hero-zahle.png',
    captionEn: 'Daily local courier on Toters & Lyxa in Zahle',
    captionAr: 'توصيل يومي سريع في زحلة عبر Toters و Lyxa',
  },
  {
    id: 'g3',
    image: '/catalog/watch-gtfit.png',
    captionEn: 'Green Lion GT-FIT AMOLED Smart Watch in stock',
    captionAr: 'ساعة Green Lion GT-FIT متوفرة الآن',
  },
  {
    id: 'g4',
    image: '/catalog/earbuds-bellagio-promo.png',
    captionEn: 'Green Lion Bellagio Wireless Earbuds',
    captionAr: 'سماعات Green Lion Bellagio اللاسلكية',
  },
  {
    id: 'g5',
    image: '/catalog/powerbank-pl100.png',
    captionEn: 'PowerLynk 10,000mAh 15W MagSafe Power Bank',
    captionAr: 'باور بانك مغناطيسي PowerLynk ١٠٠٠٠ مللي أمبير',
  },
  {
    id: 'g6',
    image: '/catalog/camera-d10.png',
    captionEn: 'Hoco Smart Indoor & Outdoor Security Cameras',
    captionAr: 'كاميرات مراقبة ذكية داخلية وخارجية من Hoco',
  },
];
