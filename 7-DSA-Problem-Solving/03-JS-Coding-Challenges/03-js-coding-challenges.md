# JavaScript Coding Challenges

## Key Concepts
- Companies test JS-specific knowledge: closures, prototypes, async, event loop
- Polyfill questions test deep understanding of built-in methods
- Utility function questions test clean code and edge case handling

---

## Categories

| Category | What's Tested | Examples |
|----------|---------------|----------|
| Polyfills | Understanding of native APIs | bind, map, reduce, Promise.all |
| Utility Functions | Clean code, edge cases | debounce, throttle, deepClone, flatten |
| Async Patterns | Event loop, microtasks | sleep, retry, parallel limit, sequence |
| Event System | Pub/Sub, Observer pattern | EventEmitter, DOM event delegation |
| Functional Programming | Composition, currying | pipe, compose, curry, memoize |
| DOM Manipulation | Vanilla JS skills | Virtual DOM diff, template engine |

---

## Polyfills

```javascript
// Array.prototype.map
Array.prototype.myMap = function(callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) { // handle sparse arrays
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

// Array.prototype.reduce
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;
  if (accumulator === undefined) {
    accumulator = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }
  return accumulator;
};

// Array.prototype.filter
Array.prototype.myFilter = function(callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

// Function.prototype.bind
Function.prototype.myBind = function(context, ...args) {
  const fn = this;
  return function(...newArgs) {
    return fn.apply(context, [...args, ...newArgs]);
  };
};

// Function.prototype.call
Function.prototype.myCall = function(context, ...args) {
  context = context || globalThis;
  const sym = Symbol();
  context[sym] = this;
  const result = context[sym](...args);
  delete context[sym];
  return result;
};

// Function.prototype.apply
Function.prototype.myApply = function(context, args = []) {
  context = context || globalThis;
  const sym = Symbol();
  context[sym] = this;
  const result = context[sym](...args);
  delete context[sym];
  return result;
};
```

---

## Promise Polyfills

```javascript
// Promise.all
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(value => {
        results[index] = value;
        completed++;
        if (completed === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}

// Promise.allSettled
function promiseAllSettled(promises) {
  return new Promise(resolve => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        value => { results[index] = { status: 'fulfilled', value }; },
        reason => { results[index] = { status: 'rejected', reason }; }
      ).finally(() => {
        completed++;
        if (completed === promises.length) resolve(results);
      });
    });
  });
}

// Promise.race
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolve).catch(reject);
    });
  });
}

// Promise.any
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let rejected = 0;
    if (promises.length === 0) return reject(new AggregateError([], 'All promises were rejected'));
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(resolve).catch(error => {
        errors[index] = error;
        rejected++;
        if (rejected === promises.length) {
          reject(new AggregateError(errors, 'All promises were rejected'));
        }
      });
    });
  });
}
```

---

## Utility Functions

```javascript
// Debounce
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Deep Clone (handles objects, arrays, dates, maps, sets)
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj); // circular reference
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map) {
    const map = new Map();
    seen.set(obj, map);
    obj.forEach((val, key) => map.set(deepClone(key, seen), deepClone(val, seen)));
    return map;
  }
  if (obj instanceof Set) {
    const set = new Set();
    seen.set(obj, set);
    obj.forEach(val => set.add(deepClone(val, seen)));
    return set;
  }
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }
  return clone;
}

// Flatten Array
function flatten(arr, depth = Infinity) {
  if (depth === 0) return arr.slice();
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) acc.push(...flatten(val, depth - 1));
    else acc.push(val);
    return acc;
  }, []);
}

// Flatten Object (dot notation)
function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

// Get nested value safely
function get(obj, path, defaultValue) {
  const keys = Array.isArray(path) ? path : path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }
  return result;
}
```

---

## Async Patterns

```javascript
// Sleep / Delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry with exponential backoff
async function retry(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries) throw error;
      await sleep(baseDelay * Math.pow(2, i));
    }
  }
}

// Parallel execution with concurrency limit
async function parallelLimit(tasks, limit) {
  const results = [];
  let index = 0;
  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// Sequential execution
async function sequential(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

// Timeout wrapper
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

// Auto-retry fetch
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (i === retries) throw error;
      await sleep(1000 * Math.pow(2, i));
    }
  }
}
```

---

## Event System

```javascript
// EventEmitter
class EventEmitter {
  constructor() { this.events = {}; }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return this;
  }

  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
    return this;
  }

  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => listener(...args));
    return true;
  }
}

// Event Delegation Helper
function delegate(parent, selector, event, handler) {
  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, e);
    }
  });
}
```

---

## Functional Programming

```javascript
// Curry
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

// Compose (right to left)
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

// Pipe (left to right)
function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

// Memoize
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Partial Application
function partial(fn, ...presetArgs) {
  return (...laterArgs) => fn(...presetArgs, ...laterArgs);
}
```

---

## DOM Challenges

```javascript
// Simple Template Engine
function render(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

// Virtual DOM Diff (simplified)
function diff(oldNode, newNode) {
  if (!oldNode) return { type: 'CREATE', node: newNode };
  if (!newNode) return { type: 'REMOVE' };
  if (typeof oldNode !== typeof newNode || 
      (typeof oldNode === 'string' && oldNode !== newNode) ||
      oldNode.tag !== newNode.tag) {
    return { type: 'REPLACE', node: newNode };
  }
  if (newNode.tag) {
    return {
      type: 'UPDATE',
      props: diffProps(oldNode.props, newNode.props),
      children: diffChildren(oldNode.children, newNode.children),
    };
  }
  return null;
}

function diffProps(oldProps = {}, newProps = {}) {
  const patches = [];
  for (const key of Object.keys(newProps)) {
    if (oldProps[key] !== newProps[key]) patches.push({ key, value: newProps[key] });
  }
  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) patches.push({ key, value: undefined });
  }
  return patches;
}

function diffChildren(oldChildren = [], newChildren = []) {
  return newChildren.map((child, i) => diff(oldChildren[i], child));
}
```
