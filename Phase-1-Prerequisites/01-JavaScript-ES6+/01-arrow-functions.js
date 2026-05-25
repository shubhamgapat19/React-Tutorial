// ========================================
// ARROW FUNCTIONS - Practice Examples
// ========================================

console.log("=== Arrow Functions Practice ===\n");

// 1. BASIC SYNTAX
// Regular function
function regularAdd(a, b) {
  return a + b;
}

// Arrow function - concise
const arrowAdd = (a, b) => a + b;

// Arrow function - with block body
const arrowAddVerbose = (a, b) => {
  const result = a + b;
  return result;
};

console.log("Regular:", regularAdd(5, 3));
console.log("Arrow:", arrowAdd(5, 3));
console.log("Arrow Verbose:", arrowAddVerbose(5, 3));

// 2. SINGLE PARAMETER (no parentheses needed)
const square = x => x * x;
const greet = name => `Hello, ${name}!`;

console.log("\nSquare of 5:", square(5));
console.log(greet("React Developer"));

// 3. ARRAY METHODS - Where arrows shine!
const numbers = [1, 2, 3, 4, 5];

// map
const doubled = numbers.map(num => num * 2);
console.log("\nDoubled:", doubled);

// filter
const evens = numbers.filter(num => num % 2 === 0);
console.log("Evens:", evens);

// reduce
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log("Sum:", sum);

// 4. THIS BINDING - Important for React!
const person = {
  name: "John",
  hobbies: ["coding", "reading", "gaming"],
  
  // Regular function - has its own 'this'
  printHobbiesRegular: function() {
    this.hobbies.forEach(function(hobby) {
      // 'this' is undefined here!
      // console.log(this.name + " likes " + hobby); // ERROR
    });
  },
  
  // Arrow function - inherits 'this' from parent
  printHobbiesArrow: function() {
    this.hobbies.forEach(hobby => {
      console.log(`${this.name} likes ${hobby}`);
    });
  }
};

console.log("\n=== This Binding ===");
person.printHobbiesArrow();

// 5. PRACTICAL REACT PATTERNS
// Event handlers
const handleClick = (event) => {
  console.log("\nButton clicked:", event);
};

// Callbacks
const fetchData = (url) => {
  return fetch(url)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error(error));
};

// 6. WHEN NOT TO USE ARROWS
const calculator = {
  value: 0,
  
  // DON'T use arrow for object methods
  // increment: () => {
  //   this.value++; // 'this' won't refer to calculator!
  // },
  
  // DO use regular function
  increment: function() {
    this.value++;
    return this.value;
  }
};

console.log("\n=== Object Methods ===");
console.log("Incremented:", calculator.increment());

// ========================================
// EXERCISES - Try these!
// ========================================

console.log("\n=== Practice Exercises ===");

// Exercise 1: Convert to arrow function
function multiply(a, b) {
  return a * b;
}
// Your answer:


// Exercise 2: Use map with arrow function to convert Celsius to Fahrenheit
const celsiusTemps = [0, 10, 20, 30, 40];
// Formula: (C * 9/5) + 32
// Your answer:


// Exercise 3: Filter array to get only names starting with 'A'
const names = ["Alice", "Bob", "Andrew", "Charlie", "Anna"];
// Your answer:


// Exercise 4: Use reduce to find the maximum number
const nums = [45, 23, 89, 12, 67, 34];
// Your answer:


console.log("\n=== End of Practice ===");
