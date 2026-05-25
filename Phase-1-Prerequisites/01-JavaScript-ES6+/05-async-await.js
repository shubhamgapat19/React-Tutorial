// ========================================
// ASYNC/AWAIT - Practice Examples
// ========================================

console.log("=== Async/Await Practice ===\n");

// 1. BASIC ASYNC FUNCTION
console.log("=== Basic Async Function ===");

// Promise version
function getDataPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Data from promise"), 1000);
  });
}

// Async/await version
async function getDataAsync() {
  const data = await new Promise((resolve) => {
    setTimeout(() => resolve("Data from async/await"), 1000);
  });
  return data;
}

// Both return promises
getDataPromise().then(data => console.log(data));
getDataAsync().then(data => console.log(data));

// 2. ERROR HANDLING
console.log("\n=== Error Handling ===");

// With Promises
function fetchWithPromise(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error("Promise error:", error));
}

// With Async/Await
async function fetchWithAsync(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Async error:", error);
    throw error;
  }
}

// 3. SEQUENTIAL VS PARALLEL
console.log("\n=== Sequential vs Parallel ===");

function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// Sequential (slower - waits for each)
async function sequential() {
  console.time("Sequential");
  const a = await delay(1000, "A");
  const b = await delay(1000, "B");
  const c = await delay(1000, "C");
  console.timeEnd("Sequential"); // ~3 seconds
  return [a, b, c];
}

// Parallel (faster - all at once)
async function parallel() {
  console.time("Parallel");
  const [a, b, c] = await Promise.all([
    delay(1000, "A"),
    delay(1000, "B"),
    delay(1000, "C")
  ]);
  console.timeEnd("Parallel"); // ~1 second
  return [a, b, c];
}

sequential().then(result => console.log("Sequential result:", result));
parallel().then(result => console.log("Parallel result:", result));

// 4. REAL API CALLS
console.log("\n=== Real API Calls ===");

async function fetchUser(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
}

async function fetchUserPosts(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return [];
  }
}

// Chaining async calls
async function getUserWithPosts(userId) {
  const user = await fetchUser(userId);
  if (!user) return null;
  
  const posts = await fetchUserPosts(user.id);
  
  return {
    user,
    posts,
    postCount: posts.length
  };
}

getUserWithPosts(1).then(data => {
  if (data) {
    console.log(`${data.user.name} has ${data.postCount} posts`);
  }
});

// 5. MULTIPLE PARALLEL REQUESTS
console.log("\n=== Multiple Parallel Requests ===");

async function fetchMultipleUsers(userIds) {
  try {
    const promises = userIds.map(id => fetchUser(id));
    const users = await Promise.all(promises);
    return users.filter(user => user !== null);
  } catch (error) {
    console.error("Error fetching multiple users:", error);
    return [];
  }
}

fetchMultipleUsers([1, 2, 3]).then(users => {
  console.log("Fetched users:", users.map(u => u.name));
});

// 6. ASYNC WITH LOOPS
console.log("\n=== Async with Loops ===");

async function processSequentially(items) {
  console.log("Processing sequentially...");
  const results = [];
  
  for (const item of items) {
    const result = await delay(500, `Processed: ${item}`);
    results.push(result);
  }
  
  return results;
}

async function processInParallel(items) {
  console.log("Processing in parallel...");
  const promises = items.map(item => delay(500, `Processed: ${item}`));
  return await Promise.all(promises);
}

const items = ["Item 1", "Item 2", "Item 3"];

processSequentially(items).then(results => {
  console.log("Sequential:", results);
});

processInParallel(items).then(results => {
  console.log("Parallel:", results);
});

// 7. REACT PATTERN: FORM SUBMISSION
console.log("\n=== React Form Submission Pattern ===");

async function submitForm(formData) {
  try {
    // Show loading state
    console.log("Submitting form...");
    
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error("Failed to submit form");
    }
    
    const result = await response.json();
    
    // Success
    console.log("Form submitted successfully:", result);
    return { success: true, data: result };
    
  } catch (error) {
    // Error handling
    console.error("Form submission failed:", error.message);
    return { success: false, error: error.message };
  } finally {
    // Hide loading state
    console.log("Submission complete");
  }
}

// Usage in React
submitForm({ title: "Test Post", body: "Content", userId: 1 });

// 8. ASYNC EVENT HANDLERS
console.log("\n=== Async Event Handlers ===");

// Simulating button click handler
async function handleButtonClick(event) {
  try {
    console.log("Button clicked, fetching data...");
    
    const data = await fetchUser(1);
    
    console.log("Data fetched:", data.name);
    // Update UI with data
    
  } catch (error) {
    console.error("Error in click handler:", error);
    // Show error message to user
  }
}

// Simulate click
handleButtonClick({ target: { id: "submit-btn" } });

// 9. RETRY LOGIC
console.log("\n=== Retry Logic ===");

async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1} of ${maxRetries}`);
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      console.log(`Attempt ${i + 1} failed, retrying...`);
      await delay(1000); // Wait before retry
    }
  }
}

// 10. TIMEOUT WRAPPER
console.log("\n=== Timeout Wrapper ===");

async function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Operation timed out")), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// Usage
async function fetchWithTimeout(url, timeout = 5000) {
  try {
    const response = await withTimeout(fetch(url), timeout);
    return await response.json();
  } catch (error) {
    if (error.message === "Operation timed out") {
      console.error("Request timed out");
    }
    throw error;
  }
}

// 11. CONDITIONAL ASYNC OPERATIONS
console.log("\n=== Conditional Async ===");

async function fetchDataConditionally(userId, includePost = false, includeComments = false) {
  const user = await fetchUser(userId);
  
  if (!user) return null;
  
  const result = { user };
  
  if (includePosts) {
    result.posts = await fetchUserPosts(userId);
    
    if (includeComments && result.posts.length > 0) {
      // Fetch comments for first post
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${result.posts[0].id}`);
      result.comments = await response.json();
    }
  }
  
  return result;
}

// ========================================
// COMMON MISTAKES
// ========================================

console.log("\n=== Common Mistakes ===");

// ❌ MISTAKE 1: Forgetting await
async function mistake1() {
  const data = fetchUser(1); // Missing await!
  console.log(data); // Logs a Promise, not the data
}

// ✅ CORRECT
async function correct1() {
  const data = await fetchUser(1);
  console.log(data); // Logs the actual data
}

// ❌ MISTAKE 2: Async in forEach
async function mistake2() {
  const ids = [1, 2, 3];
  ids.forEach(async (id) => {
    const user = await fetchUser(id); // Won't work as expected
    console.log(user);
  });
}

// ✅ CORRECT: Use for...of or map with Promise.all
async function correct2() {
  const ids = [1, 2, 3];
  
  // Option 1: Sequential
  for (const id of ids) {
    const user = await fetchUser(id);
    console.log(user);
  }
  
  // Option 2: Parallel
  const users = await Promise.all(ids.map(id => fetchUser(id)));
  console.log(users);
}

// ❌ MISTAKE 3: Not handling errors
async function mistake3() {
  const data = await fetchUser(999); // What if this fails?
  console.log(data.name); // Could crash
}

// ✅ CORRECT: Always use try/catch
async function correct3() {
  try {
    const data = await fetchUser(999);
    console.log(data.name);
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

// ========================================
// EXERCISES
// ========================================

console.log("\n=== Practice Exercises ===");

// Exercise 1: Convert this Promise chain to async/await
function exercise1Promise() {
  return fetchUser(1)
    .then(user => fetchUserPosts(user.id))
    .then(posts => posts.length)
    .catch(error => console.error(error));
}
// Your async/await version:


// Exercise 2: Fetch users 1, 2, 3 in parallel and return their names
// Your answer:


// Exercise 3: Create a function that tries to fetch a user 3 times
// with 1 second delay between attempts
// Your answer:


// Exercise 4: Fetch user and posts, but if posts take > 2 seconds, skip them
// Your answer:


// Exercise 5: Process an array of user IDs sequentially,
// logging each user's name as you fetch it
// Your answer:


console.log("\n=== End of Practice ===");
