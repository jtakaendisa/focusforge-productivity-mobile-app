import { z } from 'zod';

const usernameSchema = z
  .string()
  .min(3, { message: 'Username must be at least 3 characters long' })
  .max(20, { message: 'Username must not exceed 20 characters' });

const emailSchema = z.string().email({ message: 'Invalid email address' });

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(50, { message: 'Password must not exceed 50 characters' });

export const signupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signinSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
