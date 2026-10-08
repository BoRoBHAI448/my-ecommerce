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
function getAdminHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch Admin Dashboard Stats & Overview
 */
export async function getAdminDashboard() {
  return await apiClient("/admin/dashboard", {
    headers: getAdminHeaders(),
  });
}

/**
 * Fetch Admin Orders list with filtering
 */
export async function getAdminOrders(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("q", params.search);
  if (params.page) searchParams.set("page", String(params.page));

  return await apiClient(`/admin/orders?${searchParams.toString()}`, {
    headers: getAdminHeaders(),
  });
}

/**
 * Fetch single order detail by ID
 */
export async function getAdminOrder(id) {
  return await apiClient(`/admin/orders/${id}`, {
    headers: getAdminHeaders(),
  });
}

/**
 * Update order status (Pending -> Confirmed -> Shipped -> Delivered, etc.)
 */
export async function updateAdminOrderStatus(id, orderStatus, notes = "") {
  return await apiClient(`/admin/orders/${id}/status`, {
    method: "PATCH",
    headers: getAdminHeaders(),
    body: JSON.stringify({ order_status: orderStatus, notes }),
  });
}

/**
 * Fetch Incomplete Orders (abandoned carts)
 */
export async function getAdminIncompleteOrders(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));

  return await apiClient(`/admin/orders/incomplete?${searchParams.toString()}`, {
    headers: getAdminHeaders(),
  });
}

/**
 * Create a new product from Admin panel
 */
export async function createAdminProduct(productData) {
  return await apiClient("/admin/products", {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(productData),
  });
}

/**
 * Update store settings from Admin panel
 */
export async function updateAdminStore(storeData) {
  return await apiClient("/admin/store", {
    method: "PATCH",
    headers: getAdminHeaders(),
    body: JSON.stringify(storeData),
  });
}
