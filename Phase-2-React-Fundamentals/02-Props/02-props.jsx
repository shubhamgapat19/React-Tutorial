// ========================================
// PROPS & PROP DRILLING - Practice Examples
// ========================================

import React from 'react';

// ========================================
// 1. BASIC PROPS
// ========================================

// Passing props
function App() {
  return (
    <div>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
      <Greeting name="Charlie" />
    </div>
  );
}

// Receiving props (destructured)
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Without destructuring
function GreetingAlt(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// ========================================
// 2. MULTIPLE PROPS
// ========================================

function UserCard({ name, age, email, isActive }) {
  return (
    <div className={`card ${isActive ? "active" : "inactive"}`}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <span>{isActive ? "🟢 Online" : "🔴 Offline"}</span>
    </div>
  );
}

function UserList() {
  return (
    <div>
      <UserCard
        name="John Doe"
        age={28}
        email="john@example.com"
        isActive={true}
      />
      <UserCard
        name="Jane Smith"
        age={25}
        email="jane@example.com"
        isActive={false}
      />
    </div>
  );
}

// ========================================
// 3. DEFAULT PROPS
// ========================================

function Button({ text = "Click Me", variant = "primary", size = "medium" }) {
  const classes = `btn btn-${variant} btn-${size}`;
  return <button className={classes}>{text}</button>;
}

function ButtonDemo() {
  return (
    <div>
      <Button /> {/* Uses all defaults */}
      <Button text="Submit" variant="success" />
      <Button text="Delete" variant="danger" size="small" />
    </div>
  );
}

// ========================================
// 4. PASSING DIFFERENT DATA TYPES
// ========================================

function DataTypesDemo() {
  const user = { name: "Alice", role: "Admin" };
  const hobbies = ["coding", "reading", "gaming"];

  return (
    <Profile
      name="Alice"                          // string
      age={25}                              // number
      isVerified={true}                     // boolean
      hobbies={hobbies}                     // array
      address={{ city: "Mumbai", pin: "400001" }}  // object
      onFollow={() => console.log("Followed!")}    // function
      avatar={<img src="avatar.png" alt="Avatar" />}  // JSX element
    />
  );
}

function Profile({ name, age, isVerified, hobbies, address, onFollow, avatar }) {
  return (
    <div className="profile">
      {avatar}
      <h2>{name}, {age}</h2>
      {isVerified && <span>✓ Verified</span>}
      <p>City: {address.city}</p>
      <ul>
        {hobbies.map((hobby, i) => <li key={i}>{hobby}</li>)}
      </ul>
      <button onClick={onFollow}>Follow</button>
    </div>
  );
}

// ========================================
// 5. CHILDREN PROP
// ========================================

// Generic wrapper component
function Card({ title, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

function CardDemo() {
  return (
    <div>
      <Card title="User Info">
        <p>Name: John Doe</p>
        <p>Email: john@example.com</p>
      </Card>

      <Card title="Statistics">
        <ul>
          <li>Posts: 42</li>
          <li>Followers: 128</li>
        </ul>
      </Card>
    </div>
  );
}

// Layout component with children
function Layout({ children }) {
  return (
    <div className="layout">
      <header>My App</header>
      <main>{children}</main>
      <footer>© 2026</footer>
    </div>
  );
}

// ========================================
// 6. SPREADING PROPS
// ========================================

function Input({ label, ...inputProps }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input {...inputProps} />
    </div>
  );
}

function FormDemo() {
  return (
    <form>
      <Input
        label="Username"
        type="text"
        placeholder="Enter username"
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        minLength={8}
      />
    </form>
  );
}

// ========================================
// 7. PASSING FUNCTIONS AS PROPS (Callbacks)
// ========================================

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
}

function TodoList() {
  const todos = [
    { id: 1, text: "Learn React", done: false },
    { id: 2, text: "Build project", done: true }
  ];

  const handleToggle = (id) => {
    console.log("Toggle todo:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete todo:", id);
  };

  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

// ========================================
// 8. PROP DRILLING PROBLEM
// ========================================

// ❌ BAD: Prop drilling through unnecessary levels
function AppBad() {
  const user = { name: "John", avatar: "john.png" };
  return <Dashboard user={user} />;
}

function Dashboard({ user }) {
  // Dashboard doesn't use 'user', just passes it down
  return (
    <div>
      <h1>Dashboard</h1>
      <Sidebar user={user} />
    </div>
  );
}

function Sidebar({ user }) {
  // Sidebar doesn't use 'user' either, just passes it down
  return (
    <aside>
      <UserAvatar user={user} />
    </aside>
  );
}

function UserAvatar({ user }) {
  // Only this component actually needs user
  return <img src={user.avatar} alt={user.name} />;
}

// ✅ BETTER: Component composition (children pattern)
function AppGood() {
  const user = { name: "John", avatar: "john.png" };

  return (
    <DashboardLayout>
      <SidebarLayout>
        <UserAvatar user={user} />
      </SidebarLayout>
    </DashboardLayout>
  );
}

function DashboardLayout({ children }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {children}
    </div>
  );
}

function SidebarLayout({ children }) {
  return <aside>{children}</aside>;
}

// ========================================
// 9. RENDERING LISTS WITH PROPS
// ========================================

function ProductCard({ product }) {
  return (
    <div className="product">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

function ProductGrid({ products }) {
  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function Shop() {
  const products = [
    { id: 1, name: "Laptop", price: 50000, image: "laptop.jpg" },
    { id: 2, name: "Phone", price: 25000, image: "phone.jpg" },
    { id: 3, name: "Headphones", price: 2000, image: "headphones.jpg" }
  ];

  return <ProductGrid products={products} />;
}

// ========================================
// 10. CONDITIONAL PROPS
// ========================================

function Alert({ type = "info", message, dismissible = false, onDismiss }) {
  const colors = {
    info: "#17a2b8",
    success: "#28a745",
    warning: "#ffc107",
    danger: "#dc3545"
  };

  return (
    <div style={{ backgroundColor: colors[type], padding: "10px", borderRadius: "4px" }}>
      <span>{message}</span>
      {dismissible && (
        <button onClick={onDismiss} style={{ float: "right" }}>×</button>
      )}
    </div>
  );
}

function AlertDemo() {
  return (
    <div>
      <Alert type="success" message="Data saved!" />
      <Alert type="danger" message="Error occurred" dismissible onDismiss={() => {}} />
      <Alert message="Just info" /> {/* Uses default type */}
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Create a Navbar component that accepts:
// - logo (string), links (array of {label, href}), isLoggedIn (boolean)


// Exercise 2: Create a reusable Modal component with:
// - title, children, isOpen, onClose props


// Exercise 3: Create a Comment component that shows:
// - author name, avatar, text, timestamp
// Then create CommentList that maps over an array


// Exercise 4: Fix the prop drilling in this structure:
// App → Page → Section → Widget → Button
// The Button needs an onClick from App


export default App;
