import { supabase } from "./client";

/**
 * Fetch active products from Supabase for Storefront
 *
 * @param {object} [options]
 * @param {string} [options.gender] - "Women", "Men", etc.
 * @param {number} [options.limit=20]
 * @returns {Promise<Array>}
 */
export async function getStorefrontProducts(options = {}) {
  try {
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (options.gender) {
      query = query.eq("gender", options.gender);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Supabase products fetch failed:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching storefront products:", err);
    return [];
  }
}

/**
 * Fetch single product details by slug from Supabase
 *
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function getStorefrontProductBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      console.warn(`Product slug "${slug}" not found in Supabase:`, error.message);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("Error fetching product by slug:", err);
    return null;
  }
}

/**
 * Insert new product from Admin Panel into Supabase
/**
 * Insert or update product via secure server API (using SUPABASE_SERVICE_ROLE_KEY)
 *
 * @param {object} product
 * @returns {Promise<object>}
 */
export async function createAdminProductInSupabase(product) {
  try {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || `Failed with status ${res.status}`);
    }

    return result.data;
  } catch (err) {
    console.error("createAdminProductInSupabase API error:", err);
    throw err;
  }
}

/**
 * Delete product in Supabase via server API
 *
 * @param {string|number} [id]
 * @param {string} [slug]
 * @returns {Promise<boolean>}
 */
export async function deleteAdminProductInSupabase(id, slug) {
  try {
    const params = new URLSearchParams();
    if (id) params.set("id", String(id));
    if (slug) params.set("slug", String(slug));

    const res = await fetch(`/api/admin/products?${params.toString()}`, {
      method: "DELETE",
    });

    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || `Failed to delete product`);
    }

    return true;
  } catch (err) {
    console.error("deleteAdminProductInSupabase API error:", err);
    throw err;
  }
}

/**
 * Patch product status/stock in Supabase via server API
 *
 * @param {string|number} id
 * @param {object} updates
 * @returns {Promise<object>}
 */
export async function updateAdminProductInSupabase(id, updates) {
  try {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...updates }),
    });

    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || `Failed to update product`);
    }

    return result.data;
  } catch (err) {
    console.error("updateAdminProductInSupabase API error:", err);
    throw err;
  }
}
