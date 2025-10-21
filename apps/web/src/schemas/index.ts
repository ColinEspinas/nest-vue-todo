import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Adresse email invalide.'),
  password: z.string().min(1, 'Le mot de passe est requis.'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  email: z.email('Adresse email invalide.'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis.')
    .max(50, 'Le titre ne peut pas dépasser 50 caractères.'),
  description: z
    .string()
    .min(1, 'La description est requise.')
    .max(256, 'La description ne peut pas dépasser 256 caractères.'),
  priority: z.enum(['high', 'medium', 'low']),
  deadline: z.date().optional(),
});
