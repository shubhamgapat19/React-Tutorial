# React Query (TanStack Query)

## Key Concepts

### What is React Query?
A library for fetching, caching, synchronizing, and updating server state. It separates server state from client state.

### Setup
```bash
npm install @tanstack/react-query
```

### Core Concepts
| Concept | Purpose |
|---------|---------|
| `useQuery` | Fetch & cache data (GET) |
| `useMutation` | Create/Update/Delete data |
| `queryKey` | Unique identifier for cached data |
| `staleTime` | How long data is considered fresh |
| `cacheTime` | How long unused data stays in memory |

### Basic Usage
```jsx
function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });
}
```

### Why React Query?
- Automatic caching & background refetching
- Loading & error states built-in
- Pagination & infinite scroll helpers
- Optimistic updates
- Automatic retries
- Window focus refetching
- Reduces boilerplate (no useState/useEffect for data)

### React Query vs useEffect + useState
| Feature | Manual (useEffect) | React Query |
|---------|-------------------|-------------|
| Caching | ❌ (build yourself) | ✅ built-in |
| Refetching | ❌ manual | ✅ automatic |
| Loading/error | Manual state | ✅ built-in |
| Deduplication | ❌ | ✅ |
| Pagination | Complex | Simple |
| Optimistic updates | Hard | Built-in |
