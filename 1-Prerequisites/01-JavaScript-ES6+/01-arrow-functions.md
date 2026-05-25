# Arrow Functions

## Key Concepts

### Basic Syntax
```javascript
// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
```

### When to Use
- ✅ Short callback functions
- ✅ Array methods (map, filter, reduce)
- ✅ When you need lexical `this`
- ❌ Methods in objects (loses `this` context)
- ❌ Constructor functions

### Lexical `this`
Arrow functions don't have their own `this` - they inherit from parent scope.

## Key Takeaways
1. 
2. 
3.
