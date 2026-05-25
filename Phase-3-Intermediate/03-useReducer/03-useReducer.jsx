// ========================================
// useReducer - Practice Examples
// ========================================

import { useReducer, useState } from 'react';

// ========================================
// 1. COUNTER WITH REDUCER
// ========================================

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT": return { count: state.count + 1 };
    case "DECREMENT": return { count: state.count - 1 };
    case "RESET": return { count: 0 };
    case "SET": return { count: action.payload };
    default: return state;
  }
};

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <h2>Count: {state.count}</h2>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
      <button onClick={() => dispatch({ type: "SET", payload: 100 })}>Set 100</button>
    </div>
  );
}

// ========================================
// 2. TODO APP WITH REDUCER
// ========================================

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          done: false
        }]
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, done: !todo.done } : todo
        )
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "CLEAR_COMPLETED":
      return { ...state, todos: state.todos.filter(todo => !todo.done) };
    default:
      return state;
  }
};

const initialTodoState = { todos: [], filter: "all" };

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const [input, setInput] = useState("");

  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === "active") return !todo.done;
    if (state.filter === "completed") return todo.done;
    return true;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch({ type: "ADD_TODO", payload: input });
    setInput("");
  };

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <div>
        {["all", "active", "completed"].map(filter => (
          <button key={filter} onClick={() => dispatch({ type: "SET_FILTER", payload: filter })}
            style={{ fontWeight: state.filter === filter ? "bold" : "normal" }}>
            {filter}
          </button>
        ))}
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.done}
              onChange={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })} />
            <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: "DELETE_TODO", payload: todo.id })}>×</button>
          </li>
        ))}
      </ul>

      <button onClick={() => dispatch({ type: "CLEAR_COMPLETED" })}>Clear Completed</button>
      <p>{state.todos.filter(t => !t.done).length} items left</p>
    </div>
  );
}

// ========================================
// 3. FORM WITH REDUCER
// ========================================

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: "" }
      };
    case "SET_ERROR":
      return { ...state, errors: { ...state.errors, [action.field]: action.error } };
    case "SET_ERRORS":
      return { ...state, errors: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
};

function RegistrationForm() {
  const initialState = {
    values: { name: "", email: "", password: "" },
    errors: {},
    isSubmitting: false
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e) => {
    dispatch({ type: "SET_FIELD", field: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!state.values.name) errors.name = "Required";
    if (!state.values.email) errors.email = "Required";
    if (state.values.password.length < 6) errors.password = "Min 6 chars";

    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", payload: errors });
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });
    console.log("Submitting:", state.values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={state.values.name} onChange={handleChange} placeholder="Name" />
      {state.errors.name && <span>{state.errors.name}</span>}

      <input name="email" value={state.values.email} onChange={handleChange} placeholder="Email" />
      {state.errors.email && <span>{state.errors.email}</span>}

      <input name="password" type="password" value={state.values.password} onChange={handleChange} placeholder="Password" />
      {state.errors.password && <span>{state.errors.password}</span>}

      <button type="submit" disabled={state.isSubmitting}>Submit</button>
      <button type="button" onClick={() => dispatch({ type: "RESET", payload: initialState })}>Reset</button>
    </form>
  );
}

// ========================================
// 4. SHOPPING CART REDUCER
// ========================================

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        )
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "APPLY_COUPON":
      return { ...state, discount: action.payload };
    default:
      return state;
  }
};

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [], discount: 0 });

  const products = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Phone", price: 25000 },
    { id: 3, name: "Headphones", price: 3000 }
  ];

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal - (subtotal * state.discount / 100);

  return (
    <div>
      <h2>Products</h2>
      {products.map(p => (
        <div key={p.id}>
          {p.name} - ₹{p.price}
          <button onClick={() => dispatch({ type: "ADD_ITEM", payload: p })}>Add</button>
        </div>
      ))}

      <h2>Cart</h2>
      {state.items.map(item => (
        <div key={item.id}>
          {item.name} × {item.quantity} = ₹{item.price * item.quantity}
          <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}>Remove</button>
        </div>
      ))}
      <p>Subtotal: ₹{subtotal}</p>
      {state.discount > 0 && <p>Discount: {state.discount}%</p>}
      <p><strong>Total: ₹{total}</strong></p>

      <button onClick={() => dispatch({ type: "APPLY_COUPON", payload: 10 })}>Apply 10% Off</button>
      <button onClick={() => dispatch({ type: "CLEAR_CART" })}>Clear</button>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a multi-step wizard with reducer
// Actions: NEXT_STEP, PREV_STEP, SET_DATA, RESET

// Exercise 2: Build a data table with reducer
// Actions: SET_DATA, SORT, FILTER, PAGINATE

// Exercise 3: Build a chat app state with reducer
// Actions: SEND_MESSAGE, RECEIVE_MESSAGE, DELETE_MESSAGE, SET_TYPING

export default TodoApp;
