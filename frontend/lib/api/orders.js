import { apiClient } from "./client";

/**
 * Submit order to backend REST API
 * @param {object} orderData
 */
export async function createOrder(orderData) {
  try {
    const res = await apiClient("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return res;
  } catch (err) {
    console.error("Order submission failed:", err);
    throw err;
  }
}

/**
 * Fetch order status & tracking info
 * @param {string} orderNumber
 */
export async function getOrder(orderNumber) {
  try {
    const res = await apiClient(`/orders/${orderNumber}`);
    return res;
  } catch (err) {
    console.error("Failed to fetch order:", err);
    return null;
  }
}

/**
 * Save incomplete order / abandoned cart
 * @param {object} payload
 */
export async function saveIncompleteOrder(payload) {
  try {
    const res = await apiClient("/orders/incomplete", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  } catch (err) {
    // Non-blocking background call
    return null;
  }
}
