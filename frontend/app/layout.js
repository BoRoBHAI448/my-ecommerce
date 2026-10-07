import { Inter } from "next/font/google";
import "./globals.css";
import { getStore, getCategories } from "@/lib/api/storefront";
import { StoreProvider } from "@/lib/store-context";
import { CartProvider } from "@/lib/cart/cart-context";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateMetadata() {
  const storeRes = await getStore();
  const store = storeRes?.data || {};

  return {
    title: {
      template: `%s | ${store.name || "Apex Cart"}`,
      default: `${store.name || "Apex Cart"} — ${store.tagline || "Premium Storefront"}`,
    },
    description: store.tagline || "Discover premium collections at Apex Cart.",
    icons: {
      icon: store.favicon || "/favicon.ico",
    },
  };
}

export default async function RootLayout({ children }) {
  const [storeRes, categoriesRes] = await Promise.all([
    getStore(),
    getCategories(),
  ]);

  const store = storeRes?.data || null;
  const categories = categoriesRes?.data || [];

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-bg text-text">
        <StoreProvider store={store}>
          <CartProvider>
            <StorefrontShell store={store} categories={categories}>
              {children}
            </StorefrontShell>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
