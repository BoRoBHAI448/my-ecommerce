# Customer Storefront Tasks List

## Phase 1: Project Foundation & Design System

- [x] **Task 1.1: Initialize Next.js project in `frontend/`**
  - Next.js (App Router, JavaScript, Tailwind CSS, ESLint, no TypeScript, `src/` directory: No, app in `frontend/app`).
  - Install `lucide-react`, `clsx`, `tailwind-merge`.
  - Create `.env.example` and `.env.local`.

- [x] **Task 1.2: Design Tokens and Theme Config**
  - Set up CSS variables in `app/globals.css` (`--color-primary`, `--color-secondary`, `--radius`, font scales).
  - Configure `tailwind.config.js` to map design tokens (`bg-primary`, `text-muted`, `rounded-theme`, etc.).

- [x] **Task 1.3: Core UI Component Library (`components/ui/`)**
  - Implement Button, Input, Select, Badge, Skeleton, EmptyState, ErrorState, Modal, Drawer, Rating, Spinner.

- [x] **Task 1.4: Utilities & Formatters**
  - `lib/format.js` (currency formatting with store currency, date formatting).
  - `lib/validators.js` (BD phone `01XXXXXXXXX`, email, required).

- [x] **Task 1.5: Data Layer Foundation & Mock Switch**
  - `lib/api/client.js` with `X-Store-Domain` header support.
  - `lib/api/mock/data.js` containing complete realistic store, categories, banners, brands, and products.
  - `lib/api/storefront.js` with `USE_MOCK` switch.
  - `lib/store-context.js` (`StoreProvider`).

---
### Checkpoint 1: Foundation Verification
- [x] Application compiles without errors.
- [x] Base tokens and UI components render cleanly.
- [x] Mock API successfully provides store configuration.

---

## Phase 2: Layout Shell & Global Chrome

- [x] **Task 2.1: Root Layout & Global Error / Loading Boundaries**
  - `app/layout.js`, `app/loading.js`, `app/error.js`, `app/not-found.js`.
  - Inter Google font integration.

- [x] **Task 2.2: Header & Navigation**
  - `components/layout/AnnouncementBar.jsx`
  - `components/layout/Header.jsx` (Logo, Categories nav, Desktop Search bar, Cart badge, Account icon).
  - `components/layout/MobileMenu.jsx` (Drawer navigation for mobile).

- [x] **Task 2.3: Footer, Breadcrumbs & WhatsApp Floating Button**
  - `components/layout/Footer.jsx` (About, quick links, contacts, payment badges).
  - `components/layout/WhatsAppButton.jsx` (Floating button with store WhatsApp number & greeting).
  - `components/layout/Breadcrumbs.jsx`.

---
### Checkpoint 2: Layout Verification
- [x] Responsive header & mobile menu functional across 360px and 1280px.
- [x] Floating WhatsApp button and sticky header behave smoothly.

---

## Phase 3: Home Page Experience

- [x] **Task 3.1: Hero Carousel & Category Grid**
  - `components/home/HeroBanner.jsx`
  - `components/home/CategoryGrid.jsx`

- [x] **Task 3.2: Product Sections (Featured & New Arrivals)**
  - `components/product/ProductCard.jsx`
  - `components/product/ProductGrid.jsx`
  - `components/home/FeaturedSection.jsx`

- [x] **Task 3.3: Promo, Brands, Trust Badges & Newsletter**
  - `components/home/PromoBanner.jsx`
  - `components/home/BrandStrip.jsx`
  - `components/home/TrustBadges.jsx`
  - `components/home/Newsletter.jsx`
  - Complete `app/page.js` assembly.

---
### Checkpoint 3: Home Experience Verification
- [x] All 9 home sections render dynamically from store data.
- [x] 4-state pattern (loading, error, empty, success) handled gracefully.

---

## Phase 4: Catalog & Search Experience

- [x] **Task 4.1: Shop Filters & Sorting**
  - `components/shop/FilterSidebar.jsx` (Category, brand, price, stock, variants).
  - `components/shop/FilterDrawer.jsx` (Mobile filters).
  - `components/shop/SortSelect.jsx`, `Pagination.jsx`, `ActiveFilters.jsx`.

- [x] **Task 4.2: Catalog Pages**
  - `app/shop/page.js`
  - `app/category/[slug]/page.js`
  - `app/brand/[slug]/page.js`

- [x] **Task 4.3: Search Page & Live Header Suggestions**
  - `components/shop/SearchBox.jsx` with debounced search suggestions.
  - `app/search/page.js` with empty state suggestions.

---
### Checkpoint 4: Catalog Verification
- [x] URL-based filters, sorting, and pagination work seamlessly.
- [x] Mobile filter drawer operates smoothly on 360px.

---

## Phase 5: Product Details Experience

- [x] **Task 5.1: Product Gallery & Overview**
  - `components/product/Gallery.jsx` (Thumbnails, zoom, mobile touch).
  - `components/product/PriceTag.jsx`, `StockBadge.jsx`.

- [x] **Task 5.2: Variant Picker & Action Controls**
  - `components/product/VariantPicker.jsx` (Size, color, stock check).
  - Quantity stepper, "Add to Cart", "Buy Now", "Ask on WhatsApp".

- [x] **Task 5.3: Details Tabs & Reviews**
  - Description, shipping & return policy tabs/accordions.
  - `components/product/ReviewList.jsx`, `ReviewForm.jsx`.
  - `components/product/RelatedProducts.jsx`.
  - Complete `app/product/[slug]/page.js`.

---
### Checkpoint 5: Product Details Verification
- [x] Variant selection updates price, SKU, and stock badge accurately.
- [x] Out of stock handling disables add to cart appropriately.

---

## Phase 6: Cart & Shopping Bag

- [x] **Task 6.1: Cart State Management**
  - `lib/cart/cart-context.js` (CartProvider, reducer, actions).
  - Safe hydration with `localStorage` (no SSR mismatch).

- [x] **Task 6.2: Cart Drawer & Full Cart Page**
  - `components/cart/CartDrawer.jsx`.
  - `components/cart/CartItem.jsx`, `QuantityStepper.jsx`.
  - `components/cart/CouponInput.jsx`, `CartSummary.jsx`.
  - `app/cart/page.js`.

---
### Checkpoint 6: Cart Verification
- [x] Add, update quantity, remove, and clear cart function correctly.
- [x] Cart state persists in localStorage across page reloads.

---

## Phase 7: Checkout & Order Flow

- [x] **Task 7.1: Checkout Form & Zones Calculation**
  - `components/checkout/CheckoutForm.jsx` (BD phone validation, zone selection).
  - `components/checkout/DeliverySelector.jsx`, `PaymentSelector.jsx`.
  - `components/checkout/OrderSummary.jsx`.
  - Incomplete order / abandoned capture trigger.
  - `app/checkout/page.js`.

- [x] **Task 7.2: Order Success & Tracking**
  - `app/order-success/[orderNumber]/page.js`.
  - `app/track-order/page.js` with order status timeline.

---
### Checkpoint 7: Checkout Flow Verification
- [x] End-to-end checkout flow from Cart -> Checkout -> Success -> Track works with mock order submission.

---

## Phase 8: Auth & Customer Account

- [x] **Task 8.1: Auth Pages (Login & Register)**
  - `app/login/page.js`, `app/register/page.js`.

- [x] **Task 8.2: Customer Account Dashboard**
  - `app/account/layout.js`, `profile/page.js`.
  - `app/account/orders/page.js`, `[orderNumber]/page.js`.

---

## Phase 9: Static Pages & System Pages

- [x] **Task 9.1: Store Info & Policy Pages**
  - `app/about/page.js`, `contact/page.js`, `privacy/page.js`, `terms/page.js`, `return-policy/page.js`.

---

## Phase 10: SEO, Accessibility & Verification Pass

- [x] **Task 10.1: Metadata, JSON-LD, Sitemap & Robots**
  - `lib/seo.js`, `app/sitemap.js`, `app/robots.js`.
  - Responsive audit (360px, 768px, 1280px).
  - Next.js production build verification (`npm run build`).
