import { apiClient } from "./client";
import {
  mockStore,
  mockCategories,
  mockBanners,
  mockBrands,
  mockProducts,
} from "./mock/data";

const isMock = process.env.USE_MOCK !== "false";

/**
 * Fetch store settings, branding, and theme
 */
export async function getStore() {
  if (isMock) {
    return { success: true, data: mockStore };
  }
  try {
    const res = await apiClient("/store");
    return res || { success: true, data: mockStore };
  } catch (err) {
    console.error("Failed to fetch store config from backend:", err);
    return { success: true, data: mockStore };
  }
}

/**
 * Fetch category tree
 */
export async function getCategories() {
  if (isMock) {
    return { success: true, data: mockCategories };
  }
  try {
    const res = await apiClient("/categories");
    return res || { success: true, data: [] };
  } catch (err) {
    console.error("Failed to fetch categories from backend:", err);
    return { success: true, data: mockCategories };
  }
}

/**
 * Fetch hero and promotional banners
 */
export async function getBanners() {
  if (isMock) {
    return { success: true, data: mockBanners };
  }
  try {
    const res = await apiClient("/banners");
    return res || { success: true, data: mockBanners };
  } catch (err) {
    console.error("Failed to fetch banners from backend:", err);
    return { success: true, data: mockBanners };
  }
}

/**
 * Fetch partner / featured brands
 */
export async function getBrands() {
  if (isMock) {
    return { success: true, data: mockBrands };
  }
  try {
    const res = await apiClient("/brands");
    return res || { success: true, data: mockBrands };
  } catch (err) {
    console.error("Failed to fetch brands from backend:", err);
    return { success: true, data: mockBrands };
  }
}

/**
 * Query products catalog with filters and pagination
 * @param {object} [params]
 */
export async function getProducts(params = {}) {
  const {
    search,
    category,
    brand,
    featured,
    min_price,
    max_price,
    sort = "latest",
    page = 1,
    per_page = 12,
  } = params;

  if (isMock) {
    let list = [...mockProducts];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category && p.category.name.toLowerCase().includes(q)) ||
          (p.brand && p.brand.name.toLowerCase().includes(q))
      );
    }

    if (category) {
      list = list.filter((p) => p.category && p.category.slug === category);
    }

    if (brand) {
      list = list.filter((p) => p.brand && p.brand.slug === brand);
    }

    if (featured === true || featured === "true" || featured === "1") {
      list = list.filter((p) => p.is_featured);
    }

    if (min_price) {
      list = list.filter((p) => (p.discount_price || p.selling_price || p.min_price) >= Number(min_price));
    }

    if (max_price) {
      list = list.filter((p) => (p.discount_price || p.selling_price || p.min_price) <= Number(max_price));
    }

    if (sort === "price_asc") {
      list.sort((a, b) => (a.discount_price || a.selling_price || a.min_price) - (b.discount_price || b.selling_price || b.min_price));
    } else if (sort === "price_desc") {
      list.sort((a, b) => (b.discount_price || b.selling_price || b.min_price) - (a.discount_price || a.selling_price || a.min_price));
    } else {
      list.sort((a, b) => b.id - a.id);
    }

    const total = list.length;
    const startIndex = (Number(page) - 1) * Number(per_page);
    const paginatedItems = list.slice(startIndex, startIndex + Number(per_page));

    return {
      success: true,
      data: paginatedItems,
      meta: {
        current_page: Number(page),
        per_page: Number(per_page),
        total,
        last_page: Math.ceil(total / Number(per_page)) || 1,
      },
    };
  }

  // Real API path
  const searchParams = new URLSearchParams();
  if (search) searchParams.set("q", search);
  if (category) searchParams.set("category", category);
  if (brand) searchParams.set("brand", brand);
  if (featured) searchParams.set("featured", "1");
  if (min_price) searchParams.set("min_price", min_price);
  if (max_price) searchParams.set("max_price", max_price);
  if (sort) searchParams.set("sort", sort);
  if (page) searchParams.set("page", String(page));
  if (per_page) searchParams.set("per_page", String(per_page));

  try {
    const res = await apiClient(`/products?${searchParams.toString()}`);
    return res || { success: true, data: [], meta: { current_page: 1, total: 0 } };
  } catch (err) {
    console.error("Failed to fetch products from backend:", err);
    return { success: true, data: mockProducts, meta: { current_page: 1, total: mockProducts.length } };
  }
}

/**
 * Fetch single product details by slug
 * @param {string} slug
 */
export async function getProductBySlug(slug) {
  if (isMock) {
    const product = mockProducts.find((p) => p.slug === slug);
    if (!product) return null;
    return { success: true, data: product };
  }

  try {
    const res = await apiClient(`/products/${slug}`);
    return res ? res : null;
  } catch (err) {
    console.error(`Failed to fetch product ${slug} from backend:`, err);
    const mock = mockProducts.find((p) => p.slug === slug);
    return mock ? { success: true, data: mock } : null;
  }
}

/**
 * Fetch related products for product details view
 * @param {string} slug
 * @param {number} [limit=4]
 */
export async function getRelatedProducts(slug, limit = 4) {
  if (isMock) {
    const current = mockProducts.find((p) => p.slug === slug);
    const related = mockProducts
      .filter((p) => p.slug !== slug && (!current || (p.category && current.category && p.category.slug === current.category.slug)))
      .slice(0, limit);
    return { success: true, data: related.length > 0 ? related : mockProducts.slice(0, limit) };
  }

  try {
    const res = await apiClient(`/products/related/${slug}`);
    return res || { success: true, data: [] };
  } catch (err) {
    console.error(`Failed to fetch related products for ${slug} from backend:`, err);
    return { success: true, data: [] };
  }
}
