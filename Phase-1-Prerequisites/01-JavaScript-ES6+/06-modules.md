# ES6 Modules

## Key Concepts

### Named Exports
```javascript
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// app.js
import { add, subtract } from './utils.js';
```

### Default Exports
```javascript
// User.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// app.js
import User from './User.js';
```

## Import Patterns
- Named imports: `import { func } from './module'`
- Default import: `import Component from './Component'`
- Rename: `import { func as myFunc } from './module'`
- Import all: `import * as Utils from './utils'`
- Import for side effects: `import './styles.css'`

## React Module Patterns
```javascript
// Component.jsx
import React, { useState, useEffect } from 'react';
import { Button } from './components';
import styles from './Component.module.css';

export default function Component() {
  // component code
}
```

## Best Practices
1. One component per file
2. Named exports for utilities, default for components
3. Group related imports together
4. Use absolute imports when possible
5. Avoid circular dependencies

## Module vs CommonJS
- ES6: `import`/`export` (modern, browser-native)
- CommonJS: `require`/`module.exports` (Node.js legacy)
