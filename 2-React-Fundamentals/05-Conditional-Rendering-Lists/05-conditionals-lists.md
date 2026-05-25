# Conditional Rendering & Lists

## Key Concepts

### Conditional Rendering
Show or hide UI elements based on conditions.

```jsx
// 1. Ternary operator
{isLoggedIn ? <Dashboard /> : <Login />}

// 2. Logical AND (&&)
{hasNotifications && <Badge count={5} />}

// 3. Early return
if (isLoading) return <Spinner />;
if (error) return <Error message={error} />;
return <Content />;
```

### Pattern Comparison
| Pattern | Best For |
|---------|----------|
| Ternary `? :` | Show one thing OR another |
| `&&` | Show OR nothing |
| Early return | Loading/error states |
| Switch/Object map | Multiple conditions |

### Rendering Lists
Always use `.map()` and provide a unique `key` prop.

```jsx
{items.map(item => (
  <ItemCard key={item.id} item={item} />
))}
```

### Key Prop Rules
1. Must be unique among siblings
2. Should be stable (don't use array index if list reorders)
3. Use `id` from data when available
4. Never use `Math.random()` as key

### Why Keys Matter
- React uses keys to identify which items changed, were added, or removed
- Wrong keys cause bugs: wrong items update, state gets mixed up
- Good keys = better performance

### Common Patterns
- Filter then map: `items.filter(...).map(...)`
- Sort then map: `[...items].sort(...).map(...)`
- Group items: Reduce into categories, then render groups
- Empty state: Show message when array is empty
