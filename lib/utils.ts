import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number into a compact string representation (K, M, B, T).
 * Uses Intl.NumberFormat for locale-aware formatting.
 * @param value The number to format
 * @returns A compact string representation of the number
 */
export function formatCompactNumber(value: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  });

  return formatter.format(value);
}

/**
 * Formats a number as currency with optional compact notation.
 * Uses Intl.NumberFormat for locale-aware currency formatting.
 * @param value The number to format
 * @param compact Whether to use compact notation for large numbers
 * @param defaultDecimals Number of decimal places for non-compact numbers
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, compact: boolean = true, defaultDecimals: number = 2): string {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
  };

  if (compact && Math.abs(value) >= 1000) {
    options.notation = 'compact';
    options.compactDisplay = 'short';
    options.maximumFractionDigits = 1;
  } else {
    options.minimumFractionDigits = defaultDecimals;
    options.maximumFractionDigits = defaultDecimals;
  }

  const formatter = new Intl.NumberFormat('en-US', options);
  return formatter.format(value);
}
