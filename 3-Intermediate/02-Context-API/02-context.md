# Context API

## Key Concepts

### Problem: Prop Drilling
Passing data through many component levels that don't need it.

### Solution: Context
Context provides a way to share values between components without explicitly passing props through every level.

### Three Steps
```jsx
// 1. CREATE context
const ThemeContext = createContext("light");

// 2. PROVIDE context (wrap parent)
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 3. CONSUME context (any child)
const theme = useContext(ThemeContext);
```

### When to Use Context
- Theme (dark/light mode)
- Current user / auth state
- Language/locale
- UI state (sidebar open, modal)

### When NOT to Use Context
- Frequently changing data (causes re-renders)
- Server state (use React Query instead)
- Form state (keep local)
- Data needed by only 1-2 components (just pass props)

### Context + useReducer Pattern
Best practice for complex global state:
```jsx
const StateContext = createContext();
const DispatchContext = createContext();

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
```

### Performance Tip
Split context into separate providers if unrelated data causes unnecessary re-renders.
