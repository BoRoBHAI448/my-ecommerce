/**
 * Validate Bangladeshi phone number (11 digits, starts with 01)
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidBDPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^01[3-9]\d{8}$/.test(cleaned);
}

/**
 * Validate standard email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Check if a value is non-empty
 * @param {any} val
 * @returns {boolean}
 */
export function isRequired(val) {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return true;
}
