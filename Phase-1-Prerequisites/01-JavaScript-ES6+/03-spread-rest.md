# Spread & Rest Operators

## Spread Operator (...)
Expands an array or object into individual elements.

```javascript
const arr = [1, 2, 3];
const newArr = [...arr, 4, 5]; // [1, 2, 3, 4, 5]

const obj = { a: 1, b: 2 };
const newObj = { ...obj, c: 3 }; // { a: 1, b: 2, c: 3 }
```

## Rest Operator (...)
Collects multiple elements into an array.

```javascript
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3, 4); // 10
```

## React Use Cases
- **Props spreading**: `<Component {...props} />`
- **State updates**: `setState({ ...state, name: "New" })`
- **Array manipulation**: Adding/removing items immutably
- **Combining objects**: Merging props, styles, configs

## Common Patterns
1. Copy arrays/objects (immutability)
2. Merge multiple arrays/objects
3. Function with variable arguments
4. Clone with modifications

## Important Notes
- Spread creates shallow copies only
- Later properties override earlier ones
- Essential for immutable updates in React
