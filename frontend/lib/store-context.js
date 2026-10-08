"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ store: initialStore, initialCategories = [], children }) {
  const [customStore, setCustomStore] = useState(initialStore || null);
  const [categories, setCategories] = useState(initialCategories || []);

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
      if (savedCats) {
        setCategories(JSON.parse(savedCats));
      } else if (initCats?.length) {
        setCategories(initCats);
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

  return (
    <StoreContext.Provider
      value={{
        ...(effectiveStore || {}),
        categories,
        updateCategories,
        updateStore,
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
