# State Management: Redux Toolkit & Zustand

## Redux Toolkit (RTK)

### Setup
```bash
npm install @reduxjs/toolkit react-redux
```

### Core Concepts
| Concept | Purpose |
|---------|---------|
| Store | Single source of truth for app state |
| Slice | Feature-specific state + reducers + actions |
| Dispatch | Send actions to update state |
| Selector | Read specific data from store |

### Slice Pattern
```jsx
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    incrementByAmount: (state, action) => { state.value += action.payload; }
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

### Store Setup
```jsx
import { configureStore } from '@reduxjs/toolkit';
const store = configureStore({ reducer: { counter: counterReducer } });
```

### Usage in Components
```jsx
import { useSelector, useDispatch } from 'react-redux';
const count = useSelector(state => state.counter.value);
const dispatch = useDispatch();
dispatch(increment());
```

---

## Zustand (Simpler Alternative)

### Setup
```bash
npm install zustand
```

### Store
```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 })
}));
```

### Usage
```jsx
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

### Redux Toolkit vs Zustand
| Feature | Redux Toolkit | Zustand |
|---------|--------------|---------|
| Boilerplate | Medium | Minimal |
| DevTools | Built-in | Plugin |
| Learning curve | Moderate | Easy |
| Best for | Large apps, teams | Small-medium apps |
| Async | createAsyncThunk | Direct in actions |
| Middleware | Yes | Yes |
