// ========================================
// CONDITIONAL RENDERING & LISTS - Practice
// ========================================

import { useState } from 'react';

// ========================================
// 1. TERNARY OPERATOR
// ========================================

function AuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h2>Welcome back, User!</h2>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Please sign in</h2>
          <button onClick={() => setIsLoggedIn(true)}>Login</button>
        </div>
      )}
    </div>
  );
}

// ========================================
// 2. LOGICAL AND (&&)
// ========================================

function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New message from Alice" },
    { id: 2, text: "Your post got 10 likes" }
  ]);
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <h3>
        Notifications
        {notifications.length > 0 && (
          <span className="badge">{notifications.length}</span>
        )}
      </h3>

      {showAll && (
        <ul>
          {notifications.map(n => (
            <li key={n.id}>{n.text}</li>
          ))}
        </ul>
      )}

      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? "Hide" : "Show"} Notifications
      </button>

      {notifications.length === 0 && <p>No notifications!</p>}
    </div>
  );
}

// ========================================
// 3. EARLY RETURN PATTERN
// ========================================

function DataDisplay({ isLoading, error, data }) {
  // Handle loading state
  if (isLoading) {
    return <div className="spinner">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Handle empty state
  if (!data || data.length === 0) {
    return <div className="empty">No data available</div>;
  }

  // Happy path - render data
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

function DataDisplayDemo() {
  const [state, setState] = useState("loading");

  const scenarios = {
    loading: { isLoading: true, error: null, data: null },
    error: { isLoading: false, error: "Failed to fetch", data: null },
    empty: { isLoading: false, error: null, data: [] },
    success: { 
      isLoading: false, error: null, 
      data: [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }] 
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setState("loading")}>Loading</button>
        <button onClick={() => setState("error")}>Error</button>
        <button onClick={() => setState("empty")}>Empty</button>
        <button onClick={() => setState("success")}>Success</button>
      </div>
      <DataDisplay {...scenarios[state]} />
    </div>
  );
}

// ========================================
// 4. SWITCH / OBJECT MAP PATTERN
// ========================================

function StatusBadge({ status }) {
  // Object map pattern
  const statusConfig = {
    pending: { color: "#ffc107", label: "Pending" },
    active: { color: "#28a745", label: "Active" },
    blocked: { color: "#dc3545", label: "Blocked" },
    completed: { color: "#17a2b8", label: "Completed" }
  };

  const config = statusConfig[status] || { color: "gray", label: "Unknown" };

  return (
    <span style={{ 
      backgroundColor: config.color, 
      padding: "4px 8px",
      borderRadius: "4px",
      color: "white"
    }}>
      {config.label}
    </span>
  );
}

function MultiStepForm() {
  const [step, setStep] = useState(1);

  // Render different content based on step
  const renderStep = () => {
    switch (step) {
      case 1: return <div><h2>Step 1: Personal Info</h2><input placeholder="Name" /></div>;
      case 2: return <div><h2>Step 2: Address</h2><input placeholder="City" /></div>;
      case 3: return <div><h2>Step 3: Review</h2><p>All good!</p></div>;
      default: return null;
    }
  };

  return (
    <div>
      {renderStep()}
      <div>
        {step > 1 && <button onClick={() => setStep(step - 1)}>Back</button>}
        {step < 3 && <button onClick={() => setStep(step + 1)}>Next</button>}
        {step === 3 && <button onClick={() => alert("Submitted!")}>Submit</button>}
      </div>
    </div>
  );
}

// ========================================
// 5. RENDERING LISTS
// ========================================

function BasicList() {
  const fruits = ["Apple", "Banana", "Cherry", "Mango", "Orange"];

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}

// With objects (preferred - use id as key)
function UserList() {
  const users = [
    { id: 1, name: "Alice", role: "Admin", active: true },
    { id: 2, name: "Bob", role: "Developer", active: true },
    { id: 3, name: "Charlie", role: "Designer", active: false },
    { id: 4, name: "Diana", role: "Developer", active: true }
  ];

  return (
    <div>
      <h3>Team Members ({users.length})</h3>
      {users.map(user => (
        <div key={user.id} className="user-row">
          <span>{user.name}</span>
          <span>{user.role}</span>
          <StatusBadge status={user.active ? "active" : "blocked"} />
        </div>
      ))}
    </div>
  );
}

// ========================================
// 6. FILTER + MAP
// ========================================

function FilterableList() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const tasks = [
    { id: 1, text: "Learn React", status: "done" },
    { id: 2, text: "Build Todo App", status: "in-progress" },
    { id: 3, text: "Write Tests", status: "todo" },
    { id: 4, text: "Deploy to Vercel", status: "todo" },
    { id: 5, text: "Setup CI/CD", status: "in-progress" }
  ];

  const filteredTasks = tasks
    .filter(task => filter === "all" || task.status === filter)
    .filter(task => task.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        <button onClick={() => setFilter("all")}>All ({tasks.length})</button>
        <button onClick={() => setFilter("todo")}>
          Todo ({tasks.filter(t => t.status === "todo").length})
        </button>
        <button onClick={() => setFilter("in-progress")}>
          In Progress ({tasks.filter(t => t.status === "in-progress").length})
        </button>
        <button onClick={() => setFilter("done")}>
          Done ({tasks.filter(t => t.status === "done").length})
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks match your criteria</p>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id}>
              <StatusBadge status={task.status === "done" ? "completed" : task.status === "in-progress" ? "active" : "pending"} />
              {task.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ========================================
// 7. SORT LISTS
// ========================================

function SortableTable() {
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const products = [
    { id: 1, name: "Laptop", price: 50000, rating: 4.5 },
    { id: 2, name: "Phone", price: 25000, rating: 4.2 },
    { id: 3, name: "Tablet", price: 35000, rating: 4.0 },
    { id: 4, name: "Watch", price: 15000, rating: 4.8 }
  ];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sorted = [...products].sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;
    if (typeof a[sortBy] === "string") {
      return a[sortBy].localeCompare(b[sortBy]) * modifier;
    }
    return (a[sortBy] - b[sortBy]) * modifier;
  });

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => handleSort("name")}>Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}</th>
          <th onClick={() => handleSort("price")}>Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}</th>
          <th onClick={() => handleSort("rating")}>Rating {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(p => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>₹{p.price}</td>
            <td>{p.rating}⭐</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ========================================
// 8. GROUPED LISTS
// ========================================

function GroupedList() {
  const contacts = [
    { id: 1, name: "Alice", group: "A" },
    { id: 2, name: "Andrew", group: "A" },
    { id: 3, name: "Bob", group: "B" },
    { id: 4, name: "Charlie", group: "C" },
    { id: 5, name: "Chris", group: "C" }
  ];

  // Group by first letter
  const grouped = contacts.reduce((groups, contact) => {
    const letter = contact.group;
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(contact);
    return groups;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([letter, people]) => (
        <div key={letter}>
          <h3>{letter}</h3>
          <ul>
            {people.map(person => (
              <li key={person.id}>{person.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ========================================
// 9. DYNAMIC LIST WITH ADD/REMOVE
// ========================================

function DynamicList() {
  const [items, setItems] = useState([
    { id: 1, text: "First item" },
    { id: 2, text: "Second item" }
  ]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems(prev => [...prev, { id: Date.now(), text: newItem }]);
    setNewItem("");
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div>
      <div>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add item..."
        />
        <button onClick={addItem}>Add</button>
      </div>

      {items.length === 0 && <p>List is empty. Add some items!</p>}

      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.text}
            <button onClick={() => removeItem(item.id)}>×</button>
          </li>
        ))}
      </ul>

      <p>Total: {items.length} items</p>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a tab component
// - Array of tabs [{id, label, content}]
// - Click tab to show its content
// - Highlight active tab

// Exercise 2: Build a user directory
// - List of users with search filter
// - Show "No results" when filter returns empty
// - Toggle between grid/list view

// Exercise 3: Build a notification center
// - Notifications: [{id, type, message, read}]
// - Filter: all, unread, read
// - Mark as read on click
// - Different styles for different types

// Exercise 4: Build a leaderboard
// - Players: [{name, score, country}]
// - Sort by score (default desc)
// - Filter by country
// - Show rank numbers

export default FilterableList;
