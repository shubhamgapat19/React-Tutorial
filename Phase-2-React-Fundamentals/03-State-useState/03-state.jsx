// ========================================
// STATE WITH useState - Practice Examples
// ========================================

import { useState } from 'react';

// ========================================
// 1. BASIC COUNTER
// ========================================

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ========================================
// 2. TOGGLE STATE (Boolean)
// ========================================

function ToggleExample() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Hide" : "Show"} Content
      </button>

      {isVisible && <p>This content is toggled!</p>}

      <button onClick={() => setIsDarkMode(!isDarkMode)}>
        Toggle {isDarkMode ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}

// ========================================
// 3. STRING STATE (Input)
// ========================================

function NameInput() {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name || "stranger"}!</p>
      <p>Characters: {name.length}</p>
    </div>
  );
}

// ========================================
// 4. UPDATING STATE WITH PREVIOUS VALUE
// ========================================

function BatchCounter() {
  const [count, setCount] = useState(0);

  // ❌ BAD: All three use the same stale 'count'
  const incrementBad = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Result: only +1, not +3!
  };

  // ✅ GOOD: Uses callback with previous state
  const incrementGood = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // Result: +3
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={incrementBad}>Bad +3 (actually +1)</button>
      <button onClick={incrementGood}>Good +3</button>
    </div>
  );
}

// ========================================
// 5. OBJECT STATE
// ========================================

function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: ""
  });

  const handleChange = (field, value) => {
    setUser(prev => ({
      ...prev,          // Keep all other fields
      [field]: value    // Update only this field
    }));
  };

  return (
    <div>
      <input
        placeholder="Name"
        value={user.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <input
        placeholder="Email"
        value={user.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <input
        placeholder="Age"
        type="number"
        value={user.age}
        onChange={(e) => handleChange("age", e.target.value)}
      />

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

// ========================================
// 6. ARRAY STATE
// ========================================

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", done: false },
    { id: 2, text: "Build project", done: false }
  ]);
  const [input, setInput] = useState("");

  // ADD item
  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: input,
      done: false
    };
    setTodos(prev => [...prev, newTodo]);
    setInput("");
  };

  // REMOVE item
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // UPDATE item (toggle done)
  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  return (
    <div>
      <h2>Todo List ({todos.filter(t => !t.done).length} remaining)</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTodo()}
        placeholder="Add todo..."
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
              {todo.text}
            </span>
            <button onClick={() => removeTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// 7. MULTIPLE STATE VARIABLES
// ========================================

function ProductFilter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isGridView, setIsGridView] = useState(true);

  const products = [
    { id: 1, name: "Laptop", price: 50000, category: "electronics" },
    { id: 2, name: "Shirt", price: 1000, category: "clothing" },
    { id: 3, name: "Phone", price: 25000, category: "electronics" },
    { id: 4, name: "Shoes", price: 3000, category: "clothing" }
  ];

  const filtered = products
    .filter(p => category === "all" || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : a.price - b.price);

  return (
    <div>
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
      </select>

      <button onClick={() => setIsGridView(!isGridView)}>
        {isGridView ? "List View" : "Grid View"}
      </button>

      <div className={isGridView ? "grid" : "list"}>
        {filtered.map(p => (
          <div key={p.id}>
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>

      <p>{filtered.length} products found</p>
    </div>
  );
}

// ========================================
// 8. NESTED OBJECT STATE
// ========================================

function ProfileEditor() {
  const [profile, setProfile] = useState({
    name: "John",
    social: {
      twitter: "@john",
      github: "john-dev"
    },
    skills: ["React", "Node.js"]
  });

  // Update nested property
  const updateSocial = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }));
  };

  // Add to nested array
  const addSkill = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
  };

  // Remove from nested array
  const removeSkill = (index) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      <input
        value={profile.name}
        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
      />
      <input
        value={profile.social.twitter}
        onChange={(e) => updateSocial("twitter", e.target.value)}
      />
      <ul>
        {profile.skills.map((skill, i) => (
          <li key={i}>
            {skill} <button onClick={() => removeSkill(i)}>×</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addSkill("TypeScript")}>Add TypeScript</button>

      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}

// ========================================
// 9. SHOPPING CART EXAMPLE
// ========================================

function ShoppingCart() {
  const [cart, setCart] = useState([]);

  const products = [
    { id: 1, name: "React Book", price: 500 },
    { id: 2, name: "JavaScript Course", price: 1200 },
    { id: 3, name: "VS Code Theme", price: 200 }
  ];

  const addToCart = (product) => {
    setCart(prev => {
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

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Products</h2>
      {products.map(p => (
        <div key={p.id}>
          <span>{p.name} - ₹{p.price}</span>
          <button onClick={() => addToCart(p)}>Add</button>
        </div>
      ))}

      <h2>Cart ({cart.length} items)</h2>
      {cart.map(item => (
        <div key={item.id}>
          <span>{item.name} × {item.quantity} = ₹{item.price * item.quantity}</span>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ₹{total}</h3>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a character counter
// - Input field, show character count
// - Change color to red when > 100 characters

// Exercise 2: Build a color picker
// - 3 sliders for R, G, B (0-255)
// - Show live color preview

// Exercise 3: Build a step wizard
// - steps: ["Personal Info", "Address", "Review"]
// - Next/Back buttons, show current step content

// Exercise 4: Build a shopping list
// - Add items with name and quantity
// - Mark as purchased (toggle)
// - Show total items vs purchased count

export default TodoApp;
