/**
 * Client-Side Automatic WebP Image Converter & Compressor
 * Takes any image (JPG, PNG, HEIC, GIF, etc.) and converts it to a high-quality WebP blob.
 *
 * @param {File} file - Original user-uploaded file
 * @param {object} [options]
 * @param {number} [options.maxWidth=1800] - Max width constraint (maintaining aspect ratio)
 * @param {number} [options.maxHeight=2400] - Max height constraint
 * @param {number} [options.quality=0.88] - WebP compression quality (0.0 to 1.0)
 * @returns {Promise<{ file: File, previewUrl: string, originalSize: number, webpSize: number, savings: string }>}
 */
export async function convertToWebP(file, options = {}) {
  const { maxWidth = 1800, maxHeight = 2400, quality = 0.88 } = options;

  // If running on server or unsupported environment, return original
  if (typeof window === "undefined" || !window.FileReader) {
    return { file, previewUrl: URL.createObjectURL(file), originalSize: file.size, webpSize: file.size, savings: "0%" };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        // Calculate proportional dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // Draw to offscreen HTML5 canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          return reject(new Error("Canvas context initialization failed"));
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("WebP conversion failed"));
            }

            // Create new File with .webp extension
            const originalName = file.name.replace(/\.[^/.]+$/, "");
            const webpFileName = `${originalName}.webp`;
            const webpFile = new File([blob], webpFileName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            const originalSize = file.size;
            const webpSize = webpFile.size;
            const savings =
              originalSize > webpSize
                ? `${Math.round(((originalSize - webpSize) / originalSize) * 100)}%`
                : "0%";

            const previewUrl = URL.createObjectURL(blob);

            resolve({
              file: webpFile,
              previewUrl,
              originalSize,
              webpSize,
              savings,
              width,
              height,
            });
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load source image into canvas"));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read input file"));
    reader.readAsDataURL(file);
  });
}
