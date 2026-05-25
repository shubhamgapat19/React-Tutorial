// ========================================
// SYSTEM DESIGN IMPLEMENTATION SNIPPETS
// ========================================

// These are production patterns you'd discuss in system design interviews
// and implement in real projects.

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ========================================
// 1. VIRTUALIZED LIST (Core Pattern)
// ========================================

function VirtualList({ items, itemHeight, containerHeight, renderItem }) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, width: '100%' }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========================================
// 2. WEBSOCKET HOOK (Real-time)
// ========================================

function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('disconnected');
  const ws = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    ws.current = new WebSocket(url);
    setStatus('connecting');

    ws.current.onopen = () => {
      setStatus('connected');
      reconnectAttempts.current = 0;
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    ws.current.onclose = () => {
      setStatus('disconnected');
      // Auto-reconnect with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000;
        setTimeout(() => {
          reconnectAttempts.current++;
          connect();
        }, delay);
      }
    };

    ws.current.onerror = () => setStatus('error');
  }, [url]);

  useEffect(() => {
    connect();
    return () => ws.current?.close();
  }, [connect]);

  const send = useCallback((data) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  return { messages, status, send };
}

// Usage: Chat
function ChatRoom({ roomId }) {
  const { messages, status, send } = useWebSocket(`wss://api.example.com/ws/rooms/${roomId}`);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    send({ type: 'message', text: input, timestamp: Date.now() });
    setInput('');
  };

  return (
    <div>
      <div className="status">{status}</div>
      <div className="messages">
        {messages.map((msg, i) => <div key={i}>{msg.text}</div>)}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

// ========================================
// 3. OFFLINE QUEUE (Service Worker Pattern)
// ========================================

function useOfflineQueue() {
  const [queue, setQueue] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); processQueue(); };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const processQueue = async () => {
    const pending = [...queue];
    for (const item of pending) {
      try {
        await fetch(item.url, item.options);
        setQueue(prev => prev.filter(q => q.id !== item.id));
      } catch {
        break; // Stop processing if one fails
      }
    }
  };

  const addToQueue = (url, options) => {
    if (isOnline) {
      return fetch(url, options);
    }
    const id = Date.now();
    setQueue(prev => [...prev, { id, url, options }]);
    return Promise.resolve({ queued: true, id });
  };

  return { addToQueue, isOnline, queueLength: queue.length };
}

// ========================================
// 4. INTERSECTION OBSERVER (Lazy Load)
// ========================================

function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

function LazyImage({ src, alt, ...props }) {
  const [imgRef, isVisible] = useIntersectionObserver();
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={imgRef} style={{ minHeight: '200px', background: '#f3f4f6' }}>
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
          {...props}
        />
      )}
    </div>
  );
}

// ========================================
// 5. OPTIMISTIC UPDATES PATTERN
// ========================================

function useOptimisticUpdate(fetchFn) {
  const [state, setState] = useState({ data: null, error: null });

  const execute = async (optimisticData, actualFn) => {
    const previousData = state.data;

    // Immediately show optimistic result
    setState({ data: optimisticData, error: null });

    try {
      const result = await actualFn();
      setState({ data: result, error: null });
      return result;
    } catch (error) {
      // Rollback on failure
      setState({ data: previousData, error: error.message });
      throw error;
    }
  };

  return { ...state, execute };
}

// ========================================
// 6. DEBOUNCED API SEARCH WITH CACHE
// ========================================

function useSearchWithCache(searchFn, delay = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const cache = useRef(new Map());
  const abortRef = useRef(null);

  useEffect(() => {
    if (!query) { setResults([]); return; }

    // Check cache first
    if (cache.current.has(query)) {
      setResults(cache.current.get(query));
      return;
    }

    const timer = setTimeout(async () => {
      // Abort previous request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      try {
        const data = await searchFn(query, abortRef.current.signal);
        cache.current.set(query, data);
        // Limit cache size
        if (cache.current.size > 50) {
          const firstKey = cache.current.keys().next().value;
          cache.current.delete(firstKey);
        }
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return { query, setQuery, results, loading };
}

// ========================================
// 7. RETRY WITH EXPONENTIAL BACKOFF
// ========================================

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || Math.pow(2, attempt);
          await new Promise(r => setTimeout(r, retryAfter * 1000));
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
    }
  }
}

// ========================================
// 8. STATE MACHINE (Predictable UI States)
// ========================================

const STATES = { idle: 'idle', loading: 'loading', success: 'success', error: 'error' };

function useStateMachine(asyncFn) {
  const [state, setState] = useState({ status: STATES.idle, data: null, error: null });

  const execute = async (...args) => {
    setState({ status: STATES.loading, data: null, error: null });
    try {
      const data = await asyncFn(...args);
      setState({ status: STATES.success, data, error: null });
      return data;
    } catch (error) {
      setState({ status: STATES.error, data: null, error: error.message });
      throw error;
    }
  };

  const reset = () => setState({ status: STATES.idle, data: null, error: null });

  return { ...state, execute, reset, isIdle: state.status === STATES.idle, isLoading: state.status === STATES.loading, isSuccess: state.status === STATES.success, isError: state.status === STATES.error };
}

// ========================================
// 9. EVENT BUS (Component Communication)
// ========================================

class EventBus {
  constructor() { this.listeners = new Map(); }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }
}

const eventBus = new EventBus();

function useEventBus(event, handler) {
  useEffect(() => {
    const unsubscribe = eventBus.on(event, handler);
    return unsubscribe;
  }, [event, handler]);

  return { emit: (data) => eventBus.emit(event, data) };
}

// ========================================
// SYSTEM DESIGN PRACTICE
// ========================================

// Practice designing these (draw diagrams, list components, discuss trade-offs):

// 1. Design Twitter Feed
//    - Infinite scroll, real-time updates, optimistic likes
//    - How do you handle 10K tweets loading?

// 2. Design Google Docs (Collaborative Editor)
//    - Real-time sync, conflict resolution, cursor positions
//    - OT vs CRDT?

// 3. Design Spotify Player
//    - Audio streaming, queue management, offline mode
//    - How does the player persist across page navigation?

// 4. Design Notion
//    - Block-based editor, nested pages, real-time collab
//    - How do you handle complex nested state?

// 5. Design Uber Map View
//    - Real-time driver locations, route rendering
//    - How to handle 100 moving markers efficiently?

export { VirtualList, useWebSocket, useOfflineQueue, useIntersectionObserver, fetchWithRetry };
