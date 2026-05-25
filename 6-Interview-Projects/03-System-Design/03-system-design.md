# Frontend System Design

## What Is It?
A round where you design the architecture of a large-scale frontend application. Not coding - whiteboarding/discussion of how you'd build it.

## Framework for Answering (5 Steps)

### Step 1: Clarify Requirements (3 min)
- What are the core features?
- Scale: How many users? Data volume?
- Platforms: Web only? Mobile?
- Offline support needed?
- Real-time requirements?

### Step 2: High-Level Architecture (5 min)
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │ ←→ │   API Layer │ ←→ │   Backend   │
│  (React)    │    │  (REST/WS)  │    │  (Services) │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Step 3: Component Architecture (10 min)
- Component tree breakdown
- State management strategy
- Data flow

### Step 4: Deep Dive (15 min)
- Performance optimizations
- Error handling
- Caching strategy
- Real-time updates

### Step 5: Trade-offs & Extensions (5 min)
- What would you do differently at 10x scale?
- What did you optimize for and what did you sacrifice?

---

## Common System Design Questions

### 1. Design a News Feed (Twitter/LinkedIn)
**Key Decisions:**
| Aspect | Choice | Why |
|--------|--------|-----|
| Rendering | Virtualized list | 1000s of posts |
| Data | Infinite scroll | Better UX than pagination |
| State | React Query | Server state, caching, dedup |
| Real-time | WebSocket | New posts notification |
| Images | Lazy load + LQIP | Performance |
| Offline | Service Worker | Read cached posts |

**Component Tree:**
```
<Feed>
  <NewPostComposer />
  <VirtualList>
    <FeedPost>
      <PostHeader />  (author, time)
      <PostContent /> (text, media)
      <PostActions /> (like, comment, share)
    </FeedPost>
  </VirtualList>
  <LoadMoreTrigger /> (Intersection Observer)
</Feed>
```

### 2. Design an E-commerce Product Page
**Key Decisions:**
| Aspect | Choice |
|--------|--------|
| Rendering | SSG with ISR (Next.js) |
| Images | CDN + responsive srcset |
| Cart | Zustand with localStorage |
| Reviews | Paginated, lazy loaded |
| Search | Debounced, server-side |
| SEO | SSR meta tags, structured data |

### 3. Design a Chat Application
**Key Decisions:**
| Aspect | Choice |
|--------|--------|
| Real-time | WebSocket (Socket.io) |
| Messages | Virtualized list, paginated history |
| State | Zustand (UI) + React Query (messages) |
| Typing indicator | WebSocket events, debounced |
| File sharing | Pre-signed URLs, chunked upload |
| Offline | IndexedDB queue, sync on reconnect |

### 4. Design a Dashboard with Analytics
**Key Decisions:**
| Aspect | Choice |
|--------|--------|
| Charts | Recharts / D3 (lazy loaded) |
| Data refresh | Polling (30s) or WebSocket |
| Layout | CSS Grid, resizable panels |
| Filters | URL search params (shareable) |
| Export | Web Worker for CSV generation |
| Caching | React Query with staleTime |

---

## Performance Patterns at Scale

| Pattern | When |
|---------|------|
| Code splitting | Large apps, route-based |
| Virtualization | Lists > 100 items |
| Web Workers | Heavy computation |
| Service Workers | Offline, caching |
| CDN | Static assets, images |
| Prefetching | Predictable navigation |
| Skeleton screens | Perceived performance |
| Optimistic updates | Instant feedback |

## State Management at Scale

```
┌──────────────────────────────────────────┐
│              Application State           │
├──────────────┬───────────────────────────┤
│ Server State │  Client State             │
│ (React Query)│  ┌───────────┬──────────┐ │
│              │  │  Global   │  Local   │ │
│ - API data   │  │ (Zustand) │(useState)│ │
│ - Cache      │  │ - Auth    │ - Forms  │ │
│ - Pagination │  │ - Theme   │ - Modals │ │
│              │  │ - Cart    │ - Toggle │ │
└──────────────┴──┴───────────┴──────────┘ │
└──────────────────────────────────────────┘
```

## API Design Considerations

| Topic | Best Practice |
|-------|--------------|
| Pagination | Cursor-based for real-time data |
| Caching | ETags, Cache-Control headers |
| Error format | Consistent { error, message, code } |
| Auth | JWT in httpOnly cookie (not localStorage) |
| Rate limiting | Handle 429 with retry-after |
| Versioning | /api/v1/ prefix |
