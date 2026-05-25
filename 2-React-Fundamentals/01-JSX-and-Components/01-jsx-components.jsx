// ========================================
// JSX & COMPONENTS - Practice Examples
// ========================================

// To run these: Create a React app with Vite
// npm create vite@latest my-app -- --template react
// cd my-app && npm install && npm run dev

import React from 'react';

// ========================================
// 1. BASIC JSX
// ========================================

// JSX is NOT HTML - it gets compiled to React.createElement()
const element = <h1>Hello, World!</h1>;

// This is what JSX compiles to:
const elementCompiled = React.createElement('h1', null, 'Hello, World!');

// JSX with expressions
const name = "React Developer";
const greeting = <h1>Hello, {name}!</h1>;

// Multi-line JSX (wrap in parentheses)
const card = (
  <div className="card">
    <h2>Title</h2>
    <p>Description</p>
  </div>
);

// ========================================
// 2. FUNCTIONAL COMPONENTS
// ========================================

// Simple component
function Welcome() {
  return <h1>Welcome to React!</h1>;
}

// Arrow function component
const Goodbye = () => {
  return <h1>Goodbye!</h1>;
};

// Component with logic
function TimeGreeting() {
  const hour = new Date().getHours();
  let message;

  if (hour < 12) message = "Good Morning!";
  else if (hour < 18) message = "Good Afternoon!";
  else message = "Good Evening!";

  return <h1>{message}</h1>;
}

// ========================================
// 3. JSX RULES IN PRACTICE
// ========================================

// Rule 1: Single parent element
function MultipleElements() {
  // ❌ ERROR: Adjacent JSX elements must be wrapped
  // return (
  //   <h1>Title</h1>
  //   <p>Paragraph</p>
  // );

  // ✅ CORRECT: Use Fragment
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}

// Rule 2: Close all tags
function SelfClosingTags() {
  return (
    <div>
      <img src="photo.jpg" alt="Photo" />
      <br />
      <input type="text" />
      <hr />
    </div>
  );
}

// Rule 3: className instead of class
function StyledComponent() {
  return (
    <div className="container">
      <h1 className="title">Styled with className</h1>
      <label htmlFor="email">Email:</label>
      <input id="email" type="email" />
    </div>
  );
}

// Rule 4: camelCase attributes
function CamelCaseExample() {
  return (
    <div
      onClick={() => console.log("clicked")}
      onMouseEnter={() => console.log("hovered")}
      tabIndex={0}
      style={{ backgroundColor: "blue", fontSize: "16px" }}
    >
      Click Me
    </div>
  );
}

// ========================================
// 4. EXPRESSIONS IN JSX
// ========================================

function Expressions() {
  const user = { name: "John", age: 28 };
  const items = ["Apple", "Banana", "Cherry"];
  const isLoggedIn = true;

  return (
    <div>
      {/* Variables */}
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>

      {/* Math */}
      <p>2 + 2 = {2 + 2}</p>

      {/* Function calls */}
      <p>Date: {new Date().toLocaleDateString()}</p>

      {/* Ternary */}
      <p>{isLoggedIn ? "Welcome back!" : "Please login"}</p>

      {/* Array length */}
      <p>Items count: {items.length}</p>

      {/* Template literals */}
      <p>{`${user.name} is ${user.age} years old`}</p>
    </div>
  );
}

// ========================================
// 5. RENDERING LISTS
// ========================================

function FruitList() {
  const fruits = ["Apple", "Banana", "Cherry", "Mango"];

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}

// With objects
function UserList() {
  const users = [
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "User" },
    { id: 3, name: "Charlie", role: "Moderator" }
  ];

  return (
    <div>
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>Role: {user.role}</p>
        </div>
      ))}
    </div>
  );
}

// ========================================
// 6. INLINE STYLES
// ========================================

function InlineStyles() {
  const headerStyle = {
    color: "white",
    backgroundColor: "#333",
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px"
  };

  return (
    <div>
      <h1 style={headerStyle}>Styled Header</h1>
      <p style={{ color: "blue", fontSize: "18px" }}>
        Inline style with double braces
      </p>
    </div>
  );
}

// ========================================
// 7. COMPONENT COMPOSITION
// ========================================

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <p>&copy; 2026 My App</p>
    </footer>
  );
}

function MainContent() {
  return (
    <main>
      <h2>Welcome to the App</h2>
      <p>This is the main content area.</p>
    </main>
  );
}

// Composing components together
function App() {
  return (
    <div className="app">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

// ========================================
// 8. CONDITIONAL RENDERING
// ========================================

function ConditionalDemo() {
  const isLoggedIn = true;
  const hasNotifications = true;
  const count = 5;

  return (
    <div>
      {/* Ternary */}
      {isLoggedIn ? <p>Welcome!</p> : <p>Please login</p>}

      {/* Logical AND (short-circuit) */}
      {hasNotifications && <span className="badge">{count}</span>}

      {/* Early return pattern */}
      {!isLoggedIn && <button>Login</button>}
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Create a ProfileCard component that displays:
// - Name, avatar image, bio, and a follow button


// Exercise 2: Create a NavBar component with logo and navigation links


// Exercise 3: Create a ProductCard component with:
// - Image, title, price, and "Add to Cart" button
// - Show "OUT OF STOCK" if quantity is 0


// Exercise 4: Create a Layout component that composes Header, Sidebar, Content, and Footer


export default App;
