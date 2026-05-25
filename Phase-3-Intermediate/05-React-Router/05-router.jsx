// ========================================
// REACT ROUTER - Practice Examples
// ========================================

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation
} from 'react-router-dom';
import { useState } from 'react';

// ========================================
// 1. BASIC ROUTING
// ========================================

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// ========================================
// 2. NAVIGATION (Link & NavLink)
// ========================================

function Navbar() {
  return (
    <nav>
      {/* Basic links */}
      <Link to="/">Home</Link>

      {/* NavLink - adds active class automatically */}
      <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
        About
      </NavLink>
      <NavLink to="/users" style={({ isActive }) => ({ color: isActive ? "blue" : "black" })}>
        Users
      </NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </nav>
  );
}

// ========================================
// 3. PAGE COMPONENTS
// ========================================

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our React Router demo!</p>
    </div>
  );
}

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // After form submission
    navigate("/", { state: { message: "Form submitted!" } });
  };

  return (
    <div>
      <h1>Contact</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Your message" />
        <button type="submit">Send</button>
      </form>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

// ========================================
// 4. DYNAMIC ROUTES (useParams)
// ========================================

function Users() {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
  ];

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // In real app, fetch user by ID
  return (
    <div>
      <h1>User Profile: #{userId}</h1>
      <p>Showing details for user {userId}</p>
      <button onClick={() => navigate("/users")}>Back to Users</button>
    </div>
  );
}

// ========================================
// 5. NESTED ROUTES (Outlet)
// ========================================

function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside>
        <h3>Dashboard</h3>
        <nav>
          <Link to="/dashboard">Overview</Link>
          <Link to="/dashboard/profile">Profile</Link>
          <Link to="/dashboard/settings">Settings</Link>
        </nav>
      </aside>
      <main>
        {/* Child routes render here */}
        <Outlet />
      </main>
    </div>
  );
}

function DashboardHome() {
  return <h2>Dashboard Overview</h2>;
}

function Settings() {
  return <h2>Settings Page</h2>;
}

function Profile() {
  return <h2>Profile Page</h2>;
}

// ========================================
// 6. PROTECTED ROUTES
// ========================================

// Simulated auth
const useAuth = () => {
  const [user] = useState({ name: "John" }); // Set to null to test redirect
  return { user };
};

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, save attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = () => {
    // After successful login, redirect to original page
    navigate(from, { replace: true });
  };

  return (
    <div>
      <h1>Login</h1>
      <p>You must log in to view: {from}</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

// ========================================
// 7. SEARCH PARAMS (Query String)
// ========================================

function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";

  const updateSearch = (key, value) => {
    setSearchParams(prev => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      return prev;
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => updateSearch("q", e.target.value)}
        placeholder="Search products..."
      />
      <select value={category} onChange={(e) => updateSearch("category", e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <p>Searching "{query}" in {category}</p>
      <p>URL: ?q={query}&category={category}</p>
    </div>
  );
}

// ========================================
// 8. useLocation - CURRENT URL INFO
// ========================================

function LocationInfo() {
  const location = useLocation();

  return (
    <div>
      <p>Pathname: {location.pathname}</p>
      <p>Search: {location.search}</p>
      <p>Hash: {location.hash}</p>
      <p>State: {JSON.stringify(location.state)}</p>
    </div>
  );
}

// ========================================
// 9. NOT FOUND PAGE
// ========================================

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a blog with routes:
// /blog - list all posts
// /blog/:postId - single post
// /blog/new - create new post (protected)

// Exercise 2: Build tabbed navigation
// /products?tab=all|featured|sale
// Use search params for tab state

// Exercise 3: Build admin panel with nested routes
// /admin/users, /admin/orders, /admin/products
// Protected with role check (admin only)

export default App;
