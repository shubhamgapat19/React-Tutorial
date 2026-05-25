# API Integration

## Key Concepts

### Fetch API (Built-in)
```jsx
const response = await fetch(url);
const data = await response.json();
```

### Axios (Library)
```bash
npm install axios
```
```jsx
const { data } = await axios.get(url);
```

### Fetch vs Axios
| Feature | Fetch | Axios |
|---------|-------|-------|
| Built-in | ✅ | ❌ (install) |
| Auto JSON parse | ❌ | ✅ |
| Request cancel | AbortController | CancelToken |
| Interceptors | ❌ | ✅ |
| Error on 4xx/5xx | ❌ (manual check) | ✅ (auto throw) |
| Progress tracking | ❌ | ✅ |

### API Call Pattern in React
```jsx
function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    
    return () => controller.abort();
  }, []);
}
```

### HTTP Methods
| Method | Purpose | Body |
|--------|---------|------|
| GET | Read data | No |
| POST | Create data | Yes |
| PUT | Replace data | Yes |
| PATCH | Partial update | Yes |
| DELETE | Remove data | Optional |

### Best Practices
1. Always handle loading, error, and success states
2. Cancel requests on unmount (AbortController)
3. Create a reusable API service layer
4. Use environment variables for base URLs
5. Handle auth tokens via interceptors
6. Implement retry logic for transient failures
