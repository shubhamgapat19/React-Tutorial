# Performance Optimization

## Key Concepts

### React Re-rendering Rules
1. Component re-renders when its state changes
2. Component re-renders when its parent re-renders
3. Component re-renders when its context value changes

### Optimization Tools
| Tool | What It Does |
|------|--------------|
| `React.memo` | Skip re-render if props haven't changed |
| `useMemo` | Cache expensive computations |
| `useCallback` | Cache function references |
| `useTransition` | Mark updates as non-urgent |
| `useDeferredValue` | Defer a value update |
| Code splitting | Load code on demand |
| Virtualization | Render only visible items |

### React.memo
```jsx
const ExpensiveComponent = React.memo(function({ data, onClick }) {
  // Only re-renders if data or onClick change
  return <div>{data.name}</div>;
});
```

### When to Optimize
1. Profile first (React DevTools Profiler)
2. Identify slow renders (> 16ms)
3. Apply targeted optimizations
4. Don't optimize everything prematurely

### Common Performance Issues
- Rendering huge lists (use virtualization)
- Creating new objects/arrays in render (use useMemo)
- Passing inline functions to memoized children (use useCallback)
- Context with many consumers and frequent updates (split contexts)
- Unnecessary re-renders from parent (use React.memo)

### Virtualization (react-window)
```bash
npm install react-window
```
Renders only visible items in a list - critical for 1000+ items.

### Keys and Reconciliation
- Stable keys help React identify changes efficiently
- Never use array index as key for reorderable lists
- Bad keys = destroyed/recreated components = lost state
