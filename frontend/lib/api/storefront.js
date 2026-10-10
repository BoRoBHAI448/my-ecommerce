import { apiClient } from "./client";
import {
  mockStore,
  mockCategories,
  mockBanners,
  mockBrands,
} from "./mock/data";
import { getStorefrontProducts, getStorefrontProductBySlug } from "../supabase/products";

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
    return res && res.data && res.data.length > 0
      ? res
      : { success: true, data: mockCategories };
  } catch (err) {
    console.error("Failed to fetch categories from backend, using fallback:", err);
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
    return res && res.data && res.data.length > 0
      ? res
      : { success: true, data: mockBrands };
  } catch (err) {
    console.error("Failed to fetch brands from backend, using fallback:", err);
    return { success: true, data: mockBrands };
  }
}

/**
 * Query products catalog with filters and pagination
 * Uses live Supabase database
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
    gender,
    limit = 50,
  } = params;

  try {
    const live = await getStorefrontProducts({ limit, gender });
    if (Array.isArray(live)) {
      let list = [...live];

      if (search) {
        const q = search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q));
      }

      if (featured) {
        list = list.filter((p) => Boolean(p.is_featured));
      }

      if (min_price) {
        list = list.filter(
          (p) => (p.discount_price || p.selling_price) >= Number(min_price)
        );
      }

      if (max_price) {
        list = list.filter(
          (p) => (p.discount_price || p.selling_price) <= Number(max_price)
        );
      }

      return {
        success: true,
        data: list,
        meta: {
          current_page: 1,
          per_page: list.length,
          total: list.length,
          last_page: 1,
        },
      };
    }
  } catch (err) {
    console.warn("Failed to fetch products from Supabase:", err);
  }

  return {
    success: true,
    data: [],
    meta: { current_page: 1, per_page: 12, total: 0, last_page: 1 },
  };
}

/**
 * Fetch single product details by slug
 * @param {string} slug
 */
export async function getProductBySlug(slug) {
  try {
    const live = await getStorefrontProductBySlug(slug);
    if (live) return { success: true, data: live };
  } catch (err) {
    console.warn(`Product slug ${slug} fetch notice:`, err);
  }
  return null;
}

/**
 * Fetch related products for product details view
 * @param {string} slug
 * @param {number} [limit=4]
 */
export async function getRelatedProducts(slug, limit = 4) {
  try {
    const live = await getStorefrontProducts({ limit: limit + 1 });
    const filtered = (live || [])
      .filter((p) => p.slug !== slug)
      .slice(0, limit);
    return { success: true, data: filtered };
  } catch (err) {
    console.warn("Related products fetch notice:", err);
  }
  return { success: true, data: [] };
}
