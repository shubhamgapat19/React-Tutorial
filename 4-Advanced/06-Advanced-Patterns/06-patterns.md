# Advanced Component Patterns

## Key Concepts

### 1. Compound Components
Components that work together to form a complete UI.
```jsx
<Select>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
```

### 2. Render Props
A function prop that a component uses to know what to render.
```jsx
<DataFetcher url="/api/users" render={(data) => <UserList users={data} />} />
```

### 3. Higher-Order Components (HOC)
A function that takes a component and returns a new enhanced component.
```jsx
const EnhancedComponent = withAuth(MyComponent);
```

### 4. Portals
Render children into a DOM node outside the parent hierarchy.
```jsx
createPortal(<Modal />, document.getElementById('modal-root'));
```

### 5. Forwarding Refs
Pass ref through a component to a child DOM element.
```jsx
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);
```

### Pattern Comparison
| Pattern | Best For | Modern Alternative |
|---------|----------|-------------------|
| Compound | Related components | Still great ✅ |
| Render Props | Shared logic | Custom hooks |
| HOC | Cross-cutting concerns | Custom hooks |
| Portals | Modals, tooltips | Still great ✅ |
| Forward Ref | Component libraries | Still great ✅ |

### Modern Approach
Most problems that HOCs and render props solved are now better handled by custom hooks. But compound components, portals, and forwardRef remain essential.
