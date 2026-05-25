# Next.js

## Key Concepts

### What is Next.js?
A React framework that provides routing, SSR, SSG, API routes, and optimizations out of the box.

### Setup
```bash
npx create-next-app@latest my-app
```

### App Router (Next.js 13+)
File-based routing in the `app/` directory.

```
app/
├── layout.tsx        → Root layout (wraps all pages)
├── page.tsx          → Home page (/)
├── about/
│   └── page.tsx     → /about
├── blog/
│   ├── page.tsx     → /blog
│   └── [slug]/
│       └── page.tsx → /blog/my-post (dynamic)
└── api/
    └── users/
        └── route.ts → API: /api/users
```

### Rendering Strategies
| Strategy | When Built | Use Case |
|----------|-----------|----------|
| SSG (Static) | Build time | Blog, docs, marketing |
| SSR (Server) | Every request | Dashboard, personalized |
| ISR (Incremental) | Build + revalidate | E-commerce, news |
| CSR (Client) | Browser | Interactive widgets |

### Server Components vs Client Components
```tsx
// Server Component (default) - runs on server
export default async function Page() {
  const data = await fetch("..."); // Direct DB/API access
  return <div>{data.title}</div>;
}

// Client Component - runs in browser
"use client";
export default function Counter() {
  const [count, setCount] = useState(0); // Hooks, events
  return <button onClick={() => setCount(c + 1)}>{count}</button>;
}
```

### Key Features
| Feature | Purpose |
|---------|---------|
| Server Components | Fetch data on server, zero JS to client |
| `"use client"` | Mark interactive components |
| `loading.tsx` | Suspense loading UI |
| `error.tsx` | Error boundary per route |
| `layout.tsx` | Shared layout (persists on navigate) |
| `route.ts` | API routes |
| `generateStaticParams` | Static paths for dynamic routes |
| `revalidate` | ISR cache time |
| Image, Link, Font | Built-in optimizations |

### Data Fetching
```tsx
// Server Component - direct fetch
async function Page() {
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 } // ISR: revalidate every 60s
  });
  const posts = await res.json();
}
```

### When to Use Next.js
- SEO-critical pages (SSR/SSG)
- Full-stack apps (API routes)
- Performance-critical sites
- Team/production projects
