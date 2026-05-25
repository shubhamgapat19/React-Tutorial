// ========================================
// STATE MANAGEMENT - Redux Toolkit & Zustand
// ========================================

// =====================
// REDUX TOOLKIT EXAMPLE
// =====================

// --- store/counterSlice.js ---
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for API calls
export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0, history: [] },
  reducers: {
    increment(state) {
      state.value += 1;
      state.history.push(state.value);
    },
    decrement(state) {
      state.value -= 1;
      state.history.push(state.value);
    },
    incrementByAmount(state, action) {
      state.value += action.payload;
      state.history.push(state.value);
    },
    reset(state) {
      state.value = 0;
      state.history = [];
    }
  }
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;
export default counterSlice.reducer;

// --- store/todoSlice.js ---
const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], filter: 'all' },
  reducers: {
    addTodo(state, action) {
      state.items.push({ id: Date.now(), text: action.payload, done: false });
    },
    toggleTodo(state, action) {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    deleteTodo(state, action) {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setFilter(state, action) {
      state.filter = action.payload;
    }
  }
});

// --- store/usersSlice.js ---
const usersSlice = createSlice({
  name: 'users',
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// --- store/index.js ---
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    todos: todoSlice.reducer,
    users: usersSlice.reducer
  }
});

// --- App.jsx (Provider) ---
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <Counter />
      <TodoApp />
      <UsersList />
    </Provider>
  );
}

// --- Components ---
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const { value, history } = useSelector(state => state.counter);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Count: {value}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
      <p>History: {history.join(', ')}</p>
    </div>
  );
}

function UsersList() {
  const { data, loading, error } = useSelector(state => state.users);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(fetchUsers())}>Load Users</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  );
}

// =====================
// ZUSTAND EXAMPLE
// =====================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple store
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

// Store with persistence (localStorage)
const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',

      addTodo: (text) => set(state => ({
        todos: [...state.todos, { id: Date.now(), text, done: false }]
      })),

      toggleTodo: (id) => set(state => ({
        todos: state.todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
      })),

      deleteTodo: (id) => set(state => ({
        todos: state.todos.filter(t => t.id !== id)
      })),

      setFilter: (filter) => set({ filter }),

      // Computed/derived (use get())
      get filteredTodos() {
        const { todos, filter } = get();
        if (filter === 'active') return todos.filter(t => !t.done);
        if (filter === 'completed') return todos.filter(t => t.done);
        return todos;
      }
    }),
    { name: 'todo-storage' }
  )
);

// Async actions in Zustand
const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      set({ users: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));

// Zustand Components
function ZustandCounter() {
  const { count, increment, decrement, reset } = useCounterStore();
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

function ZustandUsers() {
  const { users, loading, fetchUsers } = useUserStore();

  return (
    <div>
      <button onClick={fetchUsers}>Load Users</button>
      {loading ? <p>Loading...</p> : (
        <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
      )}
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1 (RTK): Build a shopping cart with slices:
// - cartSlice: items, addItem, removeItem, updateQuantity
// - productSlice: fetch products from API

// Exercise 2 (Zustand): Build a theme + auth store
// - Theme: light/dark toggle, persisted
// - Auth: login, logout, user data

// Exercise 3: Migrate a Context app to Zustand
// - Take the CartContext from Phase 3 and convert to Zustand

export { useCounterStore, useTodoStore, useUserStore };
