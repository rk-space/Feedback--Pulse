import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const projectSchema = z.object({
  name: z.string().min(3, { message: 'Project name must be at least 3 characters.' }),
});

export const feedbackSchema = z.object({
    type: z.enum(['bug', 'feature', 'other'], {
        required_error: 'You need to select a feedback type.',
    }),
    comment: z.string().min(10, { message: 'Comment must be at least 10 characters.' }),
    projectId: z.string(),
});

export const labelSchema = z.object({
  label: z.string().min(1, { message: 'Label cannot be empty.' }).max(20, { message: 'Label is too long.' }),
  feedbackId: z.string(),
});
