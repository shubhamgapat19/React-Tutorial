# Destructuring

## Key Concepts

### Array Destructuring
```javascript
const [first, second] = [1, 2, 3];
// first = 1, second = 2
```

### Object Destructuring
```javascript
const { name, age } = { name: "John", age: 30 };
// name = "John", age = 30
```

### Why It Matters for React
- Props destructuring: `const { title, description } = props`
- State destructuring: `const [count, setCount] = useState(0)`
- Import destructuring: `import { useState, useEffect } from 'react'`

## Common Patterns
1. Function parameters
2. Default values
3. Renaming variables
4. Nested destructuring
5. Rest operator with destructuring
