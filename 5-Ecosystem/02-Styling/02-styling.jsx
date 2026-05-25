// ========================================
// STYLING IN REACT - Practice Examples
// ========================================

// ========================================
// 1. TAILWIND CSS EXAMPLES
// ========================================

function TailwindCard() {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      <img className="w-full h-48 object-cover" src="/image.jpg" alt="Card" />
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
          Card Title
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          Card description goes here with some example text.
        </p>
      </div>
      <div className="px-6 py-4 flex gap-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Primary
        </button>
        <button className="bg-transparent hover:bg-gray-100 text-blue-500 font-bold py-2 px-4 rounded border border-blue-500">
          Secondary
        </button>
      </div>
    </div>
  );
}

// Responsive Layout
function TailwindLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Logo</h1>
        <div className="hidden md:flex gap-4">
          <a className="text-gray-600 hover:text-blue-500" href="#">Home</a>
          <a className="text-gray-600 hover:text-blue-500" href="#">About</a>
          <a className="text-gray-600 hover:text-blue-500" href="#">Contact</a>
        </div>
      </nav>

      {/* Grid - responsive */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Item {i}</h3>
              <p className="text-gray-600">Description text</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tailwind Form
function TailwindForm() {
  return (
    <form className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
        Sign In
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <a className="text-blue-500 hover:underline" href="#">Sign up</a>
      </p>
    </form>
  );
}

// ========================================
// 2. CSS MODULES EXAMPLES
// ========================================

/*
// Button.module.css
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background-color: #3b82f6;
  color: white;
}
.primary:hover {
  background-color: #2563eb;
}

.secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.large { padding: 12px 24px; font-size: 16px; }
.small { padding: 4px 12px; font-size: 12px; }
*/

// import styles from './Button.module.css';

function CSSModuleButton({ variant = "primary", size = "medium", children, onClick }) {
  // In real code: className={`${styles.button} ${styles[variant]} ${styles[size]}`}
  return (
    <button className={`button ${variant} ${size}`} onClick={onClick}>
      {children}
    </button>
  );
}

/*
// Card.module.css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}
.cardImage { width: 100%; height: 200px; object-fit: cover; }
.cardBody { padding: 16px; }
.cardTitle { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.cardText { color: #666; line-height: 1.5; }
*/

// ========================================
// 3. STYLED COMPONENTS EXAMPLES
// ========================================

import styled, { css, ThemeProvider, keyframes } from 'styled-components';

// Basic styled component
const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' && css`
    background: #3b82f6;
    color: white;
    &:hover { background: #2563eb; }
  `}

  ${props => props.variant === 'danger' && css`
    background: #ef4444;
    color: white;
    &:hover { background: #dc2626; }
  `}

  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

// Extending styles
const IconButton = styled(StyledButton)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-in;
`;

// Theming
const lightTheme = {
  bg: '#ffffff',
  text: '#1f2937',
  primary: '#3b82f6',
  card: '#f9fafb'
};

const darkTheme = {
  bg: '#1f2937',
  text: '#f9fafb',
  primary: '#60a5fa',
  card: '#374151'
};

const PageWrapper = styled.div`
  background: ${props => props.theme.bg};
  color: ${props => props.theme.text};
  min-height: 100vh;
  padding: 20px;
`;

const ThemedCard = styled.div`
  background: ${props => props.theme.card};
  padding: 20px;
  border-radius: 8px;
`;

function StyledApp() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <PageWrapper>
        <button onClick={() => setIsDark(!isDark)}>Toggle Theme</button>
        <ThemedCard>
          <h2>Themed Card</h2>
          <StyledButton variant="primary">Primary</StyledButton>
          <StyledButton variant="danger">Danger</StyledButton>
        </ThemedCard>
      </PageWrapper>
    </ThemeProvider>
  );
}

// ========================================
// 4. UTILITY: cn() helper (Tailwind + clsx)
// ========================================

// npm install clsx tailwind-merge
/*
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Usage - conditionally apply classes
function Badge({ variant, children }) {
  return (
    <span className={cn(
      "px-2 py-1 rounded text-sm font-medium",
      variant === "success" && "bg-green-100 text-green-800",
      variant === "error" && "bg-red-100 text-red-800",
      variant === "warning" && "bg-yellow-100 text-yellow-800"
    )}>
      {children}
    </span>
  );
}
*/

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a responsive dashboard layout with Tailwind
// - Sidebar (collapsible on mobile)
// - Header with avatar
// - Card grid

// Exercise 2: Build a component library with CSS Modules
// - Button, Input, Card, Badge, Modal
// - Multiple variants per component

// Exercise 3: Build a themed app with styled-components
// - Light/dark toggle
// - Custom theme with fonts, colors, spacing

export default TailwindCard;
