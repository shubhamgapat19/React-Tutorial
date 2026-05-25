// ========================================
// CUSTOM HOOKS - Practice Examples
// ========================================

import { useState, useEffect, useRef, useCallback } from 'react';

// ========================================
// 1. useToggle - Simple boolean toggle
// ========================================

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  return { value, toggle, setTrue, setFalse };
}

// Usage
function ToggleDemo() {
  const modal = useToggle(false);
  const darkMode = useToggle(false);

  return (
    <div className={darkMode.value ? "dark" : "light"}>
      <button onClick={darkMode.toggle}>
        {darkMode.value ? "☀️ Light" : "🌙 Dark"}
      </button>
      <button onClick={modal.setTrue}>Open Modal</button>
      {modal.value && (
        <div className="modal">
          <p>Modal Content</p>
          <button onClick={modal.setFalse}>Close</button>
        </div>
      )}
    </div>
  );
}

// ========================================
// 2. useFetch - Data fetching
// ========================================

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();

        if (!isCancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { isCancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage
function UsersList() {
  const { data: users, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// ========================================
// 3. useLocalStorage - Persistent state
// ========================================

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  const removeValue = () => {
    setStoredValue(initialValue);
    window.localStorage.removeItem(key);
  };

  return [storedValue, setValue, removeValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [lang, setLang] = useLocalStorage("language", "en");

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
    </div>
  );
}

// ========================================
// 4. useDebounce - Debounce a value
// ========================================

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchWithDebounce() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { data, loading } = useFetch(
    debouncedQuery
      ? `https://jsonplaceholder.typicode.com/users?q=${debouncedQuery}`
      : null
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <p>Searching...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

// ========================================
// 5. useForm - Form management
// ========================================

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      onSubmit(values);
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset };
}

// Usage
function ContactForm() {
  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Required";
    if (!values.email) errors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid email";
    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { name: "", email: "", message: "" },
    validate
  );

  return (
    <form onSubmit={handleSubmit((data) => console.log("Submit:", data))}>
      <input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
      {touched.name && errors.name && <span>{errors.name}</span>}

      <input name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
      {touched.email && errors.email && <span>{errors.email}</span>}

      <textarea name="message" value={values.message} onChange={handleChange} />
      <button type="submit">Send</button>
    </form>
  );
}

// ========================================
// 6. useOnClickOutside
// ========================================

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// Usage
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>Profile</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      )}
    </div>
  );
}

// ========================================
// 7. useWindowSize
// ========================================

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

// ========================================
// 8. usePrevious - Track previous value
// ========================================

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// ========================================
// 9. useInterval - Declarative setInterval
// ========================================

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Usage
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(() => setSeconds(s => s + 1), isRunning ? 1000 : null);

  return (
    <div>
      <h2>{seconds}s</h2>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={() => { setSeconds(0); setIsRunning(false); }}>Reset</button>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Create useCounter(initialValue, step)
// - increment, decrement, reset, setValue

// Exercise 2: Create useAsync(asyncFn)
// - execute, data, loading, error states
// - Run async function and track status

// Exercise 3: Create useMediaQuery(query)
// - Returns boolean if media query matches
// - Usage: useMediaQuery("(max-width: 768px)")

// Exercise 4: Create useCopyToClipboard()
// - copy(text) function
// - isCopied state that resets after 2s

export { useToggle, useFetch, useLocalStorage, useDebounce, useForm };
