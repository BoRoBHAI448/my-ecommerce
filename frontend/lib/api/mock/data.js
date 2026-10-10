export const mockStore = {
  id: "store_1",
  name: "ligglo Fashion Zone",
  slug: "ligglo-fashion-zone",
  tagline: "Premium Everyday Essentials & Lifestyle",
  currency: "BDT",
  currency_symbol: "৳",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  colors: {
    primary: "#0f172a",
    primary_contrast: "#ffffff",
    secondary: "#f59e0b",
    secondary_contrast: "#ffffff",
  },
  contact: {
    phone: "+880 1711-223344",
    email: "support@ligglo.com",
    address: "House 42, Road 11, Banani, Dhaka-1213, Bangladesh",
    hours: "9:00 AM - 10:00 PM (Daily)",
  },
  whatsapp: "8801711223344",
  social: {
    facebook: "https://facebook.com/ligglo",
    instagram: "https://instagram.com/ligglo",
    youtube: "https://youtube.com/ligglo",
  },
  announcement: {
    enabled: true,
    text: "🎉 Free Delivery inside Dhaka on orders above ৳2,000! Use code FREEDEL",
  },
  delivery_settings: {
    inside_dhaka: 70,
    sub_dhaka: 100,
    outside_dhaka: 130,
    free_delivery_threshold: 2000,
  },
};

export const mockCategories = [
  { id: 1, name: "Women's", slug: "women-s", description: "Women's fashion & apparel" },
  { id: 2, name: "Men's", slug: "men-s", description: "Men's clothing & accessories" },
  { id: 3, name: "Footwear", slug: "footwear", description: "Leather shoes & boots" },
  { id: 4, name: "Bags & Accessories", slug: "bags-accessories", description: "Leather bags and accessories" },
];

export const mockBanners = {
  hero: [],
  promo: [],
};

export const mockBrands = [
  { id: 1, name: "Apex", slug: "apex" },
  { id: 2, name: "Bata", slug: "bata" },
  { id: 3, name: "Ligglo Exclusive", slug: "ligglo-exclusive" },
];

export const mockProducts = [
  {
    id: 101,
    name: "Classic Leather Formal Shoes",
    slug: "classic-leather-formal-shoes",
    selling_price: 3500,
    discount_price: 2990,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80"],
    category: { id: 3, name: "Footwear", slug: "footwear" },
    brand: { id: 1, name: "Apex", slug: "apex" },
    in_stock: true,
    is_featured: true,
    variants: [
      { id: 1011, sku: "SHOE-BLK-40", color: "Black", size: "40", selling_price: 2990, stock_quantity: 15, in_stock: true },
      { id: 1012, sku: "SHOE-BLK-41", color: "Black", size: "41", selling_price: 2990, stock_quantity: 12, in_stock: true },
      { id: 1013, sku: "SHOE-BRN-42", color: "Brown", size: "42", selling_price: 2990, stock_quantity: 10, in_stock: true },
    ],
  },
  {
    id: 102,
    name: "Women's Leather Tote Bag",
    slug: "women-s-leather-tote-bag",
    selling_price: 4200,
    discount_price: 3500,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"],
    category: { id: 1, name: "Women's", slug: "women-s" },
    brand: { id: 3, name: "Ligglo Exclusive", slug: "ligglo-exclusive" },
    in_stock: true,
    is_featured: true,
    variants: [
      { id: 1021, sku: "BAG-BLK", color: "Black", size: "One Size", selling_price: 3500, stock_quantity: 8, in_stock: true },
      { id: 1022, sku: "BAG-TAN", color: "Tan", size: "One Size", selling_price: 3500, stock_quantity: 14, in_stock: true },
    ],
  },
];

export const mockCoupons = [
  { code: "FREEDEL", type: "delivery", discount: 100, min_order: 1500 },
  { code: "SAVE10", type: "percent", percent: 10, min_order: 1000 },
  { code: "WELCOME200", type: "fixed", amount: 200, min_order: 2000 },
];

export const mockOrders = [];

export const mockIncompleteOrders = [];
