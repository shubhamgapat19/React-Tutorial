// ============================================
// ALGORITHM PATTERNS - Practice
// ============================================

// ============================================
// 1. Sliding Window — Max Sum Subarray
// ============================================
function maxSumSubarray(arr, k) {
  let windowSum = 0, maxSum = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    windowSum += arr[i];
    if (i >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[i - k + 1];
    }
  }
  return maxSum;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3)); // 9

// ============================================
// 2. Sliding Window — Longest Substring Without Repeating
// ============================================
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

console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("pwwkew"));   // 3

// ============================================
// 3. Two Pointers — Container With Most Water
// ============================================
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

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49

// ============================================
// 4. Two Pointers — Three Sum
// ============================================
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
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

console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]

// ============================================
// 5. Two Pointers — Move Zeroes
// ============================================
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

console.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]

// ============================================
// 6. BFS — Shortest Path in Grid
// ============================================
function shortestPath(grid) {
  const rows = grid.length, cols = grid[0].length;
  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) return -1;
  const queue = [[0, 0, 1]];
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

const grid = [
  [0, 0, 0],
  [1, 1, 0],
  [1, 1, 0]
];
console.log(shortestPath(grid)); // 5

// ============================================
// 7. DFS — Permutations (Backtracking)
// ============================================
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

console.log(permutations([1, 2, 3]).length); // 6

// ============================================
// 8. Binary Search — Search Rotated Array
// ============================================
function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (target > nums[mid] && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4

// ============================================
// 9. Dynamic Programming — Coin Change
// ============================================
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

console.log(coinChange([1, 5, 10, 25], 30)); // 2 (25 + 5)
console.log(coinChange([2], 3));              // -1

// ============================================
// 10. Dynamic Programming — Maximum Subarray (Kadane's)
// ============================================
function maxSubArray(nums) {
  let maxSum = nums[0], currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6

// ============================================
// 11. Merge Intervals
// ============================================
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

console.log(mergeIntervals([[1,3],[2,6],[8,10],[15,18]])); // [[1,6],[8,10],[15,18]]

// ============================================
// 12. Topological Sort — Course Schedule
// ============================================
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

console.log(canFinish(4, [[1,0],[2,1],[3,2]])); // true (linear deps)
console.log(canFinish(2, [[0,1],[1,0]]));        // false (cycle)

// ============================================
// EXERCISES
// ============================================
// 1. Sliding Window: Find all anagrams of pattern in string (return start indices)
// 2. Two Pointers: Trapping Rain Water
// 3. BFS: Word Ladder — shortest transformation sequence
// 4. DFS: Generate all valid combinations of n pairs of parentheses
// 5. Binary Search: Find minimum in rotated sorted array
// 6. DP: Longest Increasing Subsequence
// 7. DP: 0/1 Knapsack problem
// 8. Graph: Number of Islands (grid DFS/BFS)
