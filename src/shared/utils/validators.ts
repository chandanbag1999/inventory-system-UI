// ============================================================
// VALIDATORS - GST, Phone, Email, etc.
// src/shared/utils/validators.ts
// ============================================================

// ─── GST ─────────────────────────────────────────────────────
export const validateGSTIN = (gstin: string): boolean => {
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(gstin.toUpperCase());
};

export const validatePAN = (pan: string): boolean => {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return regex.test(pan.toUpperCase());
};

// ─── Phone ───────────────────────────────────────────────────
export const validateIndianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned) ||
         /^91[6-9]\d{9}$/.test(cleaned);
};

// ─── Email ───────────────────────────────────────────────────
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── Pincode ─────────────────────────────────────────────────
export const validatePincode = (pin: string): boolean =>
  /^[1-9][0-9]{5}$/.test(pin);

// ─── SKU ─────────────────────────────────────────────────────
export const validateSKU = (sku: string): boolean =>
  /^[A-Za-z0-9-]{2,30}$/.test(sku);

// ─── HSN ─────────────────────────────────────────────────────
export const validateHSN = (hsn: string): boolean =>
  /^[0-9]{4}([0-9]{2}([0-9]{2})?)?$/.test(hsn);

// ─── Password ────────────────────────────────────────────────
export const validatePassword = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  if (password.length < 8)           errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password))       errors.push('One uppercase letter');
  if (!/[a-z]/.test(password))       errors.push('One lowercase letter');
  if (!/[0-9]/.test(password))       errors.push('One number');
  if (!/[^A-Za-z0-9]/.test(password))errors.push('One special character');
  return { valid: errors.length === 0, errors };
};

// ─── URL ─────────────────────────────────────────────────────
export const validateURL = (url: string): boolean => {
  try { new URL(url); return true; } catch { return false; }
};

// ─── IFSC ────────────────────────────────────────────────────
export const validateIFSC = (ifsc: string): boolean =>
  /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
