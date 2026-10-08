import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getValidImageSrc(img) {
  if (!img) return null;
  if (typeof img === "string") {
    const trimmed = img.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof img === "object") {
    const url = img.url || img.image || img.src || img.path || img.image_url;
    if (typeof url === "string" && url.trim().length > 0) {
      return url.trim();
    }
  }
  return null;
}

