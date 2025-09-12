import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
  }).format(amount);
}

export function calculateStock(quantity, sold) {
  return Math.max(0, quantity - sold);
}

export function isInStock(quantity, sold) {
  return calculateStock(quantity, sold) > 0;
}

export function truncateText(text, maxLength = 60) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}