# Forms & Controlled Components

## Key Concepts

### Controlled vs Uncontrolled Components
| Controlled | Uncontrolled |
|------------|--------------|
| React controls value via state | DOM controls value |
| `value={state}` + `onChange` | `ref` to access value |
| Single source of truth | Quick & dirty |
| Recommended for React | Rare use cases |

### Controlled Component Pattern
```jsx
const [value, setValue] = useState("");

<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Form Elements
```jsx
// Text input
<input type="text" value={name} onChange={e => setName(e.target.value)} />

// Textarea
<textarea value={bio} onChange={e => setBio(e.target.value)} />

// Select
<select value={country} onChange={e => setCountry(e.target.value)}>
  <option value="india">India</option>
  <option value="usa">USA</option>
</select>

// Checkbox
<input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />

// Radio
<input type="radio" value="male" checked={gender === "male"} onChange={e => setGender(e.target.value)} />
```

### Form Submission
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  // validate
  // submit data
};
```

### Validation Patterns
- On submit: Check all fields when form submits
- On blur: Validate field when user leaves it
- On change: Real-time validation (use sparingly)
- Combine: Validate on blur + show all errors on submit
