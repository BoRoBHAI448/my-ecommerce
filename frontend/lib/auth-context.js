"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

const STORAGE_KEY = "customer_auth";
const USERS_KEY = "customer_users";

// ─── Helpers ───────────────────────────────────────────────────────────────
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

// ─── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // null = not logged in
  const [loading, setLoading] = useState(true); // hydrating from storage

  // Restore session on mount (client only)
  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    setLoading(false);
  }, []);

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(({ name, phone, password }) => {
    const users = getUsers();
    if (users.find((u) => u.phone === phone)) {
      return { success: false, error: "এই নম্বর দিয়ে ইতোমধ্যে অ্যাকাউন্ট আছে। লগইন করুন।" };
    }
    const newUser = {
      id: `cust_${Date.now()}`,
      name: name.trim(),
      phone,
      password, // NOTE: plain text — acceptable for localStorage mock; replace with hash when adding real backend
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);

    const session = { id: newUser.id, name: newUser.name, phone: newUser.phone };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return { success: true };
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(({ phone, password }) => {
    const users = getUsers();
    const match = users.find((u) => u.phone === phone && u.password === password);
    if (!match) {
      return { success: false, error: "মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়।" };
    }
    const session = { id: match.id, name: match.name, phone: match.phone };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return { success: true };
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ─── Guard hook — use inside protected client components ──────────────────
export function useRequireAuth(redirectTo = "/login") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Capture current path so login can redirect back
      const current = window.location.pathname + window.location.search;
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(current)}`);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}
