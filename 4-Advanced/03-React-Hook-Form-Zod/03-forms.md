# React Hook Form + Zod

## Key Concepts

### React Hook Form
Performant, flexible forms with minimal re-renders.

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Basic Usage
```jsx
import { useForm } from 'react-hook-form';

function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: "Name is required" })} />
      {errors.name && <span>{errors.name.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Zod Schema Validation
```jsx
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(2, "Min 2 chars"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "Must be 18+")
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

### Why React Hook Form?
| Feature | RHF | Controlled (useState) |
|---------|-----|----------------------|
| Re-renders | Minimal | Every keystroke |
| Validation | Built-in + Zod | Manual |
| Performance | Excellent | Degrades with size |
| Nested forms | Easy | Complex |
| File upload | Built-in | Manual |

### Key APIs
| API | Purpose |
|-----|---------|
| `register` | Connect input to form |
| `handleSubmit` | Wrap submit handler |
| `formState` | errors, isSubmitting, isDirty |
| `watch` | Observe field values |
| `reset` | Reset form to defaults |
| `setValue` | Set field value programmatically |
| `control` | For controlled components (Controller) |
