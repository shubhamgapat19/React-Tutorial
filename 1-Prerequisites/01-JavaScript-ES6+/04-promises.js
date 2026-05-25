// ========================================
// PROMISES - Practice Examples
// ========================================

console.log("=== Promises Practice ===\n");

// 1. BASIC PROMISE CREATION
console.log("=== Creating Promises ===");

const simplePromise = new Promise((resolve, reject) => {
  const success = true;
  
  setTimeout(() => {
    if (success) {
      resolve("Operation successful!");
    } else {
      reject("Operation failed!");
    }
  }, 1000);
});

simplePromise
  .then(result => console.log("✓", result))
  .catch(error => console.error("✗", error));

// 2. PROMISE STATES
console.log("\n=== Promise States ===");

// Pending
const pendingPromise = new Promise((resolve) => {
  setTimeout(() => resolve("Done"), 2000);
});
console.log("Status: Pending...");

// Fulfilled
const fulfilledPromise = Promise.resolve("Already resolved");
fulfilledPromise.then(value => console.log("Fulfilled:", value));

// Rejected
const rejectedPromise = Promise.reject("Already rejected");
rejectedPromise.catch(error => console.log("Rejected:", error));

// 3. CHAINING PROMISES
console.log("\n=== Promise Chaining ===");

function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "John Doe" });
    }, 500);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Post 1", userId },
        { id: 2, title: "Post 2", userId }
      ]);
    }, 500);
  });
}

function fetchComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: "Great post!", postId },
        { id: 2, text: "Thanks for sharing", postId }
      ]);
    }, 500);
  });
}

// Chaining example
fetchUser(1)
  .then(user => {
    console.log("User:", user);
    return fetchPosts(user.id);
  })
  .then(posts => {
    console.log("Posts:", posts);
    return fetchComments(posts[0].id);
  })
  .then(comments => {
    console.log("Comments:", comments);
  })
  .catch(error => {
    console.error("Error in chain:", error);
  })
  .finally(() => {
    console.log("Chain completed!");
  });

// 4. PROMISE.ALL - Parallel Execution
console.log("\n=== Promise.all ===");

const promise1 = Promise.resolve(10);
const promise2 = new Promise(resolve => setTimeout(() => resolve(20), 1000));
const promise3 = new Promise(resolve => setTimeout(() => resolve(30), 500));

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log("All results:", results); // [10, 20, 30]
    const sum = results.reduce((a, b) => a + b, 0);
    console.log("Sum:", sum);
  });

// If one fails, all fail
const promiseWithFailure = Promise.all([
  Promise.resolve(1),
  Promise.reject("Error!"),
  Promise.resolve(3)
]);

promiseWithFailure.catch(error => {
  console.log("Promise.all failed:", error);
});

// 5. PROMISE.ALLSETTLED - Wait for all regardless
console.log("\n=== Promise.allSettled ===");

Promise.allSettled([
  Promise.resolve(100),
  Promise.reject("Failed"),
  Promise.resolve(200)
]).then(results => {
  console.log("All settled:", results);
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Promise ${index}: Success -`, result.value);
    } else {
      console.log(`Promise ${index}: Failed -`, result.reason);
    }
  });
});

// 6. PROMISE.RACE - First wins
console.log("\n=== Promise.race ===");

const slow = new Promise(resolve => setTimeout(() => resolve("Slow"), 2000));
const fast = new Promise(resolve => setTimeout(() => resolve("Fast"), 500));

Promise.race([slow, fast])
  .then(winner => console.log("Winner:", winner)); // "Fast"

// 7. REAL-WORLD: API CALLS
console.log("\n=== Simulating API Calls ===");

function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint.includes("error")) {
        reject(`Failed to fetch ${endpoint}`);
      } else {
        resolve({ data: `Data from ${endpoint}`, status: 200 });
      }
    }, 1000);
  });
}

// Single API call
fetchAPI("/api/users")
  .then(response => console.log("API Response:", response))
  .catch(error => console.error("API Error:", error));

// Multiple API calls in parallel
Promise.all([
  fetchAPI("/api/users"),
  fetchAPI("/api/posts"),
  fetchAPI("/api/comments")
])
  .then(([users, posts, comments]) => {
    console.log("\n=== Parallel API Calls ===");
    console.log("Users:", users);
    console.log("Posts:", posts);
    console.log("Comments:", comments);
  })
  .catch(error => console.error("One API failed:", error));

// 8. ERROR HANDLING
console.log("\n=== Error Handling ===");

function riskyOperation() {
  return new Promise((resolve, reject) => {
    const random = Math.random();
    setTimeout(() => {
      if (random > 0.5) {
        resolve("Success! Value: " + random);
      } else {
        reject("Failed! Value: " + random);
      }
    }, 500);
  });
}

riskyOperation()
  .then(result => console.log(result))
  .catch(error => console.log("Caught:", error))
  .finally(() => console.log("Operation completed"));

// 9. PROMISE UTILITIES
console.log("\n=== Promise Utilities ===");

// Delay utility
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log("Waiting 1 second...");
delay(1000).then(() => console.log("1 second passed!"));

// Timeout utility
function timeout(promise, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject("Timeout!"), ms);
  });
  return Promise.race([promise, timeoutPromise]);
}

const slowPromise = delay(3000).then(() => "Slow response");
timeout(slowPromise, 2000)
  .then(result => console.log(result))
  .catch(error => console.log("Timeout error:", error));

// 10. REACT PATTERN: DATA FETCHING
console.log("\n=== React Data Fetching Pattern ===");

// Simulating a React useEffect data fetch
function fetchUserData(userId) {
  console.log("Fetching user data...");
  
  return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then(response => response.json())
    .then(data => {
      console.log("User data received:", data.name);
      return data;
    })
    .catch(error => {
      console.error("Failed to fetch user:", error);
      throw error;
    });
}

// This is how you'd use it in React useEffect
// useEffect(() => {
//   fetchUserData(1)
//     .then(data => setUser(data))
//     .catch(error => setError(error));
// }, []);

// ========================================
// EXERCISES
// ========================================

console.log("\n=== Practice Exercises ===");

// Exercise 1: Create a promise that resolves after 2 seconds
// with the message "Hello from the future!"
// Your answer:


// Exercise 2: Create a function that simulates fetching a product
// Returns: { id, name, price } after 1 second
// If id is negative, reject with "Invalid ID"
// Your answer:


// Exercise 3: Use Promise.all to fetch 3 users in parallel
// Users: ids 1, 2, 3
// Log all results together
// Your answer:


// Exercise 4: Create a retry function that attempts a promise
// up to 3 times before giving up
// Your answer:


// Exercise 5: Chain these operations:
// 1. Fetch user (id: 1)
// 2. Fetch their todos
// 3. Count completed todos
// 4. Log the count
// Your answer:


console.log("\n=== End of Practice ===");
