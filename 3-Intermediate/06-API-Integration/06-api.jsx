// ========================================
// API INTEGRATION - Practice Examples
// ========================================

import { useState, useEffect } from 'react';

// ========================================
// 1. BASIC FETCH - GET
// ========================================

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}

// ========================================
// 2. POST REQUEST
// ========================================

function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId: 1 })
      });

      if (!response.ok) throw new Error("Failed to create post");
      const data = await response.json();
      setResult(data);
      setTitle("");
      setBody("");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Body" />
        <button disabled={submitting}>{submitting ? "Posting..." : "Create Post"}</button>
      </form>
      {result && <pre>Created: {JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

// ========================================
// 3. REUSABLE API SERVICE
// ========================================

const API_BASE = "https://jsonplaceholder.typicode.com";

const apiService = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`GET ${endpoint} failed: ${response.status}`);
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`POST ${endpoint} failed: ${response.status}`);
    return response.json();
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`PUT ${endpoint} failed`);
    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`DELETE ${endpoint} failed`);
    return response.ok;
  }
};

// ========================================
// 4. CUSTOM HOOK FOR API
// ========================================

function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.get(endpoint);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}

// Usage
function PostsList() {
  const { data: posts, loading, error, refetch } = useApi("/posts?_limit=10");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error} <button onClick={refetch}>Retry</button></p>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

// ========================================
// 5. CRUD OPERATIONS
// ========================================

function TodoCRUD() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  // READ
  useEffect(() => {
    apiService.get("/todos?_limit=5").then(data => {
      setTodos(data);
      setLoading(false);
    });
  }, []);

  // CREATE
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const created = await apiService.post("/todos", {
      title: newTodo, completed: false, userId: 1
    });
    setTodos(prev => [created, ...prev]);
    setNewTodo("");
  };

  // UPDATE
  const toggleTodo = async (todo) => {
    const updated = await apiService.put(`/todos/${todo.id}`, {
      ...todo, completed: !todo.completed
    });
    setTodos(prev => prev.map(t => t.id === todo.id ? updated : t));
  };

  // DELETE
  const deleteTodo = async (id) => {
    await apiService.delete(`/todos/${id}`);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <input value={newTodo} onChange={e => setNewTodo(e.target.value)} />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo)} />
            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// 6. PAGINATION
// ========================================

function PaginatedPosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/posts?_page=${page}&_limit=${limit}`)
      .then(res => {
        const total = res.headers.get("X-Total-Count");
        setHasMore(page * limit < Number(total));
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, [page]);

  return (
    <div>
      {loading ? <p>Loading...</p> : (
        posts.map(post => <div key={post.id}><h4>{post.title}</h4></div>)
      )}
      <div>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span> Page {page} </span>
        <button disabled={!hasMore} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}

// ========================================
// 7. INFINITE SCROLL
// ========================================

function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/posts?_page=${page}&_limit=10`);
    const data = await res.json();
    setItems(prev => [...prev, ...data]);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  useEffect(() => { loadMore(); }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div>
      {items.map((item, i) => <div key={i}><h4>{item.title}</h4></div>)}
      {loading && <p>Loading more...</p>}
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a GitHub user search
// API: https://api.github.com/search/users?q={query}
// Show avatar, username, profile link

// Exercise 2: Build a weather dashboard
// Fetch weather for multiple cities in parallel
// Display cards with temp, description, icon

// Exercise 3: Build a CRUD app for "contacts"
// - List, Create, Edit, Delete
// - Use a mock API (jsonplaceholder or json-server)

export default TodoCRUD;
