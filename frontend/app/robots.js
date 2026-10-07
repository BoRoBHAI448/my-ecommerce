export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/api/"],
    },
    sitemap: "https://apexcart.com/sitemap.xml",
  };
}
