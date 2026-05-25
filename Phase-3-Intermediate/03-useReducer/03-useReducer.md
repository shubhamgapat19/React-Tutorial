# useReducer

## Key Concepts

### When to Use useReducer over useState
- Complex state logic with multiple sub-values
- Next state depends on previous state
- Multiple actions that update state differently
- State transitions are predictable and testable

### Syntax
```jsx
const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT": return { ...state, count: state.count + 1 };
    case "SET_NAME": return { ...state, name: action.payload };
    default: return state;
  }
}

// Dispatch actions
dispatch({ type: "INCREMENT" });
dispatch({ type: "SET_NAME", payload: "John" });
```

### useState vs useReducer
| useState | useReducer |
|----------|------------|
| Simple values | Complex objects |
| Independent updates | Related state transitions |
| Few state changes | Many action types |
| Small components | Large components / shared logic |

### Reducer Rules
1. Must be a pure function (no side effects)
2. Must return new state (never mutate)
3. Should handle unknown actions gracefully
4. Keep reducers predictable and testable

### Action Patterns
```jsx
// Simple action
{ type: "TOGGLE_MODAL" }

// Action with payload
{ type: "SET_USER", payload: { name: "John", id: 1 } }

// Action with multiple data
{ type: "ADD_ITEM", payload: { id: 1, text: "New item" } }
```
