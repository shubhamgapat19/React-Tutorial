// ========================================
// SPREAD & REST OPERATORS - Practice Examples
// ========================================

console.log("=== Spread & Rest Operators ===\n");

// ========================================
// SPREAD OPERATOR (...)
// ========================================

// 1. SPREAD WITH ARRAYS
console.log("=== Array Spread ===");

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combining arrays
const combined = [...arr1, ...arr2];
console.log("Combined:", combined);

// Add elements
const withNew = [0, ...arr1, 3.5, ...arr2, 7];
console.log("With new elements:", withNew);

// Copy array (shallow copy)
const originalArr = [1, 2, 3];
const copiedArr = [...originalArr];
copiedArr.push(4);
console.log("Original:", originalArr); // [1, 2, 3] - unchanged!
console.log("Copied:", copiedArr);     // [1, 2, 3, 4]

// 2. SPREAD WITH OBJECTS
console.log("\n=== Object Spread ===");

const user = {
  name: "John",
  age: 28
};

const address = {
  city: "Mumbai",
  country: "India"
};

// Merge objects
const userWithAddress = { ...user, ...address };
console.log("Merged:", userWithAddress);

// Update properties (immutable way)
const updatedUser = { ...user, age: 29, email: "john@example.com" };
console.log("Original user:", user);    // age still 28
console.log("Updated user:", updatedUser); // age is 29

// Override properties (order matters!)
const defaults = { theme: "light", lang: "en" };
const userPrefs = { theme: "dark" };
const finalPrefs = { ...defaults, ...userPrefs };
console.log("Final preferences:", finalPrefs); // theme is "dark"

// 3. REACT STATE UPDATE PATTERN
console.log("\n=== React State Pattern ===");

// Simulating React state
let state = {
  user: { name: "Alice", age: 25 },
  isLoggedIn: false,
  theme: "light"
};

// Update nested object immutably
state = {
  ...state,
  user: { ...state.user, age: 26 },
  isLoggedIn: true
};

console.log("Updated state:", state);

// 4. ARRAY MANIPULATION (React Lists)
console.log("\n=== Immutable Array Operations ===");

let todos = [
  { id: 1, text: "Learn React", done: false },
  { id: 2, text: "Build project", done: false }
];

// Add item
todos = [...todos, { id: 3, text: "Deploy app", done: false }];
console.log("Added todo:", todos);

// Remove item (filter)
todos = todos.filter(todo => todo.id !== 2);
console.log("Removed todo:", todos);

// Update item
todos = todos.map(todo =>
  todo.id === 1 ? { ...todo, done: true } : todo
);
console.log("Updated todo:", todos);

// ========================================
// REST OPERATOR (...)
// ========================================

// 5. FUNCTION PARAMETERS
console.log("\n=== Rest in Functions ===");

// Variable number of arguments
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log("Sum of 1,2,3:", sum(1, 2, 3));
console.log("Sum of 1,2,3,4,5:", sum(1, 2, 3, 4, 5));

// Mix regular params with rest
function introduce(greeting, ...names) {
  return `${greeting} ${names.join(", ")}!`;
}

console.log(introduce("Hello", "Alice", "Bob", "Charlie"));

// 6. REST WITH DESTRUCTURING
console.log("\n=== Rest with Destructuring ===");

// Array destructuring
const [first, second, ...others] = [1, 2, 3, 4, 5, 6];
console.log("First:", first);
console.log("Second:", second);
console.log("Others:", others);

// Object destructuring
const person = {
  name: "John",
  age: 30,
  city: "Pune",
  country: "India",
  email: "john@example.com"
};

const { name, age, ...contactInfo } = person;
console.log("Name & Age:", name, age);
console.log("Contact Info:", contactInfo);

// 7. REACT PROPS PATTERN
console.log("\n=== React Props Pattern ===");

// Simulating React component
function Button({ variant, size, ...otherProps }) {
  console.log("Button props:", { variant, size });
  console.log("Other props (onClick, disabled, etc.):", otherProps);
}

Button({
  variant: "primary",
  size: "large",
  onClick: () => console.log("Clicked!"),
  disabled: false,
  className: "custom-btn"
});

// 8. SPREADING INTO FUNCTION CALLS
console.log("\n=== Spread in Function Calls ===");

const numbers = [5, 10, 15, 20];

// Old way
console.log("Max (old):", Math.max.apply(null, numbers));

// Spread way
console.log("Max (spread):", Math.max(...numbers));
console.log("Min (spread):", Math.min(...numbers));

// 9. STRING TO ARRAY
console.log("\n=== String Spread ===");

const str = "React";
const chars = [...str];
console.log("Characters:", chars);

// 10. SHALLOW COPY WARNING
console.log("\n=== Shallow Copy Warning ===");

const original = {
  name: "John",
  address: {
    city: "Mumbai"
  }
};

const copy = { ...original };
copy.address.city = "Pune"; // This modifies original too!

console.log("Original city:", original.address.city); // "Pune" - changed!
console.log("Copy city:", copy.address.city);

// Deep copy for nested objects
const deepCopy = {
  ...original,
  address: { ...original.address }
};
deepCopy.address.city = "Delhi";
console.log("Original after deep copy:", original.address.city); // Still "Pune"
console.log("Deep copy city:", deepCopy.address.city); // "Delhi"

// ========================================
// REAL-WORLD EXAMPLES
// ========================================

console.log("\n=== Real-World Examples ===");

// Example 1: Form handling
function updateFormField(formData, fieldName, value) {
  return { ...formData, [fieldName]: value };
}

let form = { username: "", email: "", password: "" };
form = updateFormField(form, "username", "john_doe");
form = updateFormField(form, "email", "john@example.com");
console.log("Form data:", form);

// Example 2: Merge configurations
const defaultConfig = {
  timeout: 5000,
  retries: 3,
  cache: true
};

const userConfig = {
  timeout: 10000,
  debug: true
};

const finalConfig = { ...defaultConfig, ...userConfig };
console.log("Final config:", finalConfig);

// Example 3: Shopping cart
let cart = [];

function addToCart(...items) {
  cart = [...cart, ...items];
}

addToCart(
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Mouse", price: 500 }
);
console.log("Cart:", cart);

// ========================================
// EXERCISES
// ========================================

console.log("\n=== Practice Exercises ===");

// Exercise 1: Create a function that accepts any number of strings
// and returns them joined with spaces
// Your answer:


// Exercise 2: Update this user object to change the city to "Delhi"
// without mutating the original
const userEx2 = { name: "Alice", age: 25, city: "Mumbai" };
// Your answer:


// Exercise 3: Combine these three arrays into one
const arr1Ex3 = [1, 2];
const arr2Ex3 = [3, 4];
const arr3Ex3 = [5, 6];
// Your answer:


// Exercise 4: Extract 'id' and collect all other properties
const product = { id: 101, name: "Phone", price: 30000, brand: "Samsung" };
// Your answer:


// Exercise 5: Create a function that takes an array and returns
// a new array with the first element removed (without mutating original)
// Your answer:


console.log("\n=== End of Practice ===");
