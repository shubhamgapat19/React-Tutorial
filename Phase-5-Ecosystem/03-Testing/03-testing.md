# Testing React Apps

## Key Concepts

### Setup
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Testing Stack
| Tool | Purpose |
|------|---------|
| Vitest | Test runner (fast, Vite-native) |
| React Testing Library (RTL) | Render & query components |
| @testing-library/user-event | Simulate user interactions |
| jest-dom | Custom matchers (toBeVisible, etc.) |
| MSW | Mock API requests |

### Testing Philosophy
- Test behavior, not implementation
- Test what the user sees and does
- Don't test internal state or methods
- Write tests that don't break on refactor

### RTL Queries (Priority Order)
| Query | Use When |
|-------|----------|
| `getByRole` | Accessible elements (button, heading) |
| `getByLabelText` | Form inputs |
| `getByPlaceholderText` | Inputs without labels |
| `getByText` | Non-interactive text |
| `getByTestId` | Last resort |

### Query Variants
| Variant | Returns | Throws on 0? | Async? |
|---------|---------|--------------|--------|
| `getBy` | Element | Yes | No |
| `queryBy` | Element or null | No | No |
| `findBy` | Promise | Yes | Yes |
| `getAllBy` | Array | Yes | No |

### Test Structure (AAA)
```jsx
test("adds item to cart", async () => {
  // Arrange
  render(<ProductCard product={mockProduct} />);

  // Act
  await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));

  // Assert
  expect(screen.getByText("1 item in cart")).toBeInTheDocument();
});
```

### What to Test
- Component renders correctly
- User interactions work (click, type, submit)
- Conditional rendering
- Error states
- API integration (with mocks)
- Accessibility (roles, labels)
