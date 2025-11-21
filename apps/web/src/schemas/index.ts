import { z } from 'zod';

// Create schemas with i18n support - messages will be translation keys
export const loginSchema = z.object({
  email: z.string().email('validation.email.invalid'),
  password: z.string().min(1, 'validation.password.required'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'validation.name.required'),
  email: z.string().email('validation.email.invalid'),
  password: z.string().min(8, 'validation.password.minLength'),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'validation.title.required').max(50, 'validation.title.maxLength'),
  description: z
    .string()
    .min(1, 'validation.description.required')
    .max(256, 'validation.description.maxLength'),
  priority: z.enum(['high', 'medium', 'low']),
  deadline: z.date().optional().nullable(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'validation.name.required'),
  email: z.string().email('validation.email.invalid'),
});
