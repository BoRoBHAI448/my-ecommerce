# Customer Website: Frontend Architecture and Build Instructions

Goal: build the **customer-facing storefront skeleton** with a **premium UI**, ready to connect to the existing Laravel API.
Scope: customer website only (admin dashboard is a separate document).

Stack: Next.js (App Router, JavaScript), Tailwind CSS. No TypeScript.

---

## 1. Principles

1. **Multi-store:** nothing hardcoded (name, logo, colors, WhatsApp). Everything comes from the store API. Store is resolved from the request domain.
2. **Server first:** pages are Server Components (SSR/ISR) for SEO and speed. Use `"use client"` only where interaction is needed.
3. **Reusable components:** small, single-purpose, used everywhere. Pages only compose components.
4. **One API layer:** pages never call `fetch` directly. All calls go through `lib/api/*`.
5. **Mock-friendly:** the data layer has a mock/real switch so the UI can be built before every endpoint exists.
6. **Mobile first:** design for 360px, then scale up (tablet, desktop).
7. **Every screen has 4 states:** loading, error, empty, success.
8. **Security:** no secrets in frontend, no token in `localStorage`, never render HTML from user/API text (`dangerouslySetInnerHTML` is forbidden).

---

## 2. Rendering Strategy (SSR vs CSR)

| Page / Part | Rendering | Reason |
|---|---|---|
| Home, Shop, Category, Brand | Server Component, revalidate 30-60s | SEO, speed |
| Product details | Server Component + small client `ProductView` | SEO + variant picker |
| Search results | Server Component (reads `searchParams`) + client search box | SEO, shareable URL |
| Header / Footer | Server Component (store data) + client mobile menu, cart badge | |
| Cart, Checkout | Client Components | state, forms |
| Login / Register | Client forms + Next.js route handlers | cookie auth |
| Account, My Orders | Server Component with cookie auth + client bits | private data |
| Order success, Track order | Client or server with query | |
| Static pages (About, Contact, Privacy, Terms, Returns) | Server, content from store settings | |

Rules: do not fetch in client components when a server component can do it. Pass data down as props.

---

## 3. Folder Structure

```
frontend/
├── app/
│   ├── layout.js                 # root layout, fonts, theme tokens, Header/Footer
│   ├── globals.css               # Tailwind + CSS variables (design tokens)
│   ├── page.js                   # Home
│   ├── not-found.js
│   ├── error.js                  # global error boundary (client)
│   ├── loading.js                # global skeleton
│   ├── shop/page.js
│   ├── category/[slug]/page.js
│   ├── brand/[slug]/page.js
│   ├── product/[slug]/page.js
│   ├── search/page.js
│   ├── cart/page.js
│   ├── checkout/page.js
│   ├── order-success/[orderNumber]/page.js
│   ├── track-order/page.js
│   ├── login/page.js
│   ├── register/page.js
│   ├── account/
│   │   ├── layout.js             # account sidebar
│   │   ├── profile/page.js
│   │   └── orders/
│   │       ├── page.js
│   │       └── [orderNumber]/page.js
│   ├── about/page.js
│   ├── contact/page.js
│   ├── privacy/page.js
│   ├── terms/page.js
│   ├── return-policy/page.js
│   ├── sitemap.js                # sitemap.xml
│   ├── robots.js                 # robots.txt
│   └── api/                      # BFF route handlers (httpOnly cookie auth)
│       ├── auth/login/route.js
│       ├── auth/register/route.js
│       ├── auth/logout/route.js
│       ├── orders/route.js       # place order (server -> Laravel)
│       └── ...
├── components/
│   ├── layout/    Header, Footer, MobileMenu, AnnouncementBar, WhatsAppButton, Breadcrumbs
│   ├── home/      HeroBanner, CategoryGrid, FeaturedSection, BrandStrip, PromoBanner, TrustBadges, Newsletter
│   ├── product/   ProductCard, ProductGrid, ProductView, Gallery, VariantPicker, PriceTag, StockBadge, ReviewList, ReviewForm, RelatedProducts
│   ├── shop/      FilterSidebar, FilterDrawer, SortSelect, SearchBox, Pagination, ActiveFilters
│   ├── cart/      CartDrawer, CartItem, CartSummary, CouponInput, QuantityStepper
│   ├── checkout/  CheckoutForm, DeliverySelector, PaymentSelector, OrderSummary
│   ├── account/   OrderCard, OrderTimeline, AddressForm, ProfileForm
│   └── ui/        Button, Input, Select, Textarea, Checkbox, Modal, Drawer, Badge, Skeleton, EmptyState, ErrorState, Toast, Spinner, Rating, Accordion, Tabs
├── lib/
│   ├── api/
│   │   ├── client.js             # base fetch (server): adds X-Store-Domain, error handling
│   │   ├── storefront.js         # getStore, getCategories, getProducts, getProduct, getBanners
│   │   ├── orders.js             # createOrder, trackOrder
│   │   ├── auth.js               # via BFF
│   │   └── mock/                 # mock data + switch (USE_MOCK)
│   ├── store-context.js          # store settings provider (theme, contact)
│   ├── cart/                     # CartProvider (context + reducer + localStorage persistence)
│   ├── format.js                 # formatPrice, formatDate
│   ├── seo.js                    # metadata helpers, JSON-LD builders
│   └── validators.js             # phone (01XXXXXXXXX), email, required
├── hooks/                        # useCart, useDebounce, useMediaQuery
├── public/
├── .env.example
└── next.config.mjs
```

---

## 4. Design System (Premium UI)

### 4.1 Tokens (CSS variables, set from store theme)

Define in `globals.css`, override per store from API (`primary`, `secondary`, `font`, `radius`).

```
--color-primary, --color-primary-contrast
--color-secondary
--color-bg, --color-surface, --color-muted
--color-text, --color-text-muted, --color-border
--color-success, --color-warning, --color-danger
--radius: 0.5rem (store-configurable)
--shadow-sm / md / lg
```

Tailwind config maps these (`bg-primary`, `text-muted`, `rounded-theme`). Never use hardcoded brand colors in components.

### 4.2 Typography
- Max 2 font families (heading + body) loaded with `next/font` (no layout shift). Store may choose from a safe list.
- Scale: 12 / 14 / 16 / 18 / 24 / 32 / 48. Tight tracking on large headings, generous line-height on body.

### 4.3 Premium feel checklist
- Generous whitespace, consistent 4/8px spacing scale, max content width 1280px.
- Large, high-quality imagery with consistent aspect ratios (product 1:1 or 4:5), blur placeholders, `next/image`.
- Subtle motion only: hover lift on cards, image zoom on hover, fade/slide for drawers, 150-250ms ease. Respect `prefers-reduced-motion`.
- Sticky header with soft shadow on scroll; mega menu on desktop; full-screen drawer menu on mobile.
- Skeleton loaders instead of spinners for content.
- Clear visual hierarchy: one primary action per view. Pill badges for Sale / New / Out of stock.
- Consistent iconography (one icon set, e.g. `lucide-react`).
- Dark mode optional (tokens make it easy), not required for v1.

### 4.4 Accessibility
Semantic HTML, visible focus rings, keyboard-navigable menus/drawers/modals (focus trap, Esc to close), `alt` text, label every input, contrast >= 4.5:1, touch targets >= 44px.

---

## 5. Pages and Sections

### Global layout
- **Announcement bar** (optional, from settings: "Free delivery over X")
- **Header:** logo (store logo or name), search, category nav / mega menu, account icon, cart icon with count
- **Footer:** about blurb, quick links, categories, contact (phone, email, address), social icons, payment badges, copyright
- **Floating WhatsApp button** (store number + prefilled message)
- **Breadcrumbs** on inner pages

### Home (`/`)
1. Hero banner carousel (banners API: image, title, subtitle, CTA, link)
2. Category grid / circles (main categories)
3. Featured products
4. New arrivals
5. Promo banner strip (second banner group)
6. Brand strip (logos)
7. Trust badges (COD, fast delivery, easy return, support)
8. Reviews / testimonials (optional)
9. Newsletter or WhatsApp CTA

Sections are **configurable**: render only if data exists; order and visibility later driven by store "homepage sections" setting.

### Shop (`/shop`), Category (`/category/[slug]`), Brand (`/brand/[slug]`)
- Title + breadcrumb, result count
- Filters: category tree, brand, price range, in-stock, size/color (variant options)
- Sort: latest, price low-high, price high-low
- Product grid (2 cols mobile, 3-4 desktop), pagination (URL based `?page=`)
- Filters in sidebar on desktop, drawer on mobile; state in URL query (shareable, SEO)
- Empty state when no results

### Search (`/search?q=`)
Server-rendered results using the same grid. Header search box with debounced suggestions (client). "No results" state with suggestions.

### Product details (`/product/[slug]`)
- Gallery: main image + thumbnails, zoom on hover, swipe on mobile
- Title, brand, rating summary
- Price: current price big; old price struck-through + Sale badge when `discount_price` exists; price changes with selected variant
- Variant picker: option groups (Size, Color). Unavailable/out-of-stock values disabled. Bags have no options.
- Stock badge: In stock / Only N left / Out of stock
- Quantity stepper + **Add to cart** (+ Buy now)
- WhatsApp "Ask about this product" link
- Tabs/accordion: Description, Delivery & returns, Reviews
- Reviews list + form (verified purchase badge; submission needs login; goes to admin approval)
- Related products
- SEO: dynamic title/description, Open Graph, JSON-LD `Product` (name, image, offers, availability)

### Cart (`/cart`) and Cart drawer
- Line items (image, name, variant label, unit price, quantity stepper, remove)
- Coupon input (validates via API)
- Summary: subtotal, discount, delivery estimate, total
- Empty state with "Continue shopping"
- Cart persisted in `localStorage` (non-sensitive: variant id, quantity). **Prices are never trusted from the cart**; the server recalculates at checkout.

### Checkout (`/checkout`)
- Contact: name, phone (`01XXXXXXXXX`), optional email
- Address: full address, district/area, delivery zone (drives delivery charge)
- Delivery method + charge
- Payment: Cash on Delivery (others hidden until enabled by store)
- Order note
- Order summary (sticky on desktop)
- Guest or logged-in (prefill from profile)
- Inline validation, disabled submit while loading, friendly server errors (out of stock, price changed)
- Capture **incomplete order** (name, phone, cart snapshot) when user leaves after typing phone

### Order success (`/order-success/[orderNumber]`)
Order number, summary, "what happens next", track link, continue shopping. Invoice download later.

### Track order (`/track-order`)
Order number + phone -> status timeline (Pending, Confirmed, Processing, Shipped, Delivered / Cancelled).

### Auth
- Login (phone + password), Register (name, phone, password, confirm)
- Tokens stored in **httpOnly cookie** set by Next.js route handlers; never exposed to JS
- Redirect back to the page the user came from

### Account (`/account/*`, protected)
- Profile (edit name/email/address, change password)
- My Orders (list with status badge, pagination)
- Order details (items, totals, timeline, invoice download, reorder)
- Delete account (anonymize) in settings

### Static pages
About, Contact (store phone, email, address, WhatsApp, optional form), Privacy, Terms, Return policy. Content comes from store settings so each store has its own.

### System pages
404 (`not-found.js`), error boundary (`error.js`), maintenance/store-suspended page.

---

## 6. Data Layer

### 6.1 Request flow
```
Server Component -> lib/api/storefront.js -> client.js
   -> fetch(API_URL + path, { headers: { "X-Store-Domain": <request host> } })
```
- Store domain = request `Host` (falls back to `DEFAULT_STORE_DOMAIN` on localhost).
- Use `next: { revalidate }` for caching; tag requests so admin changes can revalidate later.
- Central error handling: 404 -> `null` (use `notFound()`), 5xx -> throw (caught by `error.js`).

### 6.2 Environment variables (`.env.local`, never committed)
```
API_URL=http://127.0.0.1:8000/api/v1
DEFAULT_STORE_DOMAIN=test.local
NEXT_PUBLIC_API_ORIGIN=http://127.0.0.1:8000     # only for building image URLs
USE_MOCK=false
```
Provide `.env.example` with empty values.

### 6.3 Mock mode
When `USE_MOCK=true`, `lib/api/*` returns data from `lib/api/mock/*` with the **same shape** as the real API, so removing mocks later changes nothing in components.

### 6.4 API contract

**Already available (Laravel, `/api/v1`, header `X-Store-Domain`)**

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/store` | name, slug, currency |
| GET | `/categories` | main categories with `children` |
| GET | `/products` | params: `search, category, brand, featured, min_price, max_price, sort(latest/price_asc/price_desc), per_page(<=40), page` |
| GET | `/products/{slug}` | description, options, images, variants (no purchase price, stock capped at 10) |

Product list item: `id, name, slug, category{name,slug}, brand{name,slug}, image(path), min_price, max_price, has_discount, in_stock, is_featured`.
Variant: `id, sku, attributes{}, selling_price (old/regular), discount_price (new, nullable), in_stock, stock_quantity`.
Image URL = `NEXT_PUBLIC_API_ORIGIN + "/storage/" + path`.

**Planned (build UI against mocks first)**

| Endpoint | Purpose |
|---|---|
| `GET /store` (extended) | logo, favicon, colors, font, contact, WhatsApp, social, delivery settings, homepage sections |
| `GET /banners` | hero and promo banners |
| `GET /brands` | brand list |
| `GET /products/{slug}/reviews`, `POST /me/reviews` | reviews |
| `POST /coupons/validate` | coupon check |
| `POST /orders` | place order (guest or customer) |
| `POST /orders/track` | order number + phone |
| `POST /incomplete-orders` | abandoned checkout capture |
| `POST /auth/customer/register`, `/login`, `/logout`, `GET /me` | auth (exists in backend) |
| `GET /me/orders`, `/me/orders/{no}`, `PUT /me/profile` | account |

Response envelope everywhere: `{ success, message, data, meta, errors }`.

---

## 7. State Management

| State | Where |
|---|---|
| Store settings / theme | Server fetch in root layout, passed via `StoreProvider` (context) |
| Cart | `CartProvider` (context + reducer), persisted to `localStorage`, hydrated safely (avoid SSR mismatch) |
| Auth user | Server reads cookie; client gets minimal user via context |
| Filters/sort/page | URL query string |
| Toasts, drawers | small client context |

No Redux/Zustand needed for v1.

---

## 8. SEO and Performance

- `generateMetadata` on every page (title template `%s | StoreName`, description, canonical, Open Graph, Twitter).
- JSON-LD: `Product`, `BreadcrumbList`, `Organization`.
- `app/sitemap.js` (products, categories) and `app/robots.js`.
- `next/image` with `sizes`, `priority` only for above-the-fold, blur placeholder, lazy load rest.
- `next/font` for fonts. Avoid large client bundles; dynamic import heavy client parts (carousel, drawer).
- ISR/revalidate on list and product pages. Pagination via URL, never infinite scroll for SEO pages.
- Target Lighthouse >= 90 mobile (performance, accessibility, SEO).

---

## 9. Security Rules (frontend)

- No API secrets or tokens in client code; only `NEXT_PUBLIC_*` for public values.
- Auth via httpOnly cookie route handlers (BFF); CSRF-safe `SameSite`.
- Never render API/user text as HTML. Escape by default (React does).
- Validate on client for UX, but the backend is the authority.
- Do not show raw server errors; map to friendly messages.
- Never trust cart prices; show server-verified totals.

---

## 10. Build Order (skeleton first)

1. **Foundation:** layout, tokens, fonts, `ui/` components, `lib/api` with mock switch, `StoreProvider`.
2. **Layout shell:** Header (desktop + mobile), Footer, WhatsApp button, breadcrumbs, skeleton + error + 404 pages.
3. **Home** with all sections (mock data).
4. **Catalog:** Shop, Category, Brand, Search with filters/sort/pagination.
5. **Product details:** gallery, variant picker, price logic, reviews UI.
6. **Cart:** provider, drawer, page, coupon UI.
7. **Checkout** and **Order success**, **Track order** (mock submit).
8. **Auth and Account** pages.
9. **Static pages** (About, Contact, Policies).
10. **SEO** (metadata, JSON-LD, sitemap, robots), accessibility pass, responsive pass.
11. **Connect real API:** set `USE_MOCK=false`, add BFF route handlers, test end to end.

---

## 11. Definition of Done (per page)

- [ ] Responsive at 360, 768, 1280 widths
- [ ] Loading, error, empty states present
- [ ] SEO metadata set
- [ ] No hardcoded store name/colors/contact
- [ ] Keyboard and screen-reader friendly
- [ ] No console errors, no layout shift
- [ ] Works with real API response shape

---

## 12. Out of Scope for Skeleton (later)

Payment gateways (bKash, Nagad, SSLCommerz), wishlist, product compare, multi-language, dark mode, push notifications, SMS/OTP login, forgot password.
