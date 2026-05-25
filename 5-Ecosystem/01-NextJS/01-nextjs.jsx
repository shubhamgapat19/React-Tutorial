// ========================================
// NEXT.JS - Practice Examples
// ========================================

// ========================================
// 1. ROOT LAYOUT (app/layout.tsx)
// ========================================

// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My Next.js App',
  description: 'Learning Next.js'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}

// ========================================
// 2. HOME PAGE - Server Component
// ========================================

// app/page.tsx
export default async function HomePage() {
  // This runs on the server - no useEffect needed!
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', {
    next: { revalidate: 3600 } // Cache for 1 hour (ISR)
  });
  const posts = await res.json();

  return (
    <div>
      <h1>Welcome to My Blog</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={`/blog/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// 3. DYNAMIC ROUTE (app/blog/[slug]/page.tsx)
// ========================================

// app/blog/[slug]/page.tsx

// Generate static paths at build time
export async function generateStaticParams() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();
  return posts.map(post => ({ slug: String(post.id) }));
}

export async function generateMetadata({ params }) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.slug}`);
  const post = await res.json();
  return { title: post.title };
}

export default async function BlogPost({ params }) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.slug}`);
  const post = await res.json();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <a href="/blog">← Back to Blog</a>
    </article>
  );
}

// ========================================
// 4. CLIENT COMPONENT (interactive)
// ========================================

// app/components/Counter.tsx
"use client"; // Required for hooks, events, browser APIs

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
    </div>
  );
}

// ========================================
// 5. LOADING & ERROR UI
// ========================================

// app/blog/loading.tsx
export function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>Loading posts...</p>
    </div>
  );
}

// app/blog/error.tsx
"use client";
export function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// ========================================
// 6. API ROUTES (app/api/users/route.ts)
// ========================================

// app/api/users/route.ts
import { NextResponse } from 'next/server';

// GET /api/users
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];

  return NextResponse.json({ users, page });
}

// POST /api/users
export async function POST(request) {
  const body = await request.json();
  const { name, email } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newUser = { id: Date.now(), name, email };
  return NextResponse.json(newUser, { status: 201 });
}

// app/api/users/[id]/route.ts
export async function GET(request, { params }) {
  const { id } = params;
  // Fetch user by ID
  return NextResponse.json({ id, name: "User " + id });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  return NextResponse.json({ message: `User ${id} deleted` });
}

// ========================================
// 7. SERVER ACTIONS (Form handling)
// ========================================

// app/contact/page.tsx
async function submitForm(formData) {
  "use server";
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // Save to database, send email, etc.
  console.log({ name, email, message });
}

export default function ContactPage() {
  return (
    <form action={submitForm}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit">Send</button>
    </form>
  );
}

// ========================================
// 8. MIDDLEWARE (app/middleware.ts)
// ========================================

// middleware.ts (root level)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check auth for dashboard routes
  const isAuthenticated = request.cookies.get('auth-token');

  if (request.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};

// ========================================
// 9. NEXT.JS IMAGE & LINK
// ========================================

import Image from 'next/image';
import Link from 'next/link';

function OptimizedPage() {
  return (
    <div>
      {/* Optimized image with lazy loading */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={800}
        height={400}
        priority // Load immediately (above fold)
      />

      {/* Client-side navigation (no page reload) */}
      <Link href="/blog">Go to Blog</Link>
      <Link href="/blog/1" prefetch={false}>Post 1</Link>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a blog with:
// - Homepage with SSG post list
// - Dynamic post pages with generateStaticParams
// - Comments loaded client-side

// Exercise 2: Build an auth system:
// - Login page with server action
// - Protected /dashboard route
// - Middleware for auth check

// Exercise 3: Build an API:
// - CRUD routes for "products"
// - Pagination via searchParams
// - Error handling with proper status codes

export default HomePage;
