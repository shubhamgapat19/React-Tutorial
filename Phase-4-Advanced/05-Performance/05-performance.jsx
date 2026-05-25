// ========================================
// PERFORMANCE OPTIMIZATION - Practice
// ========================================

import { useState, useMemo, useCallback, memo, useTransition, useDeferredValue, lazy, Suspense } from 'react';
// import { FixedSizeList as List } from 'react-window';

// ========================================
// 1. React.memo - PREVENT CHILD RE-RENDERS
// ========================================

// Without memo: re-renders on every parent render
function ExpensiveChild({ name, onClick }) {
  console.log(`Rendering: ${name}`);
  return <button onClick={onClick}>{name}</button>;
}

// With memo: only re-renders when props change
const MemoizedChild = memo(function MemoizedChild({ name, onClick }) {
  console.log(`Rendering (memo): ${name}`);
  return <button onClick={onClick}>{name}</button>;
});

function ParentDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // Without useCallback: new function every render → memo useless
  // const handleClick = () => console.log("clicked");

  // With useCallback: stable reference → memo works
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>

      {/* This re-renders every time parent renders */}
      <ExpensiveChild name="No Memo" onClick={() => {}} />

      {/* This only re-renders when props change */}
      <MemoizedChild name="With Memo" onClick={handleClick} />
    </div>
  );
}

// ========================================
// 2. useMemo - EXPENSIVE COMPUTATIONS
// ========================================

function SearchableList() {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  // Simulated large dataset
  const items = Array.from({ length: 50000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    category: i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C"
  }));

  // ❌ Without useMemo: filters on EVERY render (even count change)
  // const filtered = items.filter(i => i.name.includes(query));

  // ✅ With useMemo: only filters when query changes
  const filtered = useMemo(() => {
    console.log("Filtering...");
    return items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." />
      <button onClick={() => setCount(c => c + 1)}>Count: {count} (won't refilter)</button>
      <p>Found: {filtered.length} items</p>
      <ul>{filtered.slice(0, 20).map(i => <li key={i.id}>{i.name}</li>)}</ul>
    </div>
  );
}

// ========================================
// 3. useTransition - NON-URGENT UPDATES
// ========================================

function TransitionDemo() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    // Urgent: update input immediately
    setQuery(e.target.value);

    // Non-urgent: can be interrupted
    startTransition(() => {
      const items = Array.from({ length: 10000 }, (_, i) => `Result ${i}`)
        .filter(item => item.includes(e.target.value));
      setResults(items);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search..." />
      {isPending && <p>Updating...</p>}
      <ul>{results.slice(0, 20).map((r, i) => <li key={i}>{r}</li>)}</ul>
    </div>
  );
}

// ========================================
// 4. useDeferredValue
// ========================================

function DeferredDemo() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <p>Immediate: {text}</p>
      <SlowComponent text={deferredText} />
    </div>
  );
}

const SlowComponent = memo(function SlowComponent({ text }) {
  // Simulate expensive render
  const items = Array.from({ length: 5000 }, (_, i) => (
    <div key={i}>{text} - {i}</div>
  ));
  return <div style={{ maxHeight: "200px", overflow: "auto" }}>{items.slice(0, 50)}</div>;
});

// ========================================
// 5. LIST VIRTUALIZATION
// ========================================

// Using react-window for huge lists
/*
function VirtualizedList() {
  const items = Array.from({ length: 100000 }, (_, i) => `Item ${i}`);

  const Row = ({ index, style }) => (
    <div style={style}>{items[index]}</div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </List>
  );
}
*/

// Manual virtualization concept
function SimpleVirtualList() {
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 40;
  const containerHeight = 400;
  const totalItems = 10000;

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, totalItems);
  const visibleItems = Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalItems * itemHeight, position: "relative" }}>
        {visibleItems.map(index => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: index * itemHeight,
              height: itemHeight,
              width: "100%"
            }}
          >
            Item {index}
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// 6. AVOID COMMON PITFALLS
// ========================================

function Pitfalls() {
  const [count, setCount] = useState(0);

  // ❌ BAD: Creates new object every render (breaks memo)
  // <Child style={{ color: "red" }} />

  // ✅ GOOD: Stable reference
  const style = useMemo(() => ({ color: "red" }), []);

  // ❌ BAD: Creates new array every render
  // <List items={data.filter(x => x.active)} />

  // ✅ GOOD: Memoize derived data
  // const activeItems = useMemo(() => data.filter(x => x.active), [data]);

  // ❌ BAD: Inline function breaks memo
  // <Button onClick={() => setCount(count + 1)} />

  // ✅ GOOD: Stable callback
  const handleClick = useCallback(() => setCount(c => c + 1), []);

  return <MemoizedChild name="Optimized" onClick={handleClick} />;
}

// ========================================
// 7. PROFILING CHECKLIST
// ========================================

/*
Performance Optimization Checklist:

1. [ ] Open React DevTools → Profiler
2. [ ] Record an interaction
3. [ ] Identify components that re-render unnecessarily
4. [ ] Apply React.memo to expensive pure components
5. [ ] Memoize callbacks passed to memoized children (useCallback)
6. [ ] Memoize expensive computations (useMemo)
7. [ ] Virtualize long lists (react-window)
8. [ ] Split large contexts into smaller ones
9. [ ] Code-split routes and heavy components (lazy)
10. [ ] Debounce user input that triggers expensive work
*/

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Optimize a parent with 100 child cards
// - Parent has a search input
// - Only filtered cards should re-render

// Exercise 2: Build a virtualized table with 100K rows
// - Sortable columns
// - Only render visible rows

// Exercise 3: Profile and optimize a slow component
// - Use React DevTools Profiler
// - Identify and fix re-render issues

export default ParentDemo;
