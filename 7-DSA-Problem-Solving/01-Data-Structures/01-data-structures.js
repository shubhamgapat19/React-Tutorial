// ============================================
// DATA STRUCTURES FOR FRONTEND - Practice
// ============================================

// ============================================
// 1. HashMap — Two Sum
// ============================================
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));       // [1, 2]

// ============================================
// 2. HashMap — Group Anagrams
// ============================================
function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return [...map.values()];
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));

// ============================================
// 3. Stack — Valid Parentheses
// ============================================
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

console.log(isValid("({[]})")); // true
console.log(isValid("({[})")); // false

// ============================================
// 4. Stack — Simplify Path (Breadcrumb)
// ============================================
function simplifyPath(path) {
  const stack = [];
  const parts = path.split('/');
  for (const part of parts) {
    if (part === '..') stack.pop();
    else if (part && part !== '.') stack.push(part);
  }
  return '/' + stack.join('/');
}

console.log(simplifyPath("/home/../usr/./local/bin")); // "/usr/local/bin"

// ============================================
// 5. Queue — Implement with Two Stacks
// ============================================
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
  get size() { return this.inStack.length + this.outStack.length; }
}

const q = new Queue();
q.enqueue(1); q.enqueue(2); q.enqueue(3);
console.log(q.dequeue()); // 1
console.log(q.peek());    // 2

// ============================================
// 6. Tree — Level Order Traversal
// ============================================
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

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

// Build test tree: [3, 9, 20, null, null, 15, 7]
const root = new TreeNode(3);
root.left = new TreeNode(9);
root.right = new TreeNode(20);
root.right.left = new TreeNode(15);
root.right.right = new TreeNode(7);
console.log(levelOrder(root)); // [[3], [9, 20], [15, 7]]

// ============================================
// 7. Tree — Max Depth
// ============================================
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

console.log(maxDepth(root)); // 3

// ============================================
// 8. Trie — Autocomplete
// ============================================
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

  autocomplete(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    const results = [];
    const dfs = (node, path) => {
      if (node.isEnd) results.push(path);
      for (const [ch, child] of Object.entries(node.children)) {
        dfs(child, path + ch);
      }
    };
    dfs(node, prefix);
    return results;
  }
}

const trie = new Trie();
['react', 'redux', 'render', 'ref', 'router'].forEach(w => trie.insert(w));
console.log(trie.autocomplete('re'));  // ['react', 'redux', 'render', 'ref']
console.log(trie.autocomplete('rou')); // ['router']

// ============================================
// 9. LRU Cache
// ============================================
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

const lru = new LRUCache(3);
lru.put('a', 1); lru.put('b', 2); lru.put('c', 3);
lru.get('a');     // moves 'a' to most recent
lru.put('d', 4); // evicts 'b' (least recently used)
console.log(lru.get('b')); // -1 (evicted)
console.log(lru.get('a')); // 1

// ============================================
// 10. Rate Limiter (Sliding Window Queue)
// ============================================
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

const limiter = new RateLimiter(3, 1000); // 3 requests per second
console.log(limiter.allowRequest()); // true
console.log(limiter.allowRequest()); // true
console.log(limiter.allowRequest()); // true
console.log(limiter.allowRequest()); // false

// ============================================
// EXERCISES
// ============================================
// 1. Implement a function to find the longest substring without repeating characters (HashMap + Sliding Window)
// 2. Implement a browser history using a Stack (back/forward navigation)
// 3. Flatten a deeply nested object into dot-notation keys (Recursion)
// 4. Implement a priority queue using a min-heap
// 5. Build a dependency resolver using topological sort (Graph)
