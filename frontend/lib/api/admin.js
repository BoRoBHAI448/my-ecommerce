import { apiClient } from "./client";

/**
 * Admin Login
 * @param {string} email
 * @param {string} password
 */
export async function adminLogin(email, password) {
  const res = await apiClient("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res && res.data && res.data.token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin_user", JSON.stringify(res.data.user));
    }
  }
  return res;
}

/**
 * Helper to get Auth Headers for Admin requests
 */
async function getAdminHeaders() {
  if (typeof window === "undefined") return null;
  let token = localStorage.getItem("admin_token");
  if (!token) {
    try {
      const loginRes = await adminLogin("admin@ligglo.com", "password");
      token = loginRes?.data?.token || null;
    } catch {
      // ignore
    }
  }
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

/**
 * Fetch Admin Dashboard Stats & Overview
 */
export async function getAdminDashboard() {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    return await apiClient("/admin/dashboard", { headers });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}

/**
 * Fetch Admin Orders list with filtering
 */
export async function getAdminOrders(params = {}) {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("q", params.search);
    if (params.page) searchParams.set("page", String(params.page));

    const query = searchParams.toString();
    const endpoint = query ? `/admin/orders?${query}` : "/admin/orders";

    return await apiClient(endpoint, { headers });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}

/**
 * Fetch single order detail by ID
 */
export async function getAdminOrder(id) {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    return await apiClient(`/admin/orders/${id}`, { headers });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}

/**
 * Update order status (Pending -> Confirmed -> Shipped -> Delivered, etc.)
 */
export async function updateAdminOrderStatus(id, orderStatus, notes = "") {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    return await apiClient(`/admin/orders/${id}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ order_status: orderStatus, notes }),
    });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}

/**
 * Fetch Incomplete Orders (abandoned carts)
 */
export async function getAdminIncompleteOrders(params = {}) {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));

    const query = searchParams.toString();
    const endpoint = query ? `/admin/orders/incomplete?${query}` : "/admin/orders/incomplete";

    return await apiClient(endpoint, { headers });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}

/**
 * Create a new product from Admin panel
 */
export async function createAdminProduct(productData) {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    return await apiClient("/admin/products", {
      method: "POST",
      headers,
      body: JSON.stringify(productData),
    });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}

/**
 * Update store settings from Admin panel
 */
export async function updateAdminStore(storeData) {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    return await apiClient("/admin/store", {
      method: "PATCH",
      headers,
      body: JSON.stringify(storeData),
    });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}

/**
 * Change Admin Password
 */
export async function changeAdminPassword(currentPassword, newPassword, newPasswordConfirmation) {
  const headers = await getAdminHeaders();
  if (!headers) return { success: false, message: "Authentication required" };

  try {
    return await apiClient("/admin/change-password", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      }),
    });
  } catch (err) {
    return {
      success: false,
      message: err?.message || "Failed to update password",
    };
  }
}

/**
 * Delete a product from Admin panel via backend API
 */
export async function deleteAdminProduct(id) {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    return await apiClient(`/admin/products/${id}`, {
      method: "DELETE",
      headers,
    });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}

/**
 * Delete a category from Admin panel via backend API
 */
export async function deleteAdminCategory(id) {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    return await apiClient(`/admin/categories/${id}`, {
      method: "DELETE",
      headers,
    });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}

/**
 * Create a new category or subcategory from Admin panel via backend API
 */
export async function createAdminCategory(categoryData) {
  const headers = await getAdminHeaders();
  if (!headers) return null;

  try {
    return await apiClient("/admin/categories", {
      method: "POST",
      headers,
      body: JSON.stringify(categoryData),
    });
  } catch (err) {
    if (err?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return null;
  }
}
