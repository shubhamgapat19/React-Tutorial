# Promises

## Key Concepts

### States
- **Pending**: Initial state, neither fulfilled nor rejected
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

### Basic Syntax
```javascript
const promise = new Promise((resolve, reject) => {
  // async operation
  if (success) resolve(value);
  else reject(error);
});

promise
  .then(result => {})
  .catch(error => {})
  .finally(() => {});
```

## Why It Matters for React
- API calls (fetch, axios)
- Data fetching in useEffect
- Async operations before render
- Error handling in async flows

## Promise Methods
1. `Promise.resolve()` - Create resolved promise
2. `Promise.reject()` - Create rejected promise
3. `Promise.all()` - Wait for all promises
4. `Promise.race()` - First to complete wins
5. `Promise.allSettled()` - Wait for all, regardless of result

## Common Patterns
- Chaining `.then()`
- Error handling with `.catch()`
- Cleanup with `.finally()`
- Parallel execution with `Promise.all()`

## Key Takeaways
1. 
2. 
3.
