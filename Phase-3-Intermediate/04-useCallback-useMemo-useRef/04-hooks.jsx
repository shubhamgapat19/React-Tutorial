// ========================================
// useCallback, useMemo, useRef - Practice
// ========================================

import { useState, useRef, useMemo, useCallback, useEffect, memo } from 'react';

// ========================================
// 1. useRef - DOM ACCESS
// ========================================

function FocusInput() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus();
    inputRef.current.style.borderColor = "blue";
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Click button to focus me" />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}

function VideoPlayer() {
  const videoRef = useRef(null);

  return (
    <div>
      <video ref={videoRef} src="video.mp4" />
      <button onClick={() => videoRef.current.play()}>Play</button>
      <button onClick={() => videoRef.current.pause()}>Pause</button>
    </div>
  );
}

// ========================================
// 2. useRef - PERSIST VALUES
// ========================================

function RenderCounter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  // Increments every render but doesn't CAUSE re-render
  renderCount.current++;

  return (
    <div>
      <p>Count: {count}</p>
      <p>Component rendered: {renderCount.current} times</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

function StopwatchWithRef() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 10);
    }, 10);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  return (
    <div>
      <h2>{formatTime(time)}</h2>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// ========================================
// 3. useMemo - EXPENSIVE CALCULATIONS
// ========================================

function FilteredList() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    price: Math.floor(Math.random() * 10000)
  }));

  // Without useMemo: filters + sorts on EVERY render
  // With useMemo: only recalculates when query or sortBy changes
  const filteredAndSorted = useMemo(() => {
    console.log("Computing filtered list...");
    return items
      .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return a.price - b.price;
      });
  }, [query, sortBy]); // Only recalculate when these change

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter..." />
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="name">By Name</option>
        <option value="price">By Price</option>
      </select>
      <p>Showing {filteredAndSorted.length} items</p>
      <ul>
        {filteredAndSorted.slice(0, 20).map(item => (
          <li key={item.id}>{item.name} - ₹{item.price}</li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// 4. useMemo - DERIVED STATE
// ========================================

function CartSummary() {
  const [items, setItems] = useState([
    { id: 1, name: "Laptop", price: 50000, quantity: 1 },
    { id: 2, name: "Mouse", price: 500, quantity: 2 },
    { id: 3, name: "Keyboard", price: 2000, quantity: 1 }
  ]);
  const [coupon, setCoupon] = useState(0);

  // Memoized calculations
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const tax = useMemo(() => subtotal * 0.18, [subtotal]);
  const discount = useMemo(() => subtotal * (coupon / 100), [subtotal, coupon]);
  const total = useMemo(() => subtotal + tax - discount, [subtotal, tax, discount]);

  return (
    <div>
      <p>Subtotal: ₹{subtotal}</p>
      <p>Tax (18%): ₹{tax.toFixed(2)}</p>
      <p>Discount: -₹{discount.toFixed(2)}</p>
      <p><strong>Total: ₹{total.toFixed(2)}</strong></p>
      <input type="number" value={coupon} onChange={e => setCoupon(Number(e.target.value))} placeholder="Coupon %" />
    </div>
  );
}

// ========================================
// 5. useCallback - WITH MEMOIZED CHILDREN
// ========================================

// Memoized child component (only re-renders if props change)
const ExpensiveChild = memo(function ExpensiveChild({ onClick, label }) {
  console.log(`Rendering: ${label}`);
  return <button onClick={onClick}>{label}</button>;
});

function ParentWithCallback() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // Without useCallback: new function every render → child re-renders
  // With useCallback: same function reference → child skips re-render
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setCount(0);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Type here..." />

      {/* These won't re-render when 'text' changes */}
      <ExpensiveChild onClick={handleIncrement} label="Increment" />
      <ExpensiveChild onClick={handleReset} label="Reset" />
    </div>
  );
}

// ========================================
// 6. useCallback - IN EFFECT DEPENDENCIES
// ========================================

function SearchComponent({ userId }) {
  const [results, setResults] = useState([]);

  // Memoize so useEffect doesn't run on every render
  const fetchResults = useCallback(async () => {
    const res = await fetch(`/api/search?userId=${userId}`);
    const data = await res.json();
    setResults(data);
  }, [userId]); // Only changes when userId changes

  useEffect(() => {
    fetchResults();
  }, [fetchResults]); // Safe dependency

  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;
}

// ========================================
// 7. COMBINING ALL THREE
// ========================================

function DataTable({ data }) {
  const [sortField, setSortField] = useState("name");
  const [filterText, setFilterText] = useState("");
  const tableRef = useRef(null);

  // useMemo for expensive derived data
  const processedData = useMemo(() => {
    return data
      .filter(item => item.name.toLowerCase().includes(filterText.toLowerCase()))
      .sort((a, b) => a[sortField] > b[sortField] ? 1 : -1);
  }, [data, sortField, filterText]);

  // useCallback for memoized child handlers
  const handleSort = useCallback((field) => {
    setSortField(field);
  }, []);

  // useRef for DOM access
  const scrollToTop = () => {
    tableRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <input value={filterText} onChange={e => setFilterText(e.target.value)} placeholder="Filter..." />
      <div ref={tableRef} style={{ maxHeight: "300px", overflow: "auto" }}>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>Name</th>
              <th onClick={() => handleSort("price")}>Price</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={scrollToTop}>Scroll to Top</button>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build an auto-scrolling chat
// - useRef for scroll container, auto-scroll on new message
// - useCallback for send message handler

// Exercise 2: Build a search with useMemo
// - Large dataset (1000+ items)
// - Filter + sort + paginate using useMemo

// Exercise 3: Build a canvas drawing app
// - useRef for canvas element
// - Track mouse position without re-renders

export default ParentWithCallback;
