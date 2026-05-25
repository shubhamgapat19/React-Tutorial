// ============================================
// JAVASCRIPT CODING CHALLENGES - Practice
// ============================================

// ============================================
// 1. Polyfill — Array.prototype.map
// ============================================
Array.prototype.myMap = function(callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) result[i] = callback.call(thisArg, this[i], i, this);
  }
  return result;
};

console.log([1, 2, 3].myMap(x => x * 2)); // [2, 4, 6]

// ============================================
// 2. Polyfill — Array.prototype.reduce
// ============================================
Array.prototype.myReduce = function(callback, initialValue) {
  let acc = initialValue;
  let startIndex = 0;
  if (acc === undefined) { acc = this[0]; startIndex = 1; }
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) acc = callback(acc, this[i], i, this);
  }
  return acc;
};

console.log([1, 2, 3, 4].myReduce((sum, n) => sum + n, 0)); // 10

// ============================================
// 3. Polyfill — Function.prototype.bind
// ============================================
Function.prototype.myBind = function(context, ...args) {
  const fn = this;
  return function(...newArgs) {
    return fn.apply(context, [...args, ...newArgs]);
  };
};

const greet = function(greeting) { return `${greeting}, ${this.name}`; };
const boundGreet = greet.myBind({ name: 'React Dev' });
console.log(boundGreet('Hello')); // "Hello, React Dev"

// ============================================
// 4. Promise.all Polyfill
// ============================================
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

promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]

// ============================================
// 5. Debounce
// ============================================
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedLog = debounce(console.log, 300);
debouncedLog('a'); debouncedLog('b'); debouncedLog('c'); // only logs 'c'

// ============================================
// 6. Throttle
// ============================================
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

// ============================================
// 7. Deep Clone
// ============================================
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);
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

const original = { a: 1, b: { c: 2 }, d: [3, 4] };
const cloned = deepClone(original);
cloned.b.c = 99;
console.log(original.b.c); // 2 (not affected)

// ============================================
// 8. Flatten Array
// ============================================
function flatten(arr, depth = Infinity) {
  if (depth === 0) return arr.slice();
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) acc.push(...flatten(val, depth - 1));
    else acc.push(val);
    return acc;
  }, []);
}

console.log(flatten([1, [2, [3, [4]]]]));    // [1, 2, 3, 4]
console.log(flatten([1, [2, [3, [4]]]], 1)); // [1, 2, [3, [4]]]

// ============================================
// 9. Curry
// ============================================
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

const add = curry((a, b, c) => a + b + c);
console.log(add(1)(2)(3));   // 6
console.log(add(1, 2)(3));   // 6
console.log(add(1)(2, 3));   // 6

// ============================================
// 10. Memoize
// ============================================
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

const factorial = memoize(function f(n) { return n <= 1 ? 1 : n * f(n - 1); });
console.log(factorial(5)); // 120
console.log(factorial(6)); // 720 (uses cached factorial(5))

// ============================================
// 11. EventEmitter
// ============================================
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
    const wrapper = (...args) => { listener(...args); this.off(event, wrapper); };
    this.on(event, wrapper);
    return this;
  }
  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach(l => l(...args));
    return true;
  }
}

const emitter = new EventEmitter();
emitter.on('data', (msg) => console.log('Received:', msg));
emitter.emit('data', 'Hello!'); // "Received: Hello!"

// ============================================
// 12. Parallel with Concurrency Limit
// ============================================
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

// Example: Run 5 tasks with max 2 concurrent
const tasks = Array.from({ length: 5 }, (_, i) => 
  () => new Promise(resolve => setTimeout(() => resolve(i), 100))
);
parallelLimit(tasks, 2).then(console.log); // [0, 1, 2, 3, 4]

// ============================================
// 13. Pipe & Compose
// ============================================
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);

const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x * x;

console.log(pipe(double, addOne, square)(3));    // (3*2+1)^2 = 49
console.log(compose(square, addOne, double)(3)); // (3*2+1)^2 = 49

// ============================================
// 14. Flatten Object (Dot Notation)
// ============================================
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

console.log(flattenObject({ a: { b: { c: 1 } }, d: 2 }));
// { "a.b.c": 1, "d": 2 }

// ============================================
// 15. Simple Template Engine
// ============================================
function render(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

console.log(render("Hello {{name}}, you are {{age}}!", { name: "Dev", age: 25 }));
// "Hello Dev, you are 25!"

// ============================================
// EXERCISES
// ============================================
// 1. Implement Promise.allSettled polyfill
// 2. Implement a deep equality function (deepEqual)
// 3. Implement JSON.stringify (handle objects, arrays, strings, numbers, booleans, null)
// 4. Implement Array.prototype.flat polyfill
// 5. Implement a function that converts callback-based functions to promises (promisify)
// 6. Implement instanceof operator as a function
// 7. Implement Object.create polyfill
// 8. Build a simple pub/sub system with wildcard support (e.g., "user.*" matches "user.login")
