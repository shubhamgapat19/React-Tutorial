# TypeScript with React

## Key Concepts

### Why TypeScript?
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Required by most companies

### Component Props
```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

function Button({ label, onClick, variant = "primary", disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}
```

### Common Types in React
```tsx
// State
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// Events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {};
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};

// Children
interface LayoutProps {
  children: React.ReactNode;
}

// Ref
const inputRef = useRef<HTMLInputElement>(null);
```

### Generics
```tsx
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

function useFetch<T>(url: string): { data: T | null; loading: boolean } { }
```

### Type vs Interface
| Feature | interface | type |
|---------|-----------|------|
| Extend | extends | & (intersection) |
| Reopen | ✅ (declaration merge) | ❌ |
| Union | ❌ | ✅ |
| Primitives | ❌ | ✅ |
| Best for | Object shapes, props | Unions, complex types |

### Essential Patterns
- Props interfaces for every component
- Return types for custom hooks
- Generic components for reusable UI
- Discriminated unions for state machines
- Utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K,V>`
