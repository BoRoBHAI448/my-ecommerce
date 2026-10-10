import {
  getBanners,
  getCategories,
  getBrands,
  getProducts,
} from "@/lib/api/storefront";
import { LuxuryEditorialHero } from "@/components/home/LuxuryEditorialHero";
import { EditorialTicker } from "@/components/home/EditorialTicker";
import { RethinkWardrobeSection } from "@/components/home/RethinkWardrobeSection";
import { GenderSplitBanner } from "@/components/home/GenderSplitBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BrandStrip } from "@/components/home/BrandStrip";
import { TrustBadges } from "@/components/home/TrustBadges";
import { Newsletter } from "@/components/home/Newsletter";

export default async function HomePage() {


  const [bannersRes, categoriesRes, brandsRes, featuredRes, newArrivalsRes] =
    await Promise.all([
      getBanners(),
      getCategories(),
      getBrands(),
      getProducts({ featured: true, per_page: 8 }),
      getProducts({ sort: "latest", per_page: 8 }),
    ]);

  const banners = bannersRes?.data || { hero: [], promo: [] };
  const categories = categoriesRes?.data || [];
  const brands = brandsRes?.data || [];
  const featuredProducts = featuredRes?.data || [];
  const newArrivals = newArrivalsRes?.data || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Luxury Editorial Brand Hero */}
      <LuxuryEditorialHero brandName="Ligloo" categories={categories} />

      {/* 2. Infinite Editorial Runway Marquee */}
      <EditorialTicker text="FIND YOUR CHOICE" />

      {/* 3. Rethink Your Wardrobe (Matches screenshot) */}
      <RethinkWardrobeSection />

      {/* 4. Women & Men Editorial Split Showcase (Matches screenshot) */}
      <GenderSplitBanner />

      {/* 5. Main Categories Grid */}
      <CategoryGrid categories={categories} />

      {/* 3. Featured Products */}
      <FeaturedSection
        title="FIND YOUR SEASON EDIT"
        subtitle="Rethink Your Wardrobe"
        viewAllLink="/shop?featured=true"
        products={featuredProducts}
      />

      {/* 4. Promo Banners Strip */}
      <PromoBanner banners={banners.promo} />

      {/* 5. New Arrivals */}
      <FeaturedSection
        title="New Season Arrivals"
        subtitle="Fresh drops straight from our atelier"
        viewAllLink="/shop?sort=latest"
        products={newArrivals}
      />

      {/* 6. Partner Brands Strip */}
      <BrandStrip brands={brands} />

      {/* 7. Trust Badges & Guarantees */}
      <TrustBadges />

      {/* 8. Newsletter & WhatsApp CTA */}
      <Newsletter />
    </div>
  );
}
