# Algorithm Patterns for Frontend

## Key Concepts
- Most interview problems follow a small set of patterns
- Recognizing the pattern is 80% of solving the problem
- Frontend-relevant: string manipulation, array traversal, tree/graph problems

---

## Pattern Recognition Guide

| Pattern | When to Use | Examples |
|---------|-------------|----------|
| Sliding Window | Contiguous subarray/substring problems | Max sum subarray, longest substring |
| Two Pointers | Sorted arrays, pair finding, palindromes | Two sum (sorted), container with water |
| Fast & Slow Pointers | Cycle detection, middle of linked list | Linked list cycle, happy number |
| BFS | Level-by-level traversal, shortest path | DOM traversal, shortest transformation |
| DFS | Exhaust all paths, backtracking | Permutations, combinations, tree paths |
| Binary Search | Sorted data, min/max optimization | Search rotated array, find peak |
| Recursion + Memo | Overlapping subproblems | Fibonacci, climb stairs, coin change |
| Greedy | Local optimal → global optimal | Interval scheduling, jump game |
| Merge Intervals | Overlapping ranges | Calendar booking, meeting rooms |
| Topological Sort | Dependency ordering | Build systems, course schedule |

---

## Sliding Window

```javascript
// Fixed Window — Max sum of k consecutive elements
function maxSumSubarray(arr, k) {
  let windowSum = 0;
  let maxSum = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    windowSum += arr[i];
    if (i >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[i - k + 1];
    }
  }
  return maxSum;
}

// Variable Window — Longest substring without repeating chars
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) {
      left = seen.get(s[right]) + 1;
    }
    seen.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

// Minimum Window Substring
function minWindow(s, t) {
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);

  let left = 0, matched = 0, minLen = Infinity, start = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (need.has(ch)) {
      need.set(ch, need.get(ch) - 1);
      if (need.get(ch) === 0) matched++;
    }
    while (matched === need.size) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }
      const leftCh = s[left];
      if (need.has(leftCh)) {
        if (need.get(leftCh) === 0) matched--;
        need.set(leftCh, need.get(leftCh) + 1);
      }
      left++;
    }
  }
  return minLen === Infinity ? "" : s.slice(start, start + minLen);
}
```

---

## Two Pointers

```javascript
// Container With Most Water
function maxArea(height) {
  let left = 0, right = height.length - 1, max = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, area);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}

// Three Sum — Find triplets that sum to 0
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip duplicates
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (nums[left] === nums[left + 1]) left++;
        while (nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}

// Valid Palindrome (ignoring non-alphanumeric)
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++; right--;
  }
  return true;
}

// Move Zeroes to End (in-place)
function moveZeroes(nums) {
  let insertPos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[insertPos], nums[i]] = [nums[i], nums[insertPos]];
      insertPos++;
    }
  }
  return nums;
}
```

---

## BFS / DFS

```javascript
// BFS — Shortest path in grid (like routing in UI)
function shortestPath(grid) {
  const rows = grid.length, cols = grid[0].length;
  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) return -1;

  const queue = [[0, 0, 1]]; // [row, col, distance]
  const visited = new Set(['0,0']);
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  while (queue.length) {
    const [row, col, dist] = queue.shift();
    if (row === rows - 1 && col === cols - 1) return dist;
    for (const [dr, dc] of dirs) {
      const nr = row + dr, nc = col + dc;
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(key) && grid[nr][nc] === 0) {
        visited.add(key);
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
  return -1;
}

// DFS — All paths from root to leaf (like component tree paths)
function allPaths(root) {
  const result = [];
  function dfs(node, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) {
      result.push([...path]);
    } else {
      dfs(node.left, path);
      dfs(node.right, path);
    }
    path.pop(); // backtrack
  }
  dfs(root, []);
  return result;
}

// DFS — Permutations (backtracking)
function permutations(nums) {
  const result = [];
  function backtrack(current, remaining) {
    if (!remaining.length) { result.push([...current]); return; }
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(current, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
      current.pop();
    }
  }
  backtrack([], nums);
  return result;
}

// DFS — Subsets (power set)
function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}
```

---

## Binary Search

```javascript
// Classic Binary Search
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Search in Rotated Sorted Array
function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      // Right half is sorted
      if (target > nums[mid] && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}

// Find Peak Element (useful in UI scroll position detection)
function findPeakElement(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[mid + 1]) right = mid;
    else left = mid + 1;
  }
  return left;
}
```

---

## Dynamic Programming

```javascript
// Climbing Stairs (like step-by-step form wizard)
function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// Coin Change — Minimum coins to make amount
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Longest Common Subsequence (like diff algorithm)
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// Maximum Subarray (Kadane's Algorithm)
function maxSubArray(nums) {
  let maxSum = nums[0], currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}
```

---

## Merge Intervals

```javascript
// Merge Overlapping Intervals (like calendar events)
function mergeIntervals(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}

// Meeting Rooms — Can attend all meetings?
function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}
```

---

## Topological Sort

```javascript
// Course Schedule — Can finish all courses? (dependency resolution)
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let count = 0;
  while (queue.length) {
    const node = queue.shift();
    count++;
    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return count === numCourses;
}
```
