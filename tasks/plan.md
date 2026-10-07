# Customer Storefront Implementation Plan

## Overview
Build the customer-facing storefront skeleton for the multi-store e-commerce platform based on `CUSTOMER_FRONTEND_ARCHITECTURE.md`.
The application is built with **Next.js (App Router, JavaScript, no TypeScript)** and **Tailwind CSS**, designed with a **server-first** mindset and a clean abstraction layer (`lib/api/*`) featuring a mock switch (`USE_MOCK`).

---

## Architecture & Conventions

### 1. Stack & Tech Decisions
- **Framework:** Next.js 14+ (App Router, JavaScript).
- **Styling:** Tailwind CSS + CSS Variables for dynamic multi-tenant store theming (`--color-primary`, `--radius`, etc.).
- **Icons:** `lucide-react`.
- **Target Root:** `frontend/` directory.

### 2. Multi-Store Resolution
- Store context is resolved per-request via domain (`X-Store-Domain`).
- Fallback for local dev: `DEFAULT_STORE_DOMAIN=test.local`.
- No hardcoded branding, logos, colors, or contact info.

### 3. State & Rendering Strategy
- **Server Components:** Home, Shop, Category, Brand, Product Details, Search, Static pages.
- **Client Components (`"use client"`):** Cart drawer/page, variant picker, filters drawer, search suggestion box, checkout form, order status timeline.
- **Data Layer:** `lib/api/storefront.js`, `lib/api/orders.js`, `lib/api/mock/*`.
- **Cart State:** `CartProvider` (Context + reducer), synced to `localStorage`, SSR hydration safe.

---

## Phased Execution Roadmap

### Phase 1: Project Foundation & Design System
- Initialize Next.js project in `frontend/` (JavaScript, Tailwind CSS, App Router, no TS, ESLint).
- Install dependencies: `lucide-react`, `clsx`, `tailwind-merge`.
- Set up CSS variables and design tokens in `app/globals.css` and `tailwind.config.js`.
- Build shared base UI components (`components/ui/`): Button, Input, Select, Badge, Skeleton, EmptyState, ErrorState, Modal, Drawer, Rating.
- Implement `lib/format.js` (price formatting with currency, date formatting) and `lib/validators.js` (BD phone `01XXXXXXXXX`, email).
- Implement `lib/api/client.js`, `lib/api/mock/`, `lib/api/storefront.js` with `USE_MOCK=true` switch.
- Implement `lib/store-context.js` (`StoreProvider`).

### Phase 2: Layout Shell & Global Chrome
- Root `layout.js` integrating fonts, `StoreProvider`, `CartProvider`.
- Global error boundary (`error.js`), not-found (`not-found.js`), loading skeleton (`loading.js`).
- Layout components (`components/layout/`):
  - `AnnouncementBar`
  - `Header` (Logo, Category nav/mega-menu, Search bar, Account link, Cart badge)
  - `MobileMenu` (Drawer navigation)
  - `Footer` (Store info, links, payment methods, copyright)
  - `WhatsAppButton` (Floating with store number and prefilled greeting)
  - `Breadcrumbs`

### Phase 3: Home Page Experience
- `app/page.js` assembling modular home sections with mock data:
  - `HeroBanner` carousel
  - `CategoryGrid` / circle cards
  - `FeaturedSection` & `NewArrivals`
  - `PromoBanner` strip
  - `BrandStrip`
  - `TrustBadges` (COD, Fast Delivery, Easy Return, 24/7 Support)
  - `Newsletter` / WhatsApp CTA

### Phase 4: Catalog & Search Experience
- Product list components: `ProductCard`, `ProductGrid`.
- Shop filters: `FilterSidebar`, `FilterDrawer`, `SortSelect`, `Pagination`, `ActiveFilters`.
- Pages:
  - `app/shop/page.js` (Catalog listing with server query params)
  - `app/category/[slug]/page.js`
  - `app/brand/[slug]/page.js`
  - `app/search/page.js` with client debounced search suggestions in header

### Phase 5: Product Details Experience
- `app/product/[slug]/page.js`:
  - `Gallery` (thumbnails, hover zoom, mobile touch)
  - `ProductView` (title, rating, price calculation, discount tags)
  - `VariantPicker` (Size, Color options with stock checks)
  - Stock badge ("In stock", "Only N left", "Out of stock")
  - Quantity stepper, "Add to Cart", "Buy Now", "Ask on WhatsApp"
  - Description & delivery accordion/tabs
  - Reviews list and review submission form
  - Related products grid

### Phase 6: Cart & Shopping Bag
- `lib/cart/` (`CartProvider`, reducer, persistence in `localStorage` without hydration mismatch).
- `CartDrawer` (slide-out cart on add-to-cart or header click).
- `app/cart/page.js` (full cart page with item list, quantity controls, coupon input, order subtotal).

### Phase 7: Checkout & Order Tracking
- `app/checkout/page.js`:
  - Contact form (Name, BD phone `01XXXXXXXXX`, optional email)
  - Address & Delivery Zone selector (calculates delivery fee)
  - Cash on Delivery (COD) payment method selector
  - Sticky order summary
  - Incomplete order / abandoned checkout capture trigger
- `app/order-success/[orderNumber]/page.js`
- `app/track-order/page.js` (Order number + phone -> status timeline)

### Phase 8: Auth & Account Section
- Auth pages: `app/login/page.js`, `app/register/page.js`.
- Account pages (`app/account/`):
  - Sidebar layout
  - Profile overview & edit
  - Order history with status badges & order detail breakdown

### Phase 9: Static Information Pages & System Health
- Static pages: `about/page.js`, `contact/page.js`, `privacy/page.js`, `terms/page.js`, `return-policy/page.js`.
- Maintenance / store suspended state support.

### Phase 10: SEO, Accessibility & Quality Verification
- Metadata helpers & OpenGraph tags in `lib/seo.js`.
- `sitemap.js` and `robots.js`.
- JSON-LD schemas for `Product`, `Organization`, and `BreadcrumbList`.
- Mobile responsiveness verification (360px, 768px, 1280px).
- Verification across 4 screen states: loading, error, empty, success.
