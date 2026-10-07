import { getCategories, getProducts } from "@/lib/api/storefront";

export default async function sitemap() {
  const baseUrl = "https://apexcart.com";

  const [categoriesRes, productsRes] = await Promise.all([
    getCategories(),
    getProducts({ per_page: 40 }),
  ]);

  const categories = categoriesRes?.data || [];
  const products = productsRes?.data || [];

  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/return-policy",
    "/track-order",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: "2026-10-01",
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: "2026-10-01",
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: "2026-10-01",
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
