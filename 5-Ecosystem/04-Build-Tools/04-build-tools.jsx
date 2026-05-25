// ========================================
// BUILD TOOLS & DEPLOYMENT - Practice
// ========================================

// ========================================
// 1. VITE CONFIG (vite.config.js)
// ========================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // Dev server config
  server: {
    port: 3000,
    open: true, // Auto-open browser
    proxy: {
      // Proxy API calls to backend during dev
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },

  // Build config
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split vendor chunks
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query']
        }
      }
    }
  }
});

// ========================================
// 2. PROJECT STRUCTURE (Production-Ready)
// ========================================

/*
src/
├── assets/           → Images, fonts
├── components/       → Shared/reusable components
│   ├── ui/          → Button, Input, Card, Modal
│   └── layout/     → Header, Footer, Sidebar
├── features/         → Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   ├── dashboard/
│   └── products/
├── hooks/            → Shared custom hooks
├── lib/              → Third-party configs (axios, query)
├── pages/            → Route pages
├── services/         → API layer
├── store/            → Global state (Zustand/Redux)
├── utils/            → Helpers, formatters
├── types/            → TypeScript types
├── test/             → Test setup, utilities
├── App.jsx
└── main.jsx
*/

// ========================================
// 3. ENVIRONMENT VARIABLES
// ========================================

/*
// .env (committed - defaults)
VITE_APP_NAME=My React App

// .env.local (NOT committed - secrets)
VITE_API_URL=http://localhost:5000
VITE_API_KEY=your-dev-key

// .env.production (production overrides)
VITE_API_URL=https://api.production.com
*/

// Usage in code
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
};

// ========================================
// 4. API SERVICE LAYER
// ========================================

// src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// src/services/userService.js
const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

// ========================================
// 5. ERROR TRACKING (Sentry)
// ========================================

/*
// npm install @sentry/react

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1
});

// Wrap app
const App = Sentry.withProfiler(function App() {
  return <RouterProvider router={router} />;
});
*/

// ========================================
// 6. DEPLOYMENT CONFIGS
// ========================================

// vercel.json
/*
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
*/

// netlify.toml
/*
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
*/

// Dockerfile
/*
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
*/

// ========================================
// 7. ESLINT + PRETTIER CONFIG
// ========================================

// .eslintrc.cjs
/*
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off'
  }
};
*/

// .prettierrc
/*
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
*/

// ========================================
// 8. CI/CD (GitHub Actions)
// ========================================

/*
// .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --coverage
      - run: npm run build
*/

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Set up a Vite project from scratch
// - Path aliases, environment variables
// - Tailwind + TypeScript configured
// - ESLint + Prettier

// Exercise 2: Deploy to Vercel
// - Connect GitHub repo
// - Set environment variables
// - Custom domain

// Exercise 3: Set up CI/CD
// - GitHub Actions: lint, test, build
// - Auto-deploy on push to main
// - Preview deploys for PRs

export { config, userService };
