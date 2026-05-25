// ========================================
// MIXED EXPORTS - Default + Named
// ========================================

// Utility functions

export function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency
  }).format(amount);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Default export - main utility object
const Helpers = {
  formatCurrency,
  formatDate,
  truncateText,
  generateId,
  debounce
};

export default Helpers;

console.log("helpers.js loaded");
