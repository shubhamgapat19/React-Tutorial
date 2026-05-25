// ========================================
// TESTING REACT APPS - Practice Examples
// ========================================

// vitest.config.js
/*
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js'
  }
});
*/

// src/test/setup.js
/*
import '@testing-library/jest-dom';
*/

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ========================================
// 1. BASIC COMPONENT TEST
// ========================================

// Component
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Test
describe('Greeting', () => {
  it('renders name correctly', () => {
    render(<Greeting name="Alice" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Hello, Alice!');
  });

  it('updates when name changes', () => {
    const { rerender } = render(<Greeting name="Alice" />);
    expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();

    rerender(<Greeting name="Bob" />);
    expect(screen.getByText('Hello, Bob!')).toBeInTheDocument();
  });
});

// ========================================
// 2. TESTING USER INTERACTIONS
// ========================================

// Component
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Test
describe('Counter', () => {
  it('starts at 0', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('increments on click', async () => {
    render(<Counter />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
  });

  it('decrements on click', async () => {
    render(<Counter />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /decrement/i }));
    expect(screen.getByText('Count: -1')).toBeInTheDocument();
  });

  it('resets to 0', async () => {
    render(<Counter />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /increment/i }));
    await user.click(screen.getByRole('button', { name: /increment/i }));
    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
});

// ========================================
// 3. TESTING FORMS
// ========================================

// Component
function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      {error && <p role="alert">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

// Test
describe('LoginForm', () => {
  const mockSubmit = vi.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders form fields', () => {
    render(<LoginForm onSubmit={mockSubmit} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error when fields are empty', async () => {
    render(<LoginForm onSubmit={mockSubmit} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('All fields are required');
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('shows error for short password', async () => {
    render(<LoginForm onSubmit={mockSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), '123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Password must be at least 6 characters');
  });

  it('submits with valid data', async () => {
    render(<LoginForm onSubmit={mockSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ========================================
// 4. TESTING ASYNC (API Calls)
// ========================================

// Component
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(setUsers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}

// Test
describe('UserList', () => {
  it('shows loading then users', async () => {
    // Mock fetch
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    }));

    render(<UserList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('shows error on failure', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error: Failed');
    });
  });
});

// ========================================
// 5. TESTING WITH CONTEXT
// ========================================

// To test components that use context, wrap in provider

function renderWithAuth(ui, { user = null } = {}) {
  return render(
    <AuthContext.Provider value={{ user, login: vi.fn(), logout: vi.fn() }}>
      {ui}
    </AuthContext.Provider>
  );
}

describe('Dashboard', () => {
  it('shows login message when not authenticated', () => {
    renderWithAuth(<Dashboard />, { user: null });
    expect(screen.getByText(/please login/i)).toBeInTheDocument();
  });

  it('shows welcome when authenticated', () => {
    renderWithAuth(<Dashboard />, { user: { name: 'Alice' } });
    expect(screen.getByText(/welcome, alice/i)).toBeInTheDocument();
  });
});

// ========================================
// 6. TESTING CUSTOM HOOKS
// ========================================

import { renderHook, act } from '@testing-library/react';

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initial);
  return { count, increment, decrement, reset };
}

describe('useCounter', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('increments', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it('resets to initial', () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => result.current.increment());
    act(() => result.current.reset());
    expect(result.current.count).toBe(10);
  });
});

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Test a Todo App
// - Add todo, toggle complete, delete, filter

// Exercise 2: Test a search component
// - Type in input, debounce, show results
// - Mock API, test loading/error/success

// Exercise 3: Test a multi-step form
// - Validate each step
// - Navigate forward/back
// - Final submission

export { Greeting, Counter, LoginForm };
