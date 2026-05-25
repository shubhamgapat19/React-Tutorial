# Custom Hooks

## Key Concepts

### What is a Custom Hook?
A custom hook is a function that starts with `use` and can call other hooks. It lets you extract component logic into reusable functions.

```jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset };
}
```

### Rules
1. Name must start with `use`
2. Can call other hooks (useState, useEffect, etc.)
3. Each component using the hook gets its own state (not shared)
4. Return whatever the component needs (values, functions, objects)

### When to Create Custom Hooks
- Logic is duplicated across components
- Component is getting too complex
- You want to separate concerns
- Making logic testable independently

### Common Custom Hook Patterns
| Hook | Purpose |
|------|---------|
| `useFetch` | Data fetching with loading/error |
| `useLocalStorage` | Sync state with localStorage |
| `useDebounce` | Debounce a value |
| `useToggle` | Boolean toggle |
| `useForm` | Form handling logic |
| `useOnClickOutside` | Detect clicks outside element |
| `useWindowSize` | Track window dimensions |
| `useMediaQuery` | Responsive breakpoints |

### Custom Hook vs Utility Function
- Custom hooks CAN use other hooks (useState, useEffect)
- Utility functions CANNOT use hooks
- If you need reactive state or effects → custom hook
- If it's pure logic → utility function
