# Styling in React

## Key Concepts

### Options Overview
| Method | Scoped | Dynamic | Bundle | Best For |
|--------|--------|---------|--------|----------|
| Tailwind CSS | ✅ | ✅ | Small | Rapid UI development |
| CSS Modules | ✅ | ❌ | Small | Component-scoped styles |
| Styled Components | ✅ | ✅ | Runtime | Dynamic theming |
| Inline styles | ✅ | ✅ | None | Quick dynamic styles |
| Global CSS | ❌ | ❌ | Varies | Resets, fonts |

---

## Tailwind CSS

### Setup
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Usage
```jsx
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click Me
</button>
```

### Key Concepts
- Utility-first: compose styles from single-purpose classes
- Responsive: `sm:`, `md:`, `lg:`, `xl:` prefixes
- States: `hover:`, `focus:`, `active:`, `disabled:`
- Dark mode: `dark:` prefix
- Customization: `tailwind.config.js`

---

## CSS Modules

### Usage
```jsx
// Button.module.css
.primary { background: blue; color: white; }
.large { padding: 12px 24px; }

// Button.jsx
import styles from './Button.module.css';
<button className={`${styles.primary} ${styles.large}`}>Click</button>
```

---

## Styled Components

### Setup
```bash
npm install styled-components
```

### Usage
```jsx
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  &:hover { opacity: 0.8; }
`;

<Button primary>Click Me</Button>
```

---

## When to Use What
- **Tailwind**: Most projects, fastest to build UI
- **CSS Modules**: When you want traditional CSS but scoped
- **Styled Components**: Heavy theming, dynamic styles based on props
