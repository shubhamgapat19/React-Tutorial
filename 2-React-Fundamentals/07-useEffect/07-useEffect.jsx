// ========================================
// useEffect & LIFECYCLE - Practice Examples
// ========================================

import { useState, useEffect } from 'react';

// ========================================
// 1. BASIC useEffect - Runs every render
// ========================================

function RenderLogger() {
  const [count, setCount] = useState(0);

  // Runs after EVERY render
  useEffect(() => {
    console.log("Component rendered! Count:", count);
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// ========================================
// 2. MOUNT ONLY - Empty dependency array []
// ========================================

function MountExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Runs ONCE when component mounts
  useEffect(() => {
    console.log("Component mounted!");

    // Simulating API call
    setTimeout(() => {
      setData({ message: "Data loaded!" });
      setLoading(false);
    }, 2000);
  }, []); // Empty array = run once

  if (loading) return <p>Loading...</p>;
  return <p>{data.message}</p>;
}

// ========================================
// 3. DEPENDENCY TRACKING
// ========================================

function DependencyExample() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);

  // Runs when 'userId' changes
  useEffect(() => {
    console.log("Fetching user:", userId);
    
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Only re-runs when userId changes

  return (
    <div>
      <div>
        {[1, 2, 3, 4, 5].map(id => (
          <button key={id} onClick={() => setUserId(id)}>
            User {id}
          </button>
        ))}
      </div>
      {user && (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.phone}</p>
        </div>
      )}
    </div>
  );
}

// ========================================
// 4. CLEANUP FUNCTION
// ========================================

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup: clear interval when component unmounts
    // or when isRunning changes
    return () => {
      console.log("Cleaning up interval");
      clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <div>
      <h2>{seconds}s</h2>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}

// ========================================
// 5. DOCUMENT TITLE UPDATE
// ========================================

function DocumentTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `(${count}) Notifications`;

    return () => {
      document.title = "React App"; // Reset on unmount
    };
  }, [count]);

  return (
    <div>
      <p>Check the browser tab title!</p>
      <button onClick={() => setCount(count + 1)}>Add Notification</button>
      <button onClick={() => setCount(0)}>Clear</button>
    </div>
  );
}

// ========================================
// 6. EVENT LISTENERS
// ========================================

function WindowResize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup: remove listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <p>Window: {windowSize.width} × {windowSize.height}</p>
    </div>
  );
}

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="scroll-indicator">Scrolled: {scrollY}px</div>;
}

// ========================================
// 7. DATA FETCHING PATTERN
// ========================================

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false; // Prevent setting state after unmount

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        
        if (!isCancelled) {
          setUser(data);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Cleanup: prevent state updates after unmount
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  if (loading) return <p>Loading user...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.company?.name}</p>
    </div>
  );
}

// ========================================
// 8. LOCAL STORAGE SYNC
// ========================================

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <div className={`app ${theme}`}>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </div>
  );
}

// ========================================
// 9. DEBOUNCED SEARCH
// ========================================

function DebouncedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Debounce: wait 500ms after user stops typing
    const timer = setTimeout(() => {
      fetch(`https://jsonplaceholder.typicode.com/users?q=${query}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        });
    }, 500);

    // Cleanup: cancel previous timer if user types again
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      {loading && <p>Searching...</p>}
      <ul>
        {results.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// 10. ONLINE STATUS TRACKER
// ========================================

function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <div style={{ color: isOnline ? "green" : "red" }}>
      {isOnline ? "🟢 Online" : "🔴 Offline"}
    </div>
  );
}

// ========================================
// 11. MULTIPLE EFFECTS (Separation of Concerns)
// ========================================

function Dashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Effect 1: Fetch user data
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  // Effect 2: Fetch user posts
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then(res => res.json())
      .then(setPosts);
  }, [userId]);

  // Effect 3: Update document title
  useEffect(() => {
    if (user) {
      document.title = `${user.name}'s Dashboard`;
    }
  }, [user]);

  return (
    <div>
      {user && <h2>{user.name}</h2>}
      <p>{posts.length} posts</p>
    </div>
  );
}

// ========================================
// COMMON MISTAKES
// ========================================

// ❌ MISTAKE 1: Async function directly in useEffect
function Wrong1() {
  // useEffect(() => async () => { ... }, []); // WRONG!

  // ✅ CORRECT: Define async inside, then call it
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/data");
      const data = await res.json();
    };
    fetchData();
  }, []);
}

// ❌ MISTAKE 2: Missing dependency
function Wrong2() {
  const [count, setCount] = useState(0);
  
  // Missing 'count' in deps - will always log 0
  // useEffect(() => {
  //   console.log(count);
  // }, []);
  
  // ✅ CORRECT
  useEffect(() => {
    console.log(count);
  }, [count]);
}

// ❌ MISTAKE 3: No cleanup for subscriptions
function Wrong3() {
  // This adds new listener on every render without removing old ones!
  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  // });

  // ✅ CORRECT: Always cleanup
  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a countdown timer
// - Input for seconds, Start button
// - Counts down to 0, then shows "Time's up!"
// - Stop/Reset buttons

// Exercise 2: Build a real-time clock
// - Shows current time HH:MM:SS
// - Updates every second
// - Properly cleans up interval

// Exercise 3: Build a "fetch on scroll" infinite list
// - Load 10 items initially
// - When user scrolls to bottom, load 10 more
// - Show loading indicator

// Exercise 4: Build a form with auto-save
// - Save to localStorage after 2 seconds of no typing
// - Load from localStorage on mount
// - Show "Saving..." indicator

export default Timer;
