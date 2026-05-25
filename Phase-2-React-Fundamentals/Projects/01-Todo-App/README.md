# Practice Project: Todo App

## Requirements
Build a full-featured todo application that exercises all Phase 2 concepts.

## Features
- [ ] Add new todos
- [ ] Mark todos as complete/incomplete
- [ ] Delete todos
- [ ] Filter: All / Active / Completed
- [ ] Show count of remaining items
- [ ] Clear all completed
- [ ] Edit todo text (double-click)
- [ ] Persist to localStorage

## Concepts Used
- JSX & Components (App, TodoItem, TodoForm, TodoFilter)
- Props (passing data down, callback functions up)
- State (todos array, filter selection, input value)
- Event handling (click, submit, double-click, keydown)
- Conditional rendering (show/hide edit mode, empty state)
- Lists (mapping todos, keys)
- Forms (controlled input, submit handling)
- useEffect (localStorage sync)

## Component Structure
```
App
├── TodoForm (input + add button)
├── TodoFilter (All | Active | Completed)
├── TodoList
│   └── TodoItem (checkbox, text, delete btn)
└── TodoFooter (count + clear completed)
```

## Getting Started
```bash
npm create vite@latest todo-app -- --template react
cd todo-app
npm install
npm run dev
```
