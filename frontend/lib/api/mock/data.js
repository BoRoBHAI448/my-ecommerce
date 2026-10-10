export const mockStore = {
  id: "store_1",
  name: "Ligloo",
  slug: "ligloo",
  tagline: "Quiet Tailoring & Modern Luxury",
  currency: "BDT",
  currency_symbol: "৳",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  colors: {
    primary: "#09090b",
    primary_contrast: "#ffffff",
    secondary: "#f59e0b",
    secondary_contrast: "#ffffff",
  },
  contact: {
    phone: "+880 1711-223344",
    email: "concierge@ligglo.com",
    address: "House 42, Road 11, Banani, Dhaka-1213, Bangladesh",
    hours: "10:00 AM - 10:00 PM (Daily)",
  },
  whatsapp: "8801711223344",
  social: {
    facebook: "https://facebook.com/ligglo",
    instagram: "https://instagram.com/ligglo",
    youtube: "https://youtube.com/ligglo",
  },
  announcement: {
    enabled: true,
    text: "🔥 NEW SEASON DROP: Complimentary Express Shipping Nationwide On Orders Over ৳2,500",
  },
  delivery_settings: {
    inside_dhaka: 70,
    sub_dhaka: 100,
    outside_dhaka: 130,
    free_delivery_threshold: 2500,
  },
};

export const mockCategories = [
  {
    id: 1,
    name: "Footwear & Kicks",
    slug: "footwear",
    item_count: 24,
    description: "Engineered sneakers, runners, and premium leather formals.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Men's Apparel",
    slug: "men-s",
    item_count: 38,
    description: "Minimalist tailoring, heavyweight tees, and technical outerwear.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Women's Collection",
    slug: "women-s",
    item_count: 42,
    description: "Contemporary silhouettes, luxury dresses, and active essentials.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Bags & Leather",
    slug: "bags-accessories",
    item_count: 19,
    description: "Full-grain leather totes, weekend duffels, and everyday carriers.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Urban Streetwear",
    slug: "streetwear",
    item_count: 16,
    description: "Oversized hoodies, cargo silhouettes, and signature capsule drops.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
  },
];

export const mockBanners = {
  hero: [
    {
      id: 1,
      badge: "SEASON '26 DROP",
      title: "RUN BEYOND LIMITS",
      subtitle: "The ultra-responsive AirPulse Runner engineered with dual-density foam for unmatched motion.",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&auto=format&fit=crop&q=85",
      cta_text: "Shop Footwear",
      cta_link: "/category/footwear",
      secondary_cta_text: "Explore Lookbook",
      secondary_cta_link: "/shop",
    },
    {
      id: 2,
      badge: "EDITORIAL CAPSULE",
      title: "TIMELESS MONOCHROME",
      subtitle: "Precision tailoring crafted from sustainable heavyweight organic cotton and treated linen.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85",
      cta_text: "Explore Men",
      cta_link: "/category/men-s",
      secondary_cta_text: "Explore Women",
      secondary_cta_link: "/category/women-s",
    },
    {
      id: 3,
      badge: "ATELIER LEATHER CRAFT",
      title: "LUXURY IN MOTION",
      subtitle: "Hand-finished Florentine leather bags and classic silhouette derby shoes made to endure.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&auto=format&fit=crop&q=85",
      cta_text: "Shop Leather Goods",
      cta_link: "/category/bags-accessories",
      secondary_cta_text: "View All Drops",
      secondary_cta_link: "/shop",
    },
  ],
  promo: [
    {
      id: 1,
      badge: "THE SPOTLIGHT SERIES",
      title: "CRAFTED FOR EVERY DIMENSION",
      subtitle: "Where peak athletic functionality meets high-couture aesthetic. Explore the Spring 2026 limited drop.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=85",
      link: "/shop?featured=true",
      button_text: "Discover The Edit",
    },
  ],
};

export const mockBrands = [
  { id: 1, name: "LIGGLO ATELIER", slug: "ligglo-atelier" },
  { id: 2, name: "APEX SIGNATURE", slug: "apex" },
  { id: 3, name: "BATA HERITAGE", slug: "bata" },
  { id: 4, name: "MONO STUDIO", slug: "mono-studio" },
  { id: 5, name: "AEROLAB CO.", slug: "aerolab" },
];

export const mockProducts = [];

export const mockCoupons = [
  { code: "FREEDEL", type: "delivery", discount: 100, min_order: 1500 },
  { code: "SAVE10", type: "percent", percent: 10, min_order: 1000 },
  { code: "WELCOME200", type: "fixed", amount: 200, min_order: 2000 },
];

export const mockOrders = [];
export const mockIncompleteOrders = [];
