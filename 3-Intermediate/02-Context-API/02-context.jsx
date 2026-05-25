// ========================================
// CONTEXT API - Practice Examples
// ========================================

import { createContext, useContext, useState, useReducer } from 'react';

// ========================================
// 1. BASIC THEME CONTEXT
// ========================================

const ThemeContext = createContext("light");

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

// Components consume context without prop drilling
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={`header-${theme}`}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </header>
  );
}

function Card({ title, content }) {
  const { theme } = useTheme();
  return (
    <div className={`card card-${theme}`}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

function AppWithTheme() {
  return (
    <ThemeProvider>
      <Header />
      <Card title="Hello" content="This uses context!" />
    </ThemeProvider>
  );
}

// ========================================
// 2. AUTH CONTEXT
// ========================================

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ id: 1, email, name: "John Doe" });
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

// Protected component
function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return <p>Please login</p>;

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function LoginForm() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
    </form>
  );
}

// ========================================
// 3. SHOPPING CART CONTEXT
// ========================================

const CartContext = createContext();

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    setItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeItem(id);
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}

function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}

function CartIcon() {
  const { itemCount } = useCart();
  return <span>🛒 ({itemCount})</span>;
}

function CartSummary() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) return <p>Cart is empty</p>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name} × {item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ₹{total}</h3>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

// ========================================
// 4. MULTIPLE CONTEXTS COMPOSED
// ========================================

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Header />
      <Dashboard />
      <CartSummary />
    </AppProviders>
  );
}

// ========================================
// 5. CONTEXT + REDUCER (Advanced Pattern)
// ========================================

const TodoContext = createContext();
const TodoDispatchContext = createContext();

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "TOGGLE":
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case "DELETE":
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
};

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  return (
    <TodoContext.Provider value={todos}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
}

function useTodos() { return useContext(TodoContext); }
function useTodoDispatch() { return useContext(TodoDispatchContext); }

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Create a NotificationContext
// - addNotification(message, type)
// - removeNotification(id)
// - Auto-remove after 5 seconds

// Exercise 2: Create a LanguageContext (i18n)
// - currentLanguage, setLanguage
// - translations object, t(key) function

// Exercise 3: Create a ModalContext
// - openModal(content), closeModal
// - Render modal at app root level

export default App;
