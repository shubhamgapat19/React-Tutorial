// ========================================
// REACT HOOK FORM + ZOD - Practice
// ========================================

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ========================================
// 1. BASIC FORM WITH ZOD
// ========================================

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional()
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false }
  });

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
    console.log("Login:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <input {...register("password")} type="password" placeholder="Password" />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <label>
        <input {...register("rememberMe")} type="checkbox" /> Remember me
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

// ========================================
// 2. REGISTRATION FORM (Complex)
// ========================================

const registrationSchema = z.object({
  firstName: z.string().min(2, "Min 2 characters"),
  lastName: z.string().min(2, "Min 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  password: z.string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Needs uppercase")
    .regex(/[0-9]/, "Needs number")
    .regex(/[!@#$%]/, "Needs special char"),
  confirmPassword: z.string(),
  age: z.coerce.number().min(18, "Must be 18+").max(100),
  gender: z.enum(["male", "female", "other"], { required_error: "Select gender" }),
  terms: z.literal(true, { errorMap: () => ({ message: "Must accept terms" }) })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur" // Validate on blur
  });

  const password = watch("password");

  const onSubmit = (data) => {
    console.log("Registration:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} placeholder="First Name" />
      {errors.firstName && <span>{errors.firstName.message}</span>}

      <input {...register("lastName")} placeholder="Last Name" />
      {errors.lastName && <span>{errors.lastName.message}</span>}

      <input {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register("phone")} placeholder="Phone (10 digits)" />
      {errors.phone && <span>{errors.phone.message}</span>}

      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <input {...register("confirmPassword")} type="password" placeholder="Confirm Password" />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <input {...register("age")} type="number" placeholder="Age" />
      {errors.age && <span>{errors.age.message}</span>}

      <select {...register("gender")}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      {errors.gender && <span>{errors.gender.message}</span>}

      <label>
        <input {...register("terms")} type="checkbox" /> I accept terms
      </label>
      {errors.terms && <span>{errors.terms.message}</span>}

      <button type="submit">Register</button>
    </form>
  );
}

// ========================================
// 3. DYNAMIC FIELDS (useFieldArray)
// ========================================

const experienceSchema = z.object({
  name: z.string().min(2),
  experiences: z.array(z.object({
    company: z.string().min(1, "Company required"),
    role: z.string().min(1, "Role required"),
    years: z.coerce.number().min(0).max(50)
  })).min(1, "Add at least one experience")
});

function ExperienceForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: { name: "", experiences: [{ company: "", role: "", years: 0 }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "experiences" });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register("name")} placeholder="Your Name" />

      <h3>Work Experience</h3>
      {fields.map((field, index) => (
        <div key={field.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px 0" }}>
          <input {...register(`experiences.${index}.company`)} placeholder="Company" />
          <input {...register(`experiences.${index}.role`)} placeholder="Role" />
          <input {...register(`experiences.${index}.years`)} type="number" placeholder="Years" />
          {fields.length > 1 && (
            <button type="button" onClick={() => remove(index)}>Remove</button>
          )}
        </div>
      ))}

      <button type="button" onClick={() => append({ company: "", role: "", years: 0 })}>
        + Add Experience
      </button>

      <button type="submit">Submit</button>
    </form>
  );
}

// ========================================
// 4. MULTI-STEP FORM
// ========================================

const step1Schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email()
});

const step2Schema = z.object({
  address: z.string().min(5),
  city: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, "6 digit pincode")
});

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const Step1 = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(step1Schema),
      defaultValues: formData
    });

    return (
      <form onSubmit={handleSubmit(data => { setFormData(prev => ({ ...prev, ...data })); setStep(2); })}>
        <input {...register("firstName")} placeholder="First Name" />
        {errors.firstName && <span>{errors.firstName.message}</span>}
        <input {...register("lastName")} placeholder="Last Name" />
        <input {...register("email")} placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
        <button type="submit">Next</button>
      </form>
    );
  };

  const Step2 = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(step2Schema),
      defaultValues: formData
    });

    return (
      <form onSubmit={handleSubmit(data => { setFormData(prev => ({ ...prev, ...data })); setStep(3); })}>
        <input {...register("address")} placeholder="Address" />
        <input {...register("city")} placeholder="City" />
        <input {...register("pincode")} placeholder="Pincode" />
        {errors.pincode && <span>{errors.pincode.message}</span>}
        <button type="button" onClick={() => setStep(1)}>Back</button>
        <button type="submit">Next</button>
      </form>
    );
  };

  const Step3 = () => (
    <div>
      <h3>Review</h3>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      <button onClick={() => setStep(2)}>Back</button>
      <button onClick={() => console.log("Final submit:", formData)}>Submit</button>
    </div>
  );

  return (
    <div>
      <p>Step {step} of 3</p>
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a job application form
// - Personal info, resume upload, skills (dynamic array)
// - Zod validation for file type and size

// Exercise 2: Build an address form
// - Auto-suggest city from pincode
// - Conditional fields (company name if "business" selected)

// Exercise 3: Build a settings page
// - Multiple sections, save per section
// - Dirty state detection, confirm discard

export default LoginForm;
