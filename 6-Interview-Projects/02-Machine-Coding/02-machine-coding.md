# Machine Coding Round

## What Is It?
A 60-90 minute live coding round where you build a fully functional component/feature from scratch. Tests your speed, React fundamentals, and code quality.

## What Interviewers Look For
| Criteria | Weight |
|----------|--------|
| Working solution | 40% |
| Code structure & separation | 20% |
| Edge cases handled | 15% |
| Clean, readable code | 15% |
| Bonus: accessibility, animations | 10% |

## Strategy
1. **Clarify requirements** (2-3 min) - Ask edge cases
2. **Plan component tree** (3-5 min) - Sketch structure
3. **Build skeleton** (5 min) - Render basic UI
4. **Core logic** (20-30 min) - Get it working
5. **Polish** (10 min) - Edge cases, UX

## Top 15 Machine Coding Questions

### Tier 1: Must Know (Asked 80% of the time)
1. **Todo App** - CRUD, filters, localStorage
2. **Autocomplete/Typeahead** - Debounce, keyboard nav, highlight
3. **Star Rating** - Click, hover preview, half-stars
4. **Modal/Dialog** - Portal, focus trap, Escape close
5. **Pagination** - Page numbers, prev/next, ellipsis

### Tier 2: Common (Asked 50% of the time)
6. **Accordion** - Single/multi expand, animated
7. **Tabs** - Active tab, lazy content
8. **Countdown Timer** - Start/pause/reset/lap
9. **Shopping Cart** - Add/remove, quantity, total
10. **OTP Input** - Auto-focus, paste support

### Tier 3: Advanced (Asked 20% of the time)
11. **Kanban Board** - Drag and drop between columns
12. **File Explorer** - Tree view, recursive expand
13. **Transfer List** - Move items between lists
14. **Infinite Scroll** - Intersection Observer
15. **Spreadsheet** - Editable cells, formulas

## File Structure for Machine Coding
```
feature/
├── Component.jsx      → Main component
├── useFeatureHook.js  → Custom hook for logic
├── FeatureItem.jsx    → Sub-components
└── styles.module.css  → Scoped styles
```

## Common Patterns Used
- `useState` for UI state
- `useRef` for DOM access / timers
- `useCallback` for handlers passed to children
- `useMemo` for expensive derived data
- `useEffect` for side effects (API, timers, listeners)
- Event delegation for lists
- Controlled inputs
- Keyboard accessibility (onKeyDown)
