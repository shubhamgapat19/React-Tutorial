// ========================================
// ERROR BOUNDARIES & CODE SPLITTING
// ========================================

import React, { Component, Suspense, lazy, useState } from 'react';

// ========================================
// 1. ERROR BOUNDARY (Class Component)
// ========================================

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    // Log to error reporting service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: "20px", background: "#fee", border: "1px solid #f00" }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ========================================
// 2. USING ERROR BOUNDARY
// ========================================

function BuggyComponent() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("Intentional crash for demo!");
  }

  return (
    <div>
      <p>This component works fine until you click the button.</p>
      <button onClick={() => setShouldError(true)}>💥 Crash!</button>
    </div>
  );
}

function AppWithErrorBoundary() {
  return (
    <div>
      <h1>My App</h1>
      
      {/* Each section isolated */}
      <ErrorBoundary fallback={<p>Widget 1 crashed</p>}>
        <BuggyComponent />
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Widget 2 crashed</p>}>
        <p>This section won't crash even if the above does.</p>
      </ErrorBoundary>
    </div>
  );
}

// ========================================
// 3. ERROR BOUNDARY WITH RESET
// ========================================

class ResettableErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h3>Oops! Something broke.</h3>
          <button onClick={this.resetError}>Reset</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ========================================
// 4. LAZY LOADING COMPONENTS
// ========================================

// These components are loaded only when needed
const HeavyChart = lazy(() => import('./HeavyChart'));
const AdminPanel = lazy(() => import('./AdminPanel'));
const SettingsPage = lazy(() => import('./SettingsPage'));

function LazyApp() {
  const [page, setPage] = useState("home");

  return (
    <div>
      <nav>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("chart")}>Charts</button>
        <button onClick={() => setPage("admin")}>Admin</button>
        <button onClick={() => setPage("settings")}>Settings</button>
      </nav>

      <ErrorBoundary fallback={<p>Failed to load page</p>}>
        <Suspense fallback={<div>Loading page...</div>}>
          {page === "home" && <p>Home content (always loaded)</p>}
          {page === "chart" && <HeavyChart />}
          {page === "admin" && <AdminPanel />}
          {page === "settings" && <SettingsPage />}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// ========================================
// 5. ROUTE-BASED CODE SPLITTING
// ========================================

// In a real app with React Router:
/*
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
*/

// ========================================
// 6. CONDITIONAL LAZY LOADING (Modal)
// ========================================

const HeavyModal = lazy(() => import('./HeavyModal'));

function AppWithModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Open Modal</button>

      {showModal && (
        <Suspense fallback={<div className="modal-loading">Loading...</div>}>
          <HeavyModal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </div>
  );
}

// ========================================
// 7. LOADING SPINNER COMPONENT
// ========================================

function Spinner({ size = "medium", text = "Loading..." }) {
  const sizes = { small: "20px", medium: "40px", large: "60px" };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <div style={{
        width: sizes[size],
        height: sizes[size],
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        margin: "0 auto"
      }} />
      <p>{text}</p>
    </div>
  );
}

// ========================================
// 8. ERROR HANDLING IN EVENTS (try/catch)
// ========================================

function EventErrorHandling() {
  const [error, setError] = useState(null);

  // Error boundaries DON'T catch event handler errors
  // Use try/catch instead
  const handleClick = async () => {
    try {
      const response = await fetch("/api/data");
      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Fetch Data</button>
      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Create ErrorBoundary with:
// - Error logging to console
// - "Report Bug" button
// - Auto-reset after 5 seconds

// Exercise 2: Build a dashboard with 4 lazy-loaded widgets
// Each widget loads independently with its own Suspense

// Exercise 3: Implement route-based splitting for:
// Home, About, Dashboard (protected), Settings

export default AppWithErrorBoundary;
