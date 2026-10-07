import { headers } from "next/headers";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api/v1";
const DEFAULT_STORE_DOMAIN = process.env.DEFAULT_STORE_DOMAIN || "test.local";

/**
 * Resolve store domain from incoming request host or env default
 * @returns {string}
 */
export async function getStoreDomain() {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const cleanHost = host.split(":")[0];
    if (cleanHost && cleanHost !== "localhost" && cleanHost !== "127.0.0.1") {
      return cleanHost;
    }
  } catch (err) {
    // When called outside request context
  }
  return DEFAULT_STORE_DOMAIN;
}

/**
 * Core fetch wrapper sending X-Store-Domain and handling standard JSON envelope
 * @param {string} endpoint
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  const storeDomain = await getStoreDomain();
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Store-Domain": storeDomain,
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    next: {
      revalidate: options.revalidate !== undefined ? options.revalidate : 60,
      tags: options.tags || [],
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.errors = errorData.errors || null;
    throw error;
  }

  const json = await response.json();
  return json;
}
