// ========================================
// FORMS & CONTROLLED COMPONENTS - Practice
// ========================================

import { useState } from 'react';

// ========================================
// 1. BASIC CONTROLLED INPUT
// ========================================

function BasicInput() {
  const [name, setName] = useState("");

  return (
    <div>
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name || "..."}!</p>
    </div>
  );
}

// ========================================
// 2. MULTI-FIELD FORM
// ========================================

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    bio: "",
    country: "",
    gender: "",
    newsletter: false,
    terms: false
  });

  // Generic handler for all inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleReset = () => {
    setFormData({
      username: "", email: "", password: "", confirmPassword: "",
      age: "", bio: "", country: "", gender: "",
      newsletter: false, terms: false
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Text inputs */}
      <div>
        <label>Username:</label>
        <input name="username" value={formData.username} onChange={handleChange} />
      </div>

      <div>
        <label>Email:</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} />
      </div>

      <div>
        <label>Password:</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} />
      </div>

      <div>
        <label>Confirm Password:</label>
        <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
      </div>

      {/* Number input */}
      <div>
        <label>Age:</label>
        <input name="age" type="number" min="18" max="100" value={formData.age} onChange={handleChange} />
      </div>

      {/* Textarea */}
      <div>
        <label>Bio:</label>
        <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} />
        <small>{formData.bio.length}/200 characters</small>
      </div>

      {/* Select */}
      <div>
        <label>Country:</label>
        <select name="country" value={formData.country} onChange={handleChange}>
          <option value="">Select country</option>
          <option value="india">India</option>
          <option value="usa">USA</option>
          <option value="uk">UK</option>
          <option value="canada">Canada</option>
        </select>
      </div>

      {/* Radio buttons */}
      <div>
        <label>Gender:</label>
        <label>
          <input type="radio" name="gender" value="male"
            checked={formData.gender === "male"} onChange={handleChange} /> Male
        </label>
        <label>
          <input type="radio" name="gender" value="female"
            checked={formData.gender === "female"} onChange={handleChange} /> Female
        </label>
        <label>
          <input type="radio" name="gender" value="other"
            checked={formData.gender === "other"} onChange={handleChange} /> Other
        </label>
      </div>

      {/* Checkboxes */}
      <div>
        <label>
          <input type="checkbox" name="newsletter"
            checked={formData.newsletter} onChange={handleChange} />
          Subscribe to newsletter
        </label>
      </div>

      <div>
        <label>
          <input type="checkbox" name="terms"
            checked={formData.terms} onChange={handleChange} />
          I agree to terms & conditions
        </label>
      </div>

      {/* Buttons */}
      <button type="submit" disabled={!formData.terms}>Register</button>
      <button type="button" onClick={handleReset}>Reset</button>

      {/* Debug */}
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </form>
  );
}

// ========================================
// 3. FORM VALIDATION
// ========================================

function ValidatedForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (data) => {
    const errors = {};

    // Email validation
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Invalid email format";
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])/.test(data.password)) {
      errors.password = "Password must include uppercase letter";
    } else if (!/(?=.*[0-9])/.test(data.password)) {
      errors.password = "Password must include a number";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);

    // Validate on change (only if field was touched)
    if (touched[name]) {
      const newErrors = validate(newData);
      setErrors(prev => ({ ...prev, [name]: newErrors[name] || "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const newErrors = validate(formData);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] || "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all as touched
    setTouched({ email: true, password: true });
    
    // Validate all
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form is valid! Submitting:", formData);
      alert("Form submitted successfully!");
    }
  };

  const isFieldInvalid = (field) => touched[field] && errors[field];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ borderColor: isFieldInvalid("email") ? "red" : "" }}
        />
        {isFieldInvalid("email") && (
          <span style={{ color: "red" }}>{errors.email}</span>
        )}
      </div>

      <div>
        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ borderColor: isFieldInvalid("password") ? "red" : "" }}
        />
        {isFieldInvalid("password") && (
          <span style={{ color: "red" }}>{errors.password}</span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

// ========================================
// 4. DYNAMIC FORM FIELDS
// ========================================

function DynamicSkillsForm() {
  const [skills, setSkills] = useState([""]);

  const addSkill = () => {
    setSkills(prev => [...prev, ""]);
  };

  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const updateSkill = (index, value) => {
    setSkills(prev => prev.map((skill, i) => i === index ? value : skill));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validSkills = skills.filter(s => s.trim() !== "");
    console.log("Skills:", validSkills);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Your Skills</h3>
      {skills.map((skill, index) => (
        <div key={index}>
          <input
            value={skill}
            onChange={(e) => updateSkill(index, e.target.value)}
            placeholder={`Skill ${index + 1}`}
          />
          {skills.length > 1 && (
            <button type="button" onClick={() => removeSkill(index)}>Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addSkill}>+ Add Skill</button>
      <button type="submit">Save</button>
    </form>
  );
}

// ========================================
// 5. MULTI-STEP FORM
// ========================================

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: "",
    lastName: "",
    email: "",
    // Step 2
    address: "",
    city: "",
    pincode: "",
    // Step 3 - review
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final submission:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>Step {step} of 3</div>

      {step === 1 && (
        <div>
          <h3>Personal Details</h3>
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <button type="button" onClick={next}>Next →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3>Address</h3>
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
          <button type="button" onClick={back}>← Back</button>
          <button type="button" onClick={next}>Next →</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>Review</h3>
          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Address:</strong> {formData.address}, {formData.city} - {formData.pincode}</p>
          <button type="button" onClick={back}>← Back</button>
          <button type="submit">Submit</button>
        </div>
      )}
    </form>
  );
}

// ========================================
// 6. SEARCH FILTER FORM
// ========================================

function SearchFilter() {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priceMin: "",
    priceMax: "",
    inStock: false
  });

  const products = [
    { id: 1, name: "Laptop", category: "electronics", price: 50000, inStock: true },
    { id: 2, name: "T-Shirt", category: "clothing", price: 500, inStock: true },
    { id: 3, name: "Phone", category: "electronics", price: 25000, inStock: false },
    { id: 4, name: "Book", category: "books", price: 300, inStock: true }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()))
    .filter(p => filters.category === "all" || p.category === filters.category)
    .filter(p => !filters.priceMin || p.price >= Number(filters.priceMin))
    .filter(p => !filters.priceMax || p.price <= Number(filters.priceMax))
    .filter(p => !filters.inStock || p.inStock);

  return (
    <div>
      <div className="filters">
        <input name="search" placeholder="Search..." value={filters.search} onChange={handleChange} />

        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>

        <input name="priceMin" type="number" placeholder="Min ₹" value={filters.priceMin} onChange={handleChange} />
        <input name="priceMax" type="number" placeholder="Max ₹" value={filters.priceMax} onChange={handleChange} />

        <label>
          <input name="inStock" type="checkbox" checked={filters.inStock} onChange={handleChange} />
          In Stock Only
        </label>
      </div>

      <p>{filtered.length} products found</p>
      <ul>
        {filtered.map(p => (
          <li key={p.id}>
            {p.name} - ₹{p.price} {!p.inStock && "(Out of Stock)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a contact form
// - Fields: name, email, phone, subject (select), message
// - Validate on submit, show errors inline

// Exercise 2: Build a survey form with multiple question types
// - Text questions, multiple choice, rating (1-5)
// - Show progress bar
// - Display results at end

// Exercise 3: Build an address form
// - Auto-populate city/state from pincode
// - Same as billing address checkbox

// Exercise 4: Build a settings page
// - Toggle switches for notifications, dark mode, privacy
// - Save/discard changes buttons
// - Show "unsaved changes" warning

export default RegistrationForm;
