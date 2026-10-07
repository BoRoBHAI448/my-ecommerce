/**
 * Format currency amount with store currency code/symbol
 * @param {number|string} amount
 * @param {string} [currency='BDT']
 * @returns {string}
 */
export function formatPrice(amount, currency = "BDT") {
  const num = Number(amount);
  if (isNaN(num)) return "0";

  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);

  if (currency === "BDT") {
    return `৳${formattedNumber}`;
  }

  return `${currency} ${formattedNumber}`;
}

/**
 * Format date string to human-friendly format
 * @param {string|Date} dateString
 * @param {object} [options]
 * @returns {string}
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(date);
}

/**
 * Format discount percentage string
 * @param {number} original
 * @param {number} discounted
 * @returns {string}
 */
export function getDiscountPercentage(original, discounted) {
  if (!original || !discounted || original <= discounted) return null;
  const pct = Math.round(((original - discounted) / original) * 100);
  return `${pct}% OFF`;
}
