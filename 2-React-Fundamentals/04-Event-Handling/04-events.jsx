// ========================================
// EVENT HANDLING - Practice Examples
// ========================================

import { useState } from 'react';

// ========================================
// 1. CLICK EVENTS
// ========================================

function ClickExamples() {
  const [message, setMessage] = useState("Click a button!");

  // Named handler
  const handleClick = () => {
    setMessage("Button was clicked!");
  };

  // Handler with parameter
  const handleGreet = (name) => {
    setMessage(`Hello, ${name}!`);
  };

  // Handler with event object
  const handleButtonInfo = (e) => {
    setMessage(`Clicked: ${e.target.textContent}`);
  };

  return (
    <div>
      <p>{message}</p>
      {/* Named handler */}
      <button onClick={handleClick}>Click Me</button>
      
      {/* Inline handler */}
      <button onClick={() => setMessage("Inline click!")}>Inline</button>
      
      {/* With parameter */}
      <button onClick={() => handleGreet("React")}>Greet React</button>
      <button onClick={() => handleGreet("World")}>Greet World</button>
      
      {/* With event object */}
      <button onClick={handleButtonInfo}>Button A</button>
      <button onClick={handleButtonInfo}>Button B</button>
    </div>
  );
}

// ========================================
// 2. INPUT EVENTS (onChange)
// ========================================

function InputEvents() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: ""
  });

  // Single handler for multiple inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}

// ========================================
// 3. FORM SUBMIT
// ========================================

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.email) newErrors.email = "Email required";
    if (!credentials.password) newErrors.password = "Password required";
    if (credentials.password.length < 6) newErrors.password = "Min 6 characters";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload!
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting:", credentials);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Login successful!");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

// ========================================
// 4. KEYBOARD EVENTS
// ========================================

function KeyboardEvents() {
  const [keys, setKeys] = useState([]);
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    // Enter to submit
    if (e.key === "Enter") {
      setKeys(prev => [...prev, input]);
      setInput("");
    }
    // Escape to clear
    if (e.key === "Escape") {
      setInput("");
    }
  };

  // Keyboard shortcuts
  const handleGlobalKey = (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      console.log("Ctrl+S pressed - Save!");
    }
  };

  return (
    <div onKeyDown={handleGlobalKey} tabIndex={0}>
      <h3>Press Enter to add, Escape to clear</h3>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter"
      />
      <ul>
        {keys.map((key, i) => <li key={i}>{key}</li>)}
      </ul>
    </div>
  );
}

// ========================================
// 5. MOUSE EVENTS
// ========================================

function MouseEvents() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDoubleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: "300px", border: "1px solid" }}>
      <p>Mouse: ({position.x}, {position.y})</p>

      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ 
          padding: "20px",
          backgroundColor: isHovering ? "lightblue" : "white"
        }}
      >
        {isHovering ? "Hovering!" : "Hover over me"}
      </div>

      <div onDoubleClick={handleDoubleClick}>
        Double-click count: {clickCount}
      </div>
    </div>
  );
}

// ========================================
// 6. FOCUS & BLUR
// ========================================

function FocusExample() {
  const [focused, setFocused] = useState("");
  const [touched, setTouched] = useState({});

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = (field) => {
    setFocused("");
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div>
      <p>Currently focused: {focused || "none"}</p>

      <input
        placeholder="Name"
        onFocus={() => handleFocus("name")}
        onBlur={() => handleBlur("name")}
        style={{ borderColor: focused === "name" ? "blue" : "gray" }}
      />

      <input
        placeholder="Email"
        onFocus={() => handleFocus("email")}
        onBlur={() => handleBlur("email")}
        style={{ borderColor: focused === "email" ? "blue" : "gray" }}
      />

      <p>Touched fields: {Object.keys(touched).join(", ")}</p>
    </div>
  );
}

// ========================================
// 7. EVENT DELEGATION & BUBBLING
// ========================================

function EventBubbling() {
  const handleParentClick = () => {
    console.log("Parent clicked");
  };

  const handleChildClick = (e) => {
    e.stopPropagation(); // Prevents bubbling to parent
    console.log("Child clicked");
  };

  return (
    <div onClick={handleParentClick} style={{ padding: "40px", background: "#eee" }}>
      <p>Parent (click me)</p>
      <button onClick={handleChildClick}>
        Child (click won't bubble)
      </button>
    </div>
  );
}

// ========================================
// 8. DRAG AND DROP BASICS
// ========================================

function DragDropBasic() {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (index) => {
    setDragging(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDrop = (index) => {
    const newItems = [...items];
    const draggedItem = newItems[dragging];
    newItems.splice(dragging, 1);
    newItems.splice(index, 0, draggedItem);
    setItems(newItems);
    setDragging(null);
  };

  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={item}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          style={{
            padding: "10px",
            margin: "5px",
            background: dragging === index ? "lightblue" : "white",
            cursor: "grab"
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

// ========================================
// 9. DEBOUNCED SEARCH INPUT
// ========================================

function SearchWithDebounce() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Simple debounce implementation
  const handleSearch = (value) => {
    setQuery(value);
    // In real app, you'd debounce the API call
    const allItems = ["React", "Redux", "Router", "Relay", "Remix"];
    const filtered = allItems.filter(item =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a calculator with buttons for +, -, *, /
// Click number buttons and operation buttons

// Exercise 2: Create a password strength checker
// onChange - check length, uppercase, numbers, symbols
// Show strength meter (weak/medium/strong)

// Exercise 3: Build a color palette clicker
// Array of color boxes, onClick changes background
// onDoubleClick copies hex to clipboard

// Exercise 4: Create a keyboard-controlled game character
// Arrow keys move a div around the screen
// onKeyDown to move, display current position

export default ClickExamples;
