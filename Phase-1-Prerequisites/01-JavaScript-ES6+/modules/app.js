// ========================================
// MAIN APP - Importing and Using Modules
// ========================================

console.log("=== ES6 Modules Demo ===\n");

// 1. NAMED IMPORTS
import { add, subtract, multiply, PI, square } from './math-utils.js';

console.log("=== Named Imports ===");
console.log("add(5, 3):", add(5, 3));
console.log("subtract(10, 4):", subtract(10, 4));
console.log("multiply(6, 7):", multiply(6, 7));
console.log("PI:", PI);
console.log("square(9):", square(9));

// 2. IMPORT WITH RENAME
import { pow as power } from './math-utils.js';
console.log("\n=== Renamed Import ===");
console.log("power(2, 8):", power(2, 8));

// 3. DEFAULT IMPORT
import User from './User.js';

console.log("\n=== Default Import ===");
const user1 = new User("Rajesh Kumar", "rajesh@example.com", 28);
console.log(user1.greet());
console.log("User info:", user1.getInfo());
console.log("Is adult?", user1.isAdult());

// 4. MIXED IMPORTS (default + named)
import { USER_ROLES, createUser } from './User.js';

console.log("\n=== Mixed Imports ===");
console.log("User Roles:", USER_ROLES);
const user2 = createUser("Priya Sharma", "priya@example.com", 25);
console.log(user2.greet());

// 5. IMPORT MULTIPLE
import { 
  API_BASE_URL, 
  HTTP_STATUS, 
  COLORS,
  ROUTES 
} from './constants.js';

console.log("\n=== Multiple Named Imports ===");
console.log("API URL:", API_BASE_URL);
console.log("Success Status:", HTTP_STATUS.OK);
console.log("Primary Color:", COLORS.PRIMARY);
console.log("Dashboard Route:", ROUTES.DASHBOARD);

// 6. IMPORT ALL AS NAMESPACE
import * as MathUtils from './math-utils.js';

console.log("\n=== Import All (Namespace) ===");
console.log("MathUtils.add(10, 5):", MathUtils.add(10, 5));
console.log("MathUtils.cube(3):", MathUtils.cube(3));
console.log("MathUtils.PI:", MathUtils.PI);

// 7. DEFAULT + NAMED FROM HELPERS
import Helpers, { formatCurrency, formatDate, generateId } from './helpers.js';

console.log("\n=== Helpers Module ===");
console.log("Format currency:", formatCurrency(1000));
console.log("Format date:", formatDate(new Date()));
console.log("Generate ID:", generateId());
console.log("Using default:", Helpers.truncateText("This is a very long text that needs truncating", 20));

// 8. PRACTICAL REACT PATTERNS
console.log("\n=== React Patterns ===");

// Pattern 1: Component imports
// import React, { useState, useEffect } from 'react';
// import { Button, Card, Modal } from './components';
// import Header from './components/Header';

// Pattern 2: Utility imports
// import { formatCurrency, debounce } from './utils/helpers';
// import { API_BASE_URL } from './constants';

// Pattern 3: Style imports
// import styles from './App.module.css';
// import './global.css';

console.log("These patterns are used in React projects!");

// 9. DYNAMIC IMPORTS (Code Splitting)
console.log("\n=== Dynamic Imports ===");

// Dynamic import returns a Promise
async function loadMathUtils() {
  const module = await import('./math-utils.js');
  console.log("Dynamically loaded add:", module.add(100, 200));
}

loadMathUtils();

// 10. RE-EXPORTING (Barrel Exports)
console.log("\n=== Barrel Pattern ===");
// In a real project, you might have index.js:
// 
// // index.js (barrel file)
// export { add, subtract, multiply } from './math-utils';
// export { default as User } from './User';
// export * from './constants';
//
// Then import everything from one place:
// import { add, User, API_BASE_URL } from './modules';

console.log("\n=== Summary ===");
console.log("✓ Named exports: import { name } from './module'");
console.log("✓ Default exports: import Name from './module'");
console.log("✓ Mixed: import Default, { named } from './module'");
console.log("✓ All: import * as Namespace from './module'");
console.log("✓ Rename: import { old as new } from './module'");
console.log("✓ Dynamic: const module = await import('./module')");

// ========================================
// EXERCISES
// ========================================

console.log("\n=== Practice Exercises ===");

// Exercise 1: Create a new module 'array-utils.js' with functions:
// - getUnique(arr) - returns unique elements
// - sortAsc(arr) - sorts in ascending order
// - sortDesc(arr) - sorts in descending order
// Export them as named exports

// Exercise 2: Create 'Product.js' with a Product class
// Properties: id, name, price, category
// Methods: getDiscount(percent), getInfo()
// Export as default

// Exercise 3: Create 'index.js' (barrel file) that re-exports:
// - All functions from math-utils
// - User class from User
// - All constants from constants
// - Default helpers from helpers

// Exercise 4: Import and use your new modules in a new file 'main.js'

console.log("\n=== End of Demo ===");
