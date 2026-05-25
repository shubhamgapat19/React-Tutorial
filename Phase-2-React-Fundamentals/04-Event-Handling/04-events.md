# Event Handling

## Key Concepts

### Event Syntax in React
```jsx
// HTML way
<button onclick="handleClick()">Click</button>

// React way
<button onClick={handleClick}>Click</button>
```

### Key Differences from HTML
1. camelCase event names (`onClick`, `onChange`, `onSubmit`)
2. Pass function reference, not string (`onClick={handleClick}` not `onClick="handleClick()"`)
3. Can't return false to prevent default - must call `e.preventDefault()`
4. Events are synthetic (SyntheticEvent wrapper around native events)

### Common Events
| Event | Used On | Triggers When |
|-------|---------|---------------|
| `onClick` | Any element | Click |
| `onChange` | Input, Select, Textarea | Value changes |
| `onSubmit` | Form | Form submitted |
| `onKeyDown` | Input | Key pressed |
| `onMouseEnter` | Any element | Mouse hovers |
| `onFocus` / `onBlur` | Input | Focus/unfocus |
| `onScroll` | Scrollable element | Scrolling |

### Event Handler Patterns
```jsx
// Inline handler
<button onClick={() => setCount(count + 1)}>+</button>

// Named handler
const handleClick = () => setCount(count + 1);
<button onClick={handleClick}>+</button>

// With parameters
<button onClick={() => deleteItem(item.id)}>Delete</button>

// With event object
const handleChange = (e) => setName(e.target.value);
<input onChange={handleChange} />
```

### Passing Arguments to Handlers
```jsx
// ❌ WRONG: calls immediately on render
<button onClick={handleDelete(id)}>Delete</button>

// ✅ CORRECT: arrow function wrapper
<button onClick={() => handleDelete(id)}>Delete</button>
```

### Prevent Default
```jsx
const handleSubmit = (e) => {
  e.preventDefault(); // Stop form from reloading page
  // handle form data
};
```
