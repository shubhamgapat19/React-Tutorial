# Props & Prop Drilling

## Key Concepts

### What are Props?
Props (short for properties) are how you pass data from a parent component to a child component. They are read-only.

```jsx
// Parent passes data
<UserCard name="John" age={28} isActive={true} />

// Child receives via props
function UserCard({ name, age, isActive }) {
  return <h1>{name} - {age}</h1>;
}
```

### Props Rules
1. Props are **read-only** (never modify them)
2. Data flows **one-way** (parent → child)
3. Props can be any JavaScript value (strings, numbers, arrays, objects, functions)
4. Use destructuring to extract props

### Default Props
```jsx
function Button({ text = "Click Me", color = "blue" }) {
  return <button style={{ color }}>{text}</button>;
}
```

### Children Prop
```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h1>Title</h1>
  <p>Content goes here</p>
</Card>
```

### Prop Drilling (Problem)
Passing props through multiple levels of components that don't need them.

```
App → Header → Navigation → UserMenu → UserAvatar
(user data passes through Header and Navigation unnecessarily)
```

### Solutions to Prop Drilling
1. Component composition (children prop)
2. Context API (Phase 3)
3. State management libraries (Phase 4)

### Prop Types
- `string` → `name="John"`
- `number` → `age={28}`
- `boolean` → `isActive={true}` or just `isActive`
- `array` → `items={[1, 2, 3]}`
- `object` → `user={{ name: "John" }}`
- `function` → `onClick={() => alert("hi")}`
- `JSX/node` → `icon={<Icon />}`
