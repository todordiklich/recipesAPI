import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(500, 'Password too long'),
});

export const signupSchema = z.object({
  email: z.email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(500, 'Password too long'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
