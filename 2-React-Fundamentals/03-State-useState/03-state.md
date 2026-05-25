# State with useState

## Key Concepts

### What is State?
State is data that can change over time. When state changes, React re-renders the component to reflect the new data.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useState Rules
1. Call at the top level of the component (not inside loops, conditions, or nested functions)
2. Returns `[currentValue, setterFunction]`
3. Initial value is only used on first render
4. Setting state triggers a re-render
5. State updates are batched (async)

### State vs Props
| Props | State |
|-------|-------|
| Passed from parent | Managed within component |
| Read-only | Can be updated |
| Component can't change its own props | Component controls its own state |

### Updating State with Previous Value
```jsx
// ❌ Might be stale
setCount(count + 1);

// ✅ Always uses latest value
setCount(prevCount => prevCount + 1);
```

### State with Objects & Arrays
```jsx
// Object state
const [user, setUser] = useState({ name: "", age: 0 });
setUser(prev => ({ ...prev, name: "John" }));

// Array state
const [items, setItems] = useState([]);
setItems(prev => [...prev, newItem]);       // Add
setItems(prev => prev.filter(i => i.id !== id)); // Remove
setItems(prev => prev.map(i => i.id === id ? {...i, done: true} : i)); // Update
```

### When to Use State
- Form input values
- Toggle visibility (show/hide)
- Counters
- Selected items
- Data fetched from APIs
- Any value that changes due to user interaction
