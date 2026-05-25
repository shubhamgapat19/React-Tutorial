# JSX & Components

## Key Concepts

### What is JSX?
JSX is a syntax extension for JavaScript that looks like HTML but produces React elements.

```jsx
const element = <h1>Hello, World!</h1>;
```

### JSX Rules
1. Must return a single parent element (use `<>...</>` fragments)
2. All tags must be closed (`<img />`, `<br />`)
3. Use `className` instead of `class`
4. Use `htmlFor` instead of `for`
5. Use camelCase for attributes (`onClick`, `tabIndex`)
6. JavaScript expressions go inside `{}`

### Functional Components
```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Arrow function style
const Greeting = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};
```

### Component Rules
- Name must start with uppercase (`App`, `Header`, not `app`, `header`)
- Must return JSX (or null)
- One component per file (recommended)
- Keep components small and focused

### Embedding Expressions in JSX
```jsx
const name = "React";
const element = <h1>Hello, {name}!</h1>;

// Any valid JS expression works
<p>{2 + 2}</p>
<p>{user.name}</p>
<p>{formatDate(new Date())}</p>
<p>{isLoggedIn ? "Welcome" : "Please login"}</p>
```

### Fragment
When you need to return multiple elements without a wrapper div:
```jsx
function App() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
```

## React Component Patterns
- Container + Presentational
- Composition over inheritance
- Single responsibility per component
