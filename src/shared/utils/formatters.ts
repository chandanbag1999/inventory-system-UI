// ============================================================
// FORMATTERS - Date, Currency, Number utilities
// src/shared/utils/formatters.ts
// ============================================================

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// ─── Currency ────────────────────────────────────────────────
export const formatCurrency = (
  amount: number,
  currency = 'INR',
  locale  = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style:                 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatINR = (amount: number): string =>
  '₹' + new Intl.NumberFormat('en-IN').format(amount);

export const formatCompactINR = (amount: number): string => {
  if (amount >= 10_000_000) return '₹' + (amount / 10_000_000).toFixed(1) + 'Cr';
  if (amount >= 100_000)    return '₹' + (amount / 100_000).toFixed(1)    + 'L';
  if (amount >= 1_000)      return '₹' + (amount / 1_000).toFixed(1)      + 'K';
  return '₹' + amount;
};

// ─── Numbers ─────────────────────────────────────────────────
export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-IN').format(n);

export const formatCompact = (n: number): string => {
  if (n >= 10_000_000) return (n / 10_000_000).toFixed(1) + 'Cr';
  if (n >= 100_000)    return (n / 100_000).toFixed(1)    + 'L';
  if (n >= 1_000)      return (n / 1_000).toFixed(1)      + 'K';
  return String(n);
};

export const formatPercent = (value: number, decimals = 1): string =>
  value.toFixed(decimals) + '%';

// ─── Dates ───────────────────────────────────────────────────
export const formatDate = (
  date: string | Date,
  fmt = 'dd MMM yyyy'
): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '—';
    return format(d, fmt);
  } catch {
    return '—';
  }
};

export const formatDateTime = (date: string | Date): string =>
  formatDate(date, 'dd MMM yyyy, hh:mm a');

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '—';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '—';
  }
};

export const formatShortDate = (date: string | Date): string =>
  formatDate(date, 'dd MMM');

export const formatMonthYear = (date: string | Date): string =>
  formatDate(date, 'MMM yyyy');

// ─── Status ──────────────────────────────────────────────────
export const formatStatus = (status: string): string =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Phone ───────────────────────────────────────────────────
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return '+91 ' + cleaned.slice(0, 5) + ' ' + cleaned.slice(5);
  }
  return phone;
};

// ─── File Size ───────────────────────────────────────────────
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k    = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i    = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ─── Duration ────────────────────────────────────────────────
export const formatDuration = (minutes: number): string => {
  if (minutes < 60)   return minutes + 'm';
  const hrs = Math.floor(minutes / 60);
  const min = minutes % 60;
  return min > 0 ? hrs + 'h ' + min + 'm' : hrs + 'h';
};
