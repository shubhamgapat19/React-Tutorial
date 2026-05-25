# Async/Await

## Key Concepts

### Basic Syntax
```javascript
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

### Rules
- `async` functions always return a Promise
- `await` can only be used inside `async` functions
- `await` pauses execution until Promise resolves
- Use `try/catch` for error handling

## Why Better Than Promises?
- More readable code (linear flow)
- Easier error handling
- Better debugging experience
- Cleaner conditional logic

## React Use Cases
- Data fetching in components
- Form submissions
- API interactions
- Async operations in event handlers

## Common Patterns
1. Sequential operations (await one after another)
2. Parallel operations (Promise.all with await)
3. Error handling with try/catch
4. Conditional async logic

## Gotchas
- Don't forget `await` keyword
- Can't use await at top level (need async function)
- Error handling requires try/catch
- Be careful with loops
