import { supabase } from "./client";
import { convertToWebP } from "@/lib/utils/image-converter";

/**
 * Uploads any product image to Supabase Storage after automatically converting to WebP.
 *
 * @param {File} file - Original image file (JPG, PNG, HEIC, etc.)
 * @param {string} [slug="product"] - Product slug used in filename
 * @returns {Promise<{ url: string, path: string, originalSize: number, webpSize: number, savings: string }>}
 */
export async function uploadProductImageToSupabase(file, slug = "product") {
  // 1. Convert to high-efficiency WebP format
  const { file: webpFile, originalSize, webpSize, savings } = await convertToWebP(file);

  // 2. Generate clean collision-resistant file path
  const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const filePath = `products/${sanitizedSlug}-${timestamp}-${randomSuffix}.webp`;

  // 3. Upload to Supabase Storage 'products' bucket
  const { data, error } = await supabase.storage
    .from("products")
    .upload(filePath, webpFile, {
      contentType: "image/webp",
      cacheControl: "31536000", // 1 year cache
      upsert: false,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    throw new Error(`Failed to upload to Supabase storage: ${error.message}`);
  }

  // 4. Retrieve public URL
  const { data: publicData } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  return {
    url: publicData.publicUrl,
    path: filePath,
    originalSize,
    webpSize,
    savings,
  };
}
