# React Interview Questions & Patterns

## Conceptual Questions

### React Fundamentals
| Question | Key Points |
|----------|-----------|
| What is Virtual DOM? | In-memory representation of real DOM. React diffs virtual DOMs and batches minimal real DOM updates. |
| Reconciliation? | Algorithm React uses to diff two trees and determine minimal changes. Uses keys for list items. |
| Why immutability? | React uses reference comparison to detect changes. Mutating state won't trigger re-render. |
| Controlled vs Uncontrolled? | Controlled: React owns value (useState). Uncontrolled: DOM owns value (useRef). |
| What is JSX? | Syntactic sugar for `React.createElement()`. Compiles to function calls, not strings. |

### Hooks
| Question | Key Points |
|----------|-----------|
| Rules of Hooks? | Only at top level, only in React functions. No conditionals/loops. |
| useState vs useReducer? | useState for simple. useReducer for complex/related state, predictable transitions. |
| useEffect cleanup? | Runs before next effect and on unmount. For subscriptions, timers, AbortController. |
| useRef vs useState? | useRef doesn't trigger re-render. Persists across renders. For DOM access or mutable values. |
| useMemo vs useCallback? | useMemo caches computed value. useCallback caches function reference. Both prevent unnecessary work. |
| Custom hooks? | Extract reusable logic. Start with `use`. Can call other hooks. Each instance has own state. |

### Performance
| Question | Key Points |
|----------|-----------|
| When does React re-render? | State change, parent re-renders, context value changes. |
| How to prevent re-renders? | React.memo, useMemo, useCallback, split context, virtualization. |
| React.memo? | HOC that skips re-render if props are shallowly equal. Use with useCallback for callbacks. |
| Code splitting? | React.lazy + Suspense. Split at route level. Reduces initial bundle. |
| Keys importance? | Help React identify items in lists. Stable keys prevent unnecessary unmount/remount. |

### Advanced
| Question | Key Points |
|----------|-----------|
| Error Boundaries? | Class components that catch render errors. getDerivedStateFromError + componentDidCatch. |
| Portals? | Render children outside parent DOM. createPortal(). For modals, tooltips. Events still bubble in React tree. |
| Server Components? | Run on server only, zero JS shipped. Can fetch data directly. Can't use hooks/events. |
| Suspense? | Declarative loading states. Works with lazy(), data fetching libraries, Server Components. |
| Concurrent features? | useTransition, useDeferredValue. Mark updates as non-urgent. Keep UI responsive. |

---

## Common Traps

### 1. Stale Closure
```jsx
// ❌ Bug: count is captured at 0
useEffect(() => {
  setInterval(() => console.log(count), 1000);
}, []);

// ✅ Fix: use ref or include in deps
const countRef = useRef(count);
countRef.current = count;
useEffect(() => {
  setInterval(() => console.log(countRef.current), 1000);
}, []);
```

### 2. Object/Array in Dependency
```jsx
// ❌ Bug: new object every render, infinite loop
useEffect(() => { fetch(options) }, [{ page: 1 }]);

// ✅ Fix: memoize or use primitives
const options = useMemo(() => ({ page }), [page]);
useEffect(() => { fetch(options) }, [options]);
```

### 3. setState is Async
```jsx
// ❌ Bug: count won't be updated yet
setCount(count + 1);
console.log(count); // Still old value

// ✅ Fix: use functional update or useEffect
setCount(prev => prev + 1);
```

### 4. useEffect Runs After Paint
```jsx
// ❌ If you need sync DOM measurement
useEffect(() => { /* runs after paint - may flash */ }, []);

// ✅ Use useLayoutEffect for sync DOM reads
useLayoutEffect(() => { /* runs before paint */ }, []);
```

---

## Behavioral Questions (React Context)

| Question | Framework |
|----------|-----------|
| Describe a complex state management decision | Problem → Options considered → Why chosen → Result |
| How did you optimize performance? | Profiled → Identified bottleneck → Applied fix → Measured improvement |
| How do you handle tech debt? | Identify → Prioritize → Incremental refactor → Tests ensure safety |
| Team disagreement on approach? | Listen → Prototype both → Data-driven decision → Document why |
