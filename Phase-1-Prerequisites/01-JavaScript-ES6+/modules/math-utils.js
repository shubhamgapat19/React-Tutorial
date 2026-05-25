// ========================================
// NAMED EXPORTS - Multiple exports from one file
// ========================================

// Export individual items
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const multiply = (a, b) => a * b;

export const divide = (a, b) => {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
};

// Export at the end (alternative style)
const square = (x) => x * x;
const cube = (x) => x * x * x;

export { square, cube };

// Export with rename
const power = (base, exponent) => Math.pow(base, exponent);
export { power as pow };

// This won't be exported (private to this module)
const privateHelper = (x) => x * 2;

console.log("math-utils.js loaded");
