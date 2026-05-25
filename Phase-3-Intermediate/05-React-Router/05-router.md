# React Router

## Key Concepts

### Setup
```bash
npm install react-router-dom
```

### Basic Routing
```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Key Components & Hooks
| Component/Hook | Purpose |
|---------------|---------|
| `<BrowserRouter>` | Wraps app, enables routing |
| `<Routes>` | Container for Route definitions |
| `<Route>` | Maps path to component |
| `<Link>` | Navigation without page reload |
| `<NavLink>` | Link with active state styling |
| `<Navigate>` | Programmatic redirect |
| `<Outlet>` | Renders nested route children |
| `useNavigate()` | Navigate programmatically |
| `useParams()` | Access URL parameters |
| `useSearchParams()` | Access query string |
| `useLocation()` | Current URL info |

### Dynamic Routes
```jsx
<Route path="/users/:userId" element={<UserProfile />} />

function UserProfile() {
  const { userId } = useParams();
  // fetch user by userId
}
```

### Nested Routes
```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />
  <Route path="settings" element={<Settings />} />
  <Route path="profile" element={<Profile />} />
</Route>
```

### Protected Routes
```jsx
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

### Navigation
```jsx
const navigate = useNavigate();
navigate("/dashboard");        // push
navigate(-1);                  // go back
navigate("/login", { replace: true }); // replace history
```
