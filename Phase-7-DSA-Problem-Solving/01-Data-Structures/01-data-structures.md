# Data Structures for Frontend

## Key Concepts
- Frontend interviews test DS knowledge with JavaScript-specific implementations
- DOM is a tree, event propagation is graph traversal, state is a hashmap
- Know when to use each structure and its time/space complexity

---

## Core Data Structures

| Structure | Frontend Use Case | Key Operations | Time Complexity |
|-----------|------------------|----------------|-----------------|
| Array | Lists, queues, stacks | push, pop, shift, splice | O(1) push/pop, O(n) shift |
| HashMap (Object/Map) | Caching, lookup tables, frequency count | get, set, has, delete | O(1) average |
| Set | Deduplication, membership testing | add, has, delete | O(1) average |
| Stack | Undo/Redo, bracket matching, DFS | push, pop, peek | O(1) |
| Queue | BFS, task scheduling, rate limiting | enqueue, dequeue | O(1) with linked list |
| Linked List | LRU Cache, playlists | insert, delete, traverse | O(1) insert/delete at known node |
| Tree | DOM, file explorer, nested menus | traverse, search, insert | O(log n) balanced |
| Graph | Route planning, social networks, dependencies | BFS, DFS, shortest path | Varies |
| Trie | Autocomplete, spell check, prefix search | insert, search, startsWith | O(m) where m = word length |
| Heap / Priority Queue | Top-K problems, scheduling | insert, extractMin/Max | O(log n) |

---

## HashMap / Frequency Counter Pattern

```javascript
// Two Sum — Classic HashMap problem
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}

// Group Anagrams
function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return [...map.values()];
}

// Frequency Counter — First non-repeating character
function firstUnique(s) {
  const freq = new Map();
  for (const ch of s) freq.set(ch, (freq.get(ch) || 0) + 1);
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) return i;
  }
  return -1;
}
```

---

## Stack

```javascript
// Valid Parentheses
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (!map[ch]) {
      stack.push(ch);
    } else {
      if (stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}

// Min Stack — O(1) getMin
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    const min = this.minStack.length === 0 ? val : Math.min(val, this.getMin());
    this.minStack.push(min);
  }
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return this.minStack[this.minStack.length - 1]; }
}

// Simplify File Path (frontend: breadcrumb navigation)
function simplifyPath(path) {
  const stack = [];
  const parts = path.split('/');
  for (const part of parts) {
    if (part === '..') stack.pop();
    else if (part && part !== '.') stack.push(part);
  }
  return '/' + stack.join('/');
}
```

---

## Queue & BFS

```javascript
// Implement Queue with two Stacks
class Queue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  enqueue(val) { this.inStack.push(val); }
  dequeue() {
    if (!this.outStack.length) {
      while (this.inStack.length) this.outStack.push(this.inStack.pop());
    }
    return this.outStack.pop();
  }
  peek() {
    if (!this.outStack.length) {
      while (this.inStack.length) this.outStack.push(this.inStack.pop());
    }
    return this.outStack[this.outStack.length - 1];
  }
}

// Rate Limiter (sliding window with queue)
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.timestamps = [];
  }
  allowRequest() {
    const now = Date.now();
    while (this.timestamps.length && this.timestamps[0] <= now - this.windowMs) {
      this.timestamps.shift();
    }
    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(now);
      return true;
    }
    return false;
  }
}
```

---

## Trees

```javascript
// DOM-like Tree Node
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// BFS Level Order Traversal (like rendering nested components)
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

// Max Depth (like finding deepest nested component)
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Invert Tree
function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}

// Lowest Common Ancestor (like finding shared parent component)
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}
```

---

## Trie (Autocomplete)

```javascript
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }

  search(word) {
    const node = this._traverse(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix) {
    return this._traverse(prefix) !== null;
  }

  // Autocomplete: return all words with given prefix
  autocomplete(prefix) {
    const node = this._traverse(prefix);
    if (!node) return [];
    const results = [];
    this._dfs(node, prefix, results);
    return results;
  }

  _traverse(str) {
    let node = this.root;
    for (const ch of str) {
      if (!node.children[ch]) return null;
      node = node.children[ch];
    }
    return node;
  }

  _dfs(node, path, results) {
    if (node.isEnd) results.push(path);
    for (const [ch, child] of Object.entries(node.children)) {
      this._dfs(child, path + ch, results);
    }
  }
}
```

---

## LRU Cache (Linked List + HashMap)

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map maintains insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // Move to end (most recent)
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      // Delete oldest (first entry)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
```

---

## Complexity Cheat Sheet

| Operation | Array | HashMap | BST | Heap |
|-----------|-------|---------|-----|------|
| Access by index | O(1) | — | — | — |
| Search | O(n) | O(1) | O(log n) | O(n) |
| Insert | O(n) | O(1) | O(log n) | O(log n) |
| Delete | O(n) | O(1) | O(log n) | O(log n) |
| Min/Max | O(n) | O(n) | O(log n) | O(1) |
