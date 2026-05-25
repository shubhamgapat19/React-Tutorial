# useEffect & Component Lifecycle

## Key Concepts

### What is useEffect?
`useEffect` lets you perform side effects in components - things that happen outside of rendering:
- Fetching data from APIs
- Setting up subscriptions/timers
- Manipulating the DOM directly
- Logging

### Basic Syntax
```jsx
useEffect(() => {
  // Side effect code
  
  return () => {
    // Cleanup (optional)
  };
}, [dependencies]);
```

### Dependency Array Controls When It Runs
```jsx
// Runs after EVERY render
useEffect(() => {});

// Runs ONCE after first render (mount)
useEffect(() => {}, []);

// Runs when 'count' changes
useEffect(() => {}, [count]);

// Runs when 'id' OR 'name' changes
useEffect(() => {}, [id, name]);
```

### Lifecycle Mapping
| Class Lifecycle | useEffect Equivalent |
|-----------------|---------------------|
| componentDidMount | `useEffect(() => {}, [])` |
| componentDidUpdate | `useEffect(() => {}, [deps])` |
| componentWillUnmount | `useEffect(() => { return () => cleanup }, [])` |

### Cleanup Function
Used to prevent memory leaks - unsubscribe, clear timers, cancel requests.

```jsx
useEffect(() => {
  const timer = setInterval(() => tick(), 1000);
  
  return () => clearInterval(timer); // Cleanup!
}, []);
```

### Common Use Cases
1. Data fetching on mount
2. Setting document title
3. Event listeners (add on mount, remove on unmount)
4. Timers/intervals
5. WebSocket connections
6. Local storage sync

### Rules
1. Don't call useEffect conditionally
2. Always include used variables in dependency array
3. Async functions: define inside useEffect, then call
4. Cleanup subscriptions/timers to avoid memory leaks
