// ========================================
// DESTRUCTURING - Practice Examples
// ========================================

console.log("=== Destructuring Practice ===\n");

// 1. ARRAY DESTRUCTURING
const colors = ["red", "green", "blue", "yellow"];

// Old way
const firstColor = colors[0];
const secondColor = colors[1];

// Destructuring way
const [first, second, third] = colors;
console.log("First color:", first);
console.log("Second color:", second);

// Skip elements
const [primary, , tertiary] = colors;
console.log("Skip example:", primary, tertiary);

// Default values
const [a, b, c, d, e = "default"] = colors;
console.log("With default:", e);

// 2. OBJECT DESTRUCTURING
const user = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  age: 28,
  city: "Mumbai"
};

// Extract specific properties
const { name, email, age } = user;
console.log("\n=== Object Destructuring ===");
console.log(`${name} (${age}): ${email}`);

// Rename variables
const { name: userName, email: userEmail } = user;
console.log("Renamed:", userName, userEmail);

// Default values
const { country = "India", city } = user;
console.log("With default:", city, country);

// 3. NESTED DESTRUCTURING
const product = {
  id: 101,
  title: "Laptop",
  price: 50000,
  specs: {
    ram: "16GB",
    storage: "512GB SSD",
    processor: "Intel i7"
  },
  tags: ["electronics", "computers", "sale"]
};

// Nested object
const { 
  title, 
  specs: { ram, processor },
  tags: [firstTag, secondTag]
} = product;

console.log("\n=== Nested Destructuring ===");
console.log(`${title}: ${ram}, ${processor}`);
console.log("Tags:", firstTag, secondTag);

// 4. FUNCTION PARAMETERS - CRUCIAL FOR REACT!
// Old way
function displayUser(user) {
  console.log(user.name + " is " + user.age + " years old");
}

// Destructuring in parameters
function displayUserModern({ name, age, city = "Unknown" }) {
  console.log(`${name} is ${age} years old from ${city}`);
}

console.log("\n=== Function Parameters ===");
displayUserModern(user);

// React component pattern
function UserCard({ name, email, isActive = true }) {
  return `User: ${name}, Email: ${email}, Active: ${isActive}`;
}

console.log(UserCard({ name: "Alice", email: "alice@test.com" }));

// 5. REST OPERATOR WITH DESTRUCTURING
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log("\n=== Rest with Array ===");
console.log("Head:", head);
console.log("Tail:", tail);

const { id, ...otherDetails } = user;
console.log("\n=== Rest with Object ===");
console.log("ID:", id);
console.log("Other details:", otherDetails);

// 6. SWAPPING VARIABLES
let x = 1;
let y = 2;
console.log("\n=== Swap Variables ===");
console.log("Before:", { x, y });

[x, y] = [y, x];
console.log("After:", { x, y });

// 7. REACT PATTERNS - useState destructuring
// Simulating React's useState
function useState(initialValue) {
  let state = initialValue;
  const setState = (newValue) => {
    state = newValue;
  };
  return [state, setState];
}

const [count, setCount] = useState(0);
console.log("\n=== React useState Pattern ===");
console.log("Count:", count);

// 8. DESTRUCTURING IN LOOPS
const users = [
  { id: 1, name: "Alice", role: "Admin" },
  { id: 2, name: "Bob", role: "User" },
  { id: 3, name: "Charlie", role: "Moderator" }
];

console.log("\n=== Destructuring in Loops ===");
for (const { name, role } of users) {
  console.log(`${name}: ${role}`);
}

// 9. API RESPONSE HANDLING
const apiResponse = {
  status: 200,
  data: {
    users: [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" }
    ],
    total: 2
  },
  message: "Success"
};

const { 
  status, 
  data: { users: userList, total },
  message 
} = apiResponse;

console.log("\n=== API Response ===");
console.log(`Status ${status}: ${message}`);
console.log(`Found ${total} users:`, userList);

// ========================================
// EXERCISES
// ========================================

console.log("\n=== Practice Exercises ===");

// Exercise 1: Extract city and country from address
const address = {
  street: "123 Main St",
  city: "Pune",
  state: "Maharashtra",
  country: "India",
  pincode: "411001"
};
// Your answer:


// Exercise 2: Get first 2 items and rest in separate variables
const fruits = ["apple", "banana", "orange", "mango", "grape"];
// Your answer:


// Exercise 3: Create a function that takes an object with name, price, discount
// and returns the final price (price - discount)
// Use destructuring in parameters
// Your answer:


// Exercise 4: Extract only email and phone from this nested object
const contact = {
  person: {
    name: "John",
    details: {
      email: "john@example.com",
      phone: "9876543210"
    }
  }
};
// Your answer:


console.log("\n=== End of Practice ===");
