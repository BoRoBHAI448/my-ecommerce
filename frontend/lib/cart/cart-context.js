"use client";

import { createContext, useContext, useReducer, useEffect, useState } from "react";

const CartContext = createContext(null);

const initialState = {
  items: [], // [{ id, productId, name, slug, image, variantId, variantLabel, price, originalPrice, quantity }]
  coupon: null,
  isDrawerOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_INITIAL_ITEMS":
      return {
        ...state,
        items: action.payload || [],
      };

    case "ADD_ITEM": {
      const item = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );

      let newItems;
      if (existingIndex > -1) {
        newItems = state.items.map((i, index) =>
          index === existingIndex
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      } else {
        newItems = [...state.items, { ...item, quantity: item.quantity || 1 }];
      }

      return {
        ...state,
        items: newItems,
        isDrawerOpen: true, // Auto-open cart drawer on add
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, variantId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity }
            : i
        ),
      };
    }

    case "REMOVE_ITEM": {
      const { productId, variantId } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        ),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        coupon: null,
      };

    case "APPLY_COUPON":
      return {
        ...state,
        coupon: action.payload,
      };

    case "REMOVE_COUPON":
      return {
        ...state,
        coupon: null,
      };

    case "TOGGLE_DRAWER":
      return {
        ...state,
        isDrawerOpen: action.payload !== undefined ? action.payload : !state.isDrawerOpen,
      };

    default:
      return state;
  }
}

const STORAGE_KEY = "apex_cart_v1";

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Safe hydration from localStorage to prevent SSR mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_INITIAL_ITEMS", payload: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage on state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [state.items, isHydrated]);

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = state.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  let discount = 0;
  if (state.coupon) {
    if (state.coupon.type === "percent") {
      discount = (subtotal * state.coupon.percent) / 100;
    } else if (state.coupon.type === "fixed") {
      discount = state.coupon.amount;
    }
  }

  const total = Math.max(0, subtotal - discount);

  const value = {
    items: state.items,
    isDrawerOpen: state.isDrawerOpen,
    coupon: state.coupon,
    itemCount: isHydrated ? itemCount : 0,
    subtotal,
    discount,
    total,
    isHydrated,
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    updateQuantity: (productId, variantId, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, variantId, quantity } }),
    removeItem: (productId, variantId) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    applyCoupon: (coupon) => dispatch({ type: "APPLY_COUPON", payload: coupon }),
    removeCoupon: () => dispatch({ type: "REMOVE_COUPON" }),
    openDrawer: () => dispatch({ type: "TOGGLE_DRAWER", payload: true }),
    closeDrawer: () => dispatch({ type: "TOGGLE_DRAWER", payload: false }),
    toggleDrawer: () => dispatch({ type: "TOGGLE_DRAWER" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
