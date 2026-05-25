# useCallback, useMemo, useRef

## Key Concepts

### useRef
Holds a mutable value that persists across renders without causing re-renders.

```jsx
// DOM reference
const inputRef = useRef(null);
inputRef.current.focus();

// Mutable value (doesn't trigger re-render)
const renderCount = useRef(0);
renderCount.current++;
```

**Use Cases:** DOM access, storing previous values, timers/intervals, any value you want to persist without re-rendering.

### useMemo
Memoizes a computed value. Only recalculates when dependencies change.

```jsx
const expensiveResult = useMemo(() => {
  return heavyComputation(data);
}, [data]);
```

**Use Cases:** Expensive calculations, filtering/sorting large arrays, derived state.

### useCallback
Memoizes a function reference. Returns the same function unless dependencies change.

```jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

**Use Cases:** Passing callbacks to memoized child components, dependencies in useEffect.

### When to Use (and When NOT)
| Hook | Use When | Don't Use When |
|------|----------|----------------|
| `useRef` | DOM access, persist values | Storing derived state |
| `useMemo` | Expensive computation, referential equality | Simple calculations |
| `useCallback` | Child uses React.memo, function in deps | Every single handler |

### Performance Rule
Don't optimize prematurely. Only use useMemo/useCallback when you measure a performance problem. They have their own cost (memory + comparison).
