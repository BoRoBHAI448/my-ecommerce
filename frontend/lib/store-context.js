"use client";

import { createContext, useContext, useEffect } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ store, children }) {
  // Apply dynamic store tokens to :root CSS variables if provided
  useEffect(() => {
    if (!store?.colors) return;
    const root = document.documentElement;

    if (store.colors.primary) {
      root.style.setProperty("--color-primary", store.colors.primary);
    }
    if (store.colors.primary_contrast) {
      root.style.setProperty("--color-primary-contrast", store.colors.primary_contrast);
    }
    if (store.colors.secondary) {
      root.style.setProperty("--color-secondary", store.colors.secondary);
    }
    if (store.colors.secondary_contrast) {
      root.style.setProperty("--color-secondary-contrast", store.colors.secondary_contrast);
    }
    if (store.radius) {
      root.style.setProperty("--radius", store.radius);
    }
  }, [store]);

  return (
    <StoreContext.Provider value={store || null}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    // Return empty fallback object rather than crashing if rendered outside
    return {};
  }
  return context;
}
