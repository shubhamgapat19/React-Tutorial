# Build Tools & Deployment

## Key Concepts

### Vite
Modern build tool - fast dev server, optimized production builds.

```bash
npm create vite@latest my-app -- --template react
cd my-app && npm install && npm run dev
```

### Vite vs Create React App (CRA)
| Feature | Vite | CRA |
|---------|------|-----|
| Dev server start | ~200ms | ~10s+ |
| HMR speed | Instant | Slow |
| Build tool | esbuild + Rollup | Webpack |
| Config | Simple | Ejected mess |
| Status | Active | Deprecated |

### Vite Project Structure
```
my-app/
├── index.html          → Entry HTML
├── vite.config.js      → Build config
├── src/
│   ├── main.jsx        → App entry
│   ├── App.jsx
│   └── assets/
├── public/             → Static files
└── package.json
```

### vite.config.js
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: { outDir: 'dist' },
  resolve: { alias: { '@': '/src' } }
});
```

---

## Deployment

### Vercel (Recommended for Next.js)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Environment Variables
```
# .env.local (not committed)
VITE_API_URL=https://api.example.com
VITE_APP_KEY=your-key

# Usage in code
const apiUrl = import.meta.env.VITE_API_URL;
```

### Production Checklist
| Item | Action |
|------|--------|
| Bundle size | Analyze with `vite-bundle-visualizer` |
| Code splitting | Lazy load routes |
| Images | Use WebP, lazy load |
| Caching | Set proper headers |
| Error tracking | Add Sentry |
| Performance | Lighthouse audit |
| SEO | Meta tags, sitemap |
| Security | HTTPS, CSP headers |

### Common Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```
