"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

import { mockProducts, mockBrands } from "./api/mock/data";

const defaultCoupons = [
  {
    id: 1,
    code: "FREEDEL",
    type: "delivery",
    discount: 100,
    min_order: 1500,
    usage_count: 84,
    usage_limit: 200,
    expiry_date: "2026-12-31",
    is_active: true,
  },
  {
    id: 2,
    code: "SAVE10",
    type: "percent",
    percent: 10,
    discount: 10,
    min_order: 1000,
    usage_count: 142,
    usage_limit: 500,
    expiry_date: "2026-11-30",
    is_active: true,
  },
  {
    id: 3,
    code: "WELCOME200",
    type: "fixed",
    discount: 200,
    min_order: 2000,
    usage_count: 59,
    usage_limit: 100,
    expiry_date: "2026-10-31",
    is_active: true,
  },
  {
    id: 4,
    code: "FLASH30",
    type: "percent",
    percent: 30,
    discount: 30,
    min_order: 3500,
    usage_count: 50,
    usage_limit: 50,
    expiry_date: "2026-10-01",
    is_active: false,
  },
];

const StoreContext = createContext(null);

export function StoreProvider({ store: initialStore, initialCategories = [], initialProducts = [], children }) {
  const [customStore, setCustomStore] = useState(initialStore || null);
  const [categories, setCategories] = useState(initialCategories || []);
  const [products, setProducts] = useState(initialProducts || []);
  const [brands, setBrands] = useState([]);
  const [coupons, setCoupons] = useState(defaultCoupons);

  // Keep a ref to the initial props so the mount-only effect can access them
  // without adding them to the dependency array (which would cause infinite loops
  // because server components pass new object references on every render).
  const initialStoreRef = useRef(initialStore);
  const initialCategoriesRef = useRef(initialCategories);

  // Load saved overrides from localStorage — runs ONCE on mount only.
  useEffect(() => {
    const initStore = initialStoreRef.current;
    const initCats  = initialCategoriesRef.current;

    try {
      const saved = localStorage.getItem("store_custom_override");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomStore((prev) => ({
          ...(prev || initStore || {}),
          ...parsed,
          colors: {
            ...((prev || initStore || {}).colors || {}),
            ...(parsed.colors || {}),
          },
        }));
      }

      const savedCats = localStorage.getItem("store_custom_categories");
      if (savedCats !== null) {
        setCategories(JSON.parse(savedCats));
      } else if (initCats?.length) {
        setCategories(initCats);
      }

      const savedProducts = localStorage.getItem("store_custom_products");
      if (savedProducts !== null) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Purge legacy mock items that were previously seeded into localStorage
            const LEGACY_MOCK_SLUGS = new Set([
              "veloce-carbon-trail-sneaker",
              "monochrome-tailored-relaxed-trouser",
              "heritage-oxford-commuter-pack",
              "architectural-trench-overcoat",
              "heavyweight-boxy-graphic-tee",
              "apex-court-minimalist-runner",
              "atelier-structured-leather-tote",
              "airpulse-retro-90-sneakers",
              "classic-leather-formal-shoes",
              "women-s-leather-tote-bag",
            ]);

            const userCreatedOnly = parsed.filter(
              (p) => p && !LEGACY_MOCK_SLUGS.has(p.slug)
            );

            // Migrate: strip any leftover base64 data URIs (they bloat localStorage)
            const cleaned = userCreatedOnly.map((p) => ({
              ...p,
              image: p.image?.startsWith("data:") ? "" : (p.image || ""),
              images: Array.isArray(p.images)
                ? p.images.filter((img) => img && !img.startsWith("data:"))
                : [],
            }));
            setProducts(cleaned);
            // Write back cleaned version so quota is freed and mock data is purged
            try {
              localStorage.setItem("store_custom_products", JSON.stringify(cleaned));
            } catch {}
          } else {
            setProducts([]);
          }
        } catch {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }


      const savedBrands = localStorage.getItem("store_custom_brands");
      if (savedBrands !== null) {
        const parsedB = JSON.parse(savedBrands);
        if (Array.isArray(parsedB) && parsedB.length > 0) {
          setBrands(parsedB);
        } else {
          setBrands(mockBrands);
        }
      } else {
        setBrands(mockBrands);
      }

      const savedCoupons = localStorage.getItem("store_custom_coupons");
      if (savedCoupons !== null) {
        setCoupons(JSON.parse(savedCoupons));
      }
    } catch {
      // Ignore parse / storage errors
    }
  }, []); // ← empty array: run once on mount, refs keep initial values accessible

  const effectiveStore = customStore || initialStore || {};

  // Apply dynamic CSS variables & favicon whenever effectiveStore changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (effectiveStore?.colors) {
      const root = document.documentElement;
      if (effectiveStore.colors.primary)
        root.style.setProperty("--color-primary", effectiveStore.colors.primary);
      if (effectiveStore.colors.primary_contrast)
        root.style.setProperty("--color-primary-contrast", effectiveStore.colors.primary_contrast);
      if (effectiveStore.colors.secondary)
        root.style.setProperty("--color-secondary", effectiveStore.colors.secondary);
      if (effectiveStore.colors.secondary_contrast)
        root.style.setProperty("--color-secondary-contrast", effectiveStore.colors.secondary_contrast);
      if (effectiveStore.radius)
        root.style.setProperty("--radius", effectiveStore.radius);
    }

    // Dynamic favicon injection
    const faviconUrl = effectiveStore?.favicon || effectiveStore?.logo;
    if (faviconUrl && faviconUrl !== "/favicon.ico") {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [effectiveStore]);

  // Update store settings live and persist to localStorage
  const updateStore = useCallback((updates) => {
    setCustomStore((prev) => {
      const merged = { ...(prev || {}), ...updates };
      try {
        localStorage.setItem("store_custom_override", JSON.stringify(merged));
      } catch {
        // Ignore quota errors
      }
      return merged;
    });
  }, []);

  // Update category tree live and persist to localStorage
  const updateCategories = useCallback((newCategories) => {
    setCategories(newCategories);
    try {
      localStorage.setItem("store_custom_categories", JSON.stringify(newCategories));
    } catch {
      // Ignore quota errors
    }
  }, []);

  // Update products catalog live and persist to localStorage
  const updateProducts = useCallback((newProducts) => {
    setProducts((prev) => {
      const resolved =
        typeof newProducts === "function" ? newProducts(prev) : newProducts;
      const safeArray = Array.isArray(resolved) ? resolved : [];

      try {
        // Strip base64 data URIs to avoid localStorage quota exceeded errors
        const productsForStorage = safeArray.map((p) => ({
          ...p,
          image: p.image?.startsWith("data:") ? "" : (p.image || ""),
          images: Array.isArray(p.images)
            ? p.images.filter((img) => img && !img.startsWith("data:"))
            : [],
        }));
        localStorage.setItem("store_custom_products", JSON.stringify(productsForStorage));
      } catch (err) {
        console.warn("[StoreContext] localStorage save failed (quota?):", err);
        try {
          const minimalProducts = safeArray.map((p) => ({
            ...p,
            image: p.image?.startsWith("data:") ? "" : (p.image || ""),
            images: [],
          }));
          localStorage.setItem("store_custom_products", JSON.stringify(minimalProducts));
        } catch {}
      }

      return safeArray;
    });
  }, []);

  // Update brands list live and persist to localStorage
  const updateBrands = useCallback((newBrands) => {
    setBrands(newBrands);
    try {
      localStorage.setItem("store_custom_brands", JSON.stringify(newBrands));
    } catch {
      // Ignore quota errors
    }
  }, []);

  // Update coupons list live and persist to localStorage
  const updateCoupons = useCallback((newCoupons) => {
    setCoupons(newCoupons);
    try {
      localStorage.setItem("store_custom_coupons", JSON.stringify(newCoupons));
    } catch {
      // Ignore quota errors
    }
  }, []);

  // Clear all custom data and reset store to a clean baseline
  const resetStoreData = useCallback(() => {
    setCategories([]);
    setProducts([]);
    setBrands([]);
    setCoupons([]);
    try {
      localStorage.setItem("store_custom_categories", JSON.stringify([]));
      localStorage.setItem("store_custom_products", JSON.stringify([]));
      localStorage.setItem("store_custom_brands", JSON.stringify([]));
      localStorage.setItem("store_custom_coupons", JSON.stringify([]));
      localStorage.setItem("store_custom_orders", JSON.stringify([]));
    } catch {
      // Ignore quota errors
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        ...(effectiveStore || {}),
        categories,
        products,
        brands,
        coupons,
        updateCategories,
        updateProducts,
        updateBrands,
        updateCoupons,
        updateStore,
        resetStoreData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) return {};
  return context;
}
