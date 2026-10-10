/**
 * Helper to generate page metadata with uniform title template and OpenGraph attributes
 */
export function constructMetadata({
  title = "Ligloo — Quiet Tailoring & Modern Luxury",
  description = "Discover curated collections of apparel, footwear, and handcrafted leather accessories.",
  image = "/og-image.jpg",
  icons = "/favicon.ico",
  noIndex = false,
} = {}) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
