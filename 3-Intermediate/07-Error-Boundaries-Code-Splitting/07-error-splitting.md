# Error Boundaries & Code Splitting

## Error Boundaries

### What Are They?
Error boundaries catch JavaScript errors in child components, log them, and display a fallback UI instead of crashing the entire app.

### Class Component (Only Way)
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

### What They DON'T Catch
- Event handlers (use try/catch)
- Async code (use .catch())
- Server-side rendering
- Errors in the boundary itself

---

## Code Splitting & Lazy Loading

### Why?
- Reduce initial bundle size
- Load code only when needed
- Faster first page load

### React.lazy + Suspense
```jsx
const Dashboard = React.lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Route-Based Splitting
```jsx
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</Suspense>
```

### Best Practices
1. Split at route level first
2. Split large components/modals loaded on demand
3. Always provide meaningful fallback UI
4. Combine with Error Boundary for robust loading
