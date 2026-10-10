import { Suspense } from "react";
import { Inter, Bodoni_Moda, Syne } from "next/font/google";
import "./globals.css";
import { getStore, getCategories } from "@/lib/api/storefront";
import { StoreProvider } from "@/lib/store-context";
import { CartProvider } from "@/lib/cart/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-syne",
});

export async function generateMetadata() {
  const storeRes = await getStore();
  const store = storeRes?.data || {};

  return {
    title: {
      template: `%s | ${store.name || "Ligloo"}`,
      default: `${store.name || "Ligloo"} — ${store.tagline || "Quiet Tailoring & Modern Luxury"}`,
    },
    description: store.tagline || "Discover premium collections at Ligloo.",
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
    <html lang="en" className={`${inter.variable} ${bodoni.variable} ${syne.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-bg text-text" suppressHydrationWarning>

        <StoreProvider store={store} initialCategories={categories}>
          <AuthProvider>
            <CartProvider>
              <Suspense fallback={<main className="flex-1">{children}</main>}>
                <StorefrontShell store={store} categories={categories}>
                  {children}
                </StorefrontShell>
              </Suspense>
            </CartProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
