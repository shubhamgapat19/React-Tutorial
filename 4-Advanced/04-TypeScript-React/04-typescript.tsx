// ========================================
// TYPESCRIPT WITH REACT - Practice
// ========================================

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// ========================================
// 1. COMPONENT PROPS
// ========================================

// Basic props
interface GreetingProps {
  name: string;
  age?: number;          // Optional
  isActive: boolean;
}

function Greeting({ name, age, isActive }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
      <span>{isActive ? "Online" : "Offline"}</span>
    </div>
  );
}

// Props with children
interface CardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div>{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
}

// Props with callbacks
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick: () => void;
}

function Button({ label, variant = "primary", size = "md", disabled, onClick }: ButtonProps) {
  return (
    <button className={`btn-${variant} btn-${size}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ========================================
// 2. STATE WITH TYPES
// ========================================

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: "low" | "medium" | "high";
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then(res => res.json())
      .then((data: User) => setUser(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user</p>;

  return <h2>{user.name} ({user.role})</h2>;
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = (text: string, priority: Todo["priority"] = "medium") => {
    const newTodo: Todo = { id: Date.now(), text, done: false, priority };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={() => { addTodo(input); setInput(""); }}>Add</button>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => toggleTodo(todo.id)}>
          {todo.done ? "✓" : "○"} {todo.text} [{todo.priority}]
        </div>
      ))}
    </div>
  );
}

// ========================================
// 3. EVENT TYPES
// ========================================

function EventsExample() {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.clientX, e.clientY);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") console.log("Enter pressed");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleInputChange} onKeyDown={handleKeyDown} />
      <select onChange={handleSelectChange}>
        <option>A</option>
        <option>B</option>
      </select>
      <button onClick={handleClick}>Click</button>
    </form>
  );
}

// ========================================
// 4. CUSTOM HOOKS WITH TYPES
// ========================================

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(url);
      const json: T = await res.json();
      setData(json);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Usage
function UsersPage() {
  const { data: users, loading } = useFetch<User[]>("/api/users");
  if (loading) return <p>Loading...</p>;
  return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// ========================================
// 5. CONTEXT WITH TYPES
// ========================================

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    const data: User = await res.json();
    setUser(data);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// ========================================
// 6. GENERIC COMPONENTS
// ========================================

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage = "No items" }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyMessage}</p>;
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
function App() {
  const users: User[] = [
    { id: 1, name: "Alice", email: "a@b.com", role: "admin" }
  ];

  return (
    <List
      items={users}
      keyExtractor={(user) => user.id}
      renderItem={(user) => <span>{user.name} - {user.role}</span>}
    />
  );
}

// ========================================
// 7. DISCRIMINATED UNIONS (State Machines)
// ========================================

type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function useRequest<T>() {
  const [state, setState] = useState<RequestState<T>>({ status: "idle" });

  const execute = async (fn: () => Promise<T>) => {
    setState({ status: "loading" });
    try {
      const data = await fn();
      setState({ status: "success", data });
    } catch (err) {
      setState({ status: "error", error: (err as Error).message });
    }
  };

  return { state, execute };
}

// Usage - TypeScript ensures you handle all cases
function DataView() {
  const { state, execute } = useRequest<User[]>();

  switch (state.status) {
    case "idle": return <button onClick={() => execute(() => fetch("/api").then(r => r.json()))}>Load</button>;
    case "loading": return <p>Loading...</p>;
    case "success": return <ul>{state.data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
    case "error": return <p>Error: {state.error}</p>;
  }
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Type a shopping cart (Product, CartItem, CartState)
// Exercise 2: Create a generic Table component with typed columns
// Exercise 3: Build typed form hook with validation

export default App;
