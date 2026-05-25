// ========================================
// INTERVIEW CODING PATTERNS - Practice
// ========================================

import { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';

// ========================================
// 1. DEBOUNCED SEARCH (Very Common)
// ========================================

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }

    const controller = new AbortController();
    setLoading(true);

    fetch(`https://api.github.com/search/users?q=${debouncedQuery}`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => { setResults(data.items || []); setLoading(false); })
      .catch(err => { if (err.name !== 'AbortError') setLoading(false); });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search GitHub users..." />
      {loading && <p>Searching...</p>}
      <ul>{results.map(u => <li key={u.id}>{u.login}</li>)}</ul>
    </div>
  );
}

// ========================================
// 2. INFINITE SCROLL (Common Interview)
// ========================================

function useInfiniteScroll(fetchFn) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setLoading(true);
    fetchFn(page).then(newItems => {
      setItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length > 0);
      setLoading(false);
    });
  }, [page]);

  return { items, loading, hasMore, lastItemRef };
}

function InfiniteList() {
  const fetchPosts = async (page) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
    return res.json();
  };

  const { items, loading, lastItemRef } = useInfiniteScroll(fetchPosts);

  return (
    <div>
      {items.map((post, i) => (
        <div key={post.id} ref={i === items.length - 1 ? lastItemRef : null}>
          <h4>{post.title}</h4>
        </div>
      ))}
      {loading && <p>Loading more...</p>}
    </div>
  );
}

// ========================================
// 3. MODAL WITH PORTAL & FOCUS TRAP
// ========================================

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      modalRef.current?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" ref={modalRef} tabIndex={-1} role="dialog" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  );
}

// ========================================
// 4. PAGINATION WITH URL SYNC
// ========================================

function usePagination(totalItems, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return { currentPage, totalPages, goToPage, nextPage, prevPage, startIndex, endIndex };
}

// ========================================
// 5. OPTIMISTIC TODO (Interview Favorite)
// ========================================

function OptimisticTodo() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", done: false },
    { id: 2, text: "Build Projects", done: false }
  ]);

  const toggleTodo = async (id) => {
    // Optimistic update
    const original = [...todos];
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => Math.random() > 0.3 ? resolve() : reject(new Error("Failed")), 500);
      });
    } catch {
      // Rollback on failure
      setTodos(original);
      alert("Failed to update, reverted!");
    }
  };

  const deleteTodo = async (id) => {
    const original = [...todos];
    setTodos(prev => prev.filter(t => t.id !== id));

    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    } catch {
      setTodos(original);
    }
  };

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
          <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.text}</span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// ========================================
// 6. THROTTLE & DEBOUNCE HOOKS
// ========================================

function useThrottle(value, limit = 300) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

// ========================================
// 7. UNDO/REDO (Complex State)
// ========================================

function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [index, setIndex] = useState(0);

  const state = history[index];
  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  const setState = (newState) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(typeof newState === 'function' ? newState(state) : newState);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  };

  const undo = () => { if (canUndo) setIndex(i => i - 1); };
  const redo = () => { if (canRedo) setIndex(i => i + 1); };

  return { state, setState, undo, redo, canUndo, canRedo };
}

function DrawingApp() {
  const { state: lines, setState: setLines, undo, redo, canUndo, canRedo } = useUndoRedo([]);

  const addLine = (line) => {
    setLines(prev => [...prev, line]);
  };

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
      <button onClick={() => addLine({ id: Date.now(), text: `Line ${lines.length + 1}` })}>
        Add Line
      </button>
      <ul>{lines.map(l => <li key={l.id}>{l.text}</li>)}</ul>
    </div>
  );
}

// ========================================
// 8. POLLING HOOK
// ========================================

function usePolling(fn, interval, enabled = true) {
  const savedCallback = useRef(fn);
  savedCallback.current = fn;

  useEffect(() => {
    if (!enabled) return;
    savedCallback.current(); // Initial call
    const id = setInterval(() => savedCallback.current(), interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
}

function LiveData() {
  const [data, setData] = useState(null);
  const [isPolling, setIsPolling] = useState(true);

  usePolling(async () => {
    const res = await fetch('/api/live-data');
    setData(await res.json());
  }, 5000, isPolling);

  return (
    <div>
      <button onClick={() => setIsPolling(!isPolling)}>
        {isPolling ? "Stop" : "Start"} Polling
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// ========================================
// 9. TYPE-AHEAD / AUTOCOMPLETE
// ========================================

function Autocomplete({ suggestions, onSelect }) {
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (input.length > 0) {
      setFiltered(suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase())));
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [input, suggestions]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      setInput(filtered[activeIndex]);
      onSelect(filtered[activeIndex]);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="autocomplete">
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
      {isOpen && filtered.length > 0 && (
        <ul className="suggestions">
          {filtered.map((item, i) => (
            <li key={item} className={i === activeIndex ? 'active' : ''}
              onClick={() => { setInput(item); onSelect(item); setIsOpen(false); }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ========================================
// 10. DATA TABLE WITH SORT + FILTER
// ========================================

function DataTable({ data, columns }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig]);

  const paginatedData = processedData.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(processedData.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                {col.label} {sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
          <tr>
            {columns.map(col => (
              <th key={col.key}>
                <input placeholder={`Filter ${col.label}`}
                  onChange={e => setFilters(prev => ({ ...prev, [col.key]: e.target.value }))} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr key={i}>
              {columns.map(col => <td key={col.key}>{row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span> {page} / {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}

// ========================================
// INTERVIEW EXERCISE PROMPTS
// ========================================

// These are actual interview questions - try building each in 30-45 min:

// 1. Build a Star Rating component (click to rate, hover preview)
// 2. Build an Accordion (only one open, animated)
// 3. Build a Toast notification system
// 4. Build a File Explorer (tree view, expand/collapse)
// 5. Build a Kanban board (drag-and-drop columns)
// 6. Build a Countdown timer with start/pause/reset
// 7. Build a Multi-select dropdown with search
// 8. Build a Progress bar that fills on scroll
// 9. Build an OTP input (4-6 boxes, auto-focus next)
// 10. Build a Transfer List (move items between two lists)

export { SearchBar, useDebounce, useUndoRedo, usePolling, Autocomplete, DataTable };
