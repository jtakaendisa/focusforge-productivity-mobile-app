import { z } from 'zod';

import { PriorityType } from './entities';
import { categoryArray } from './store';

const emailSchema = z.string().email({ message: 'Invalid email address' });

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(50, { message: 'Password must not exceed 50 characters' });

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must not exceed 20 characters' }),
  email: emailSchema,
  password: passwordSchema,
});

export const signinSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const taskSchema = z.object({
  task: z
    .string()
    .min(2, { message: 'Task description must be at least 2 characters long' })
    .max(80, { message: 'Task description must not exceed 80 characters' }),
  category: z.enum(categoryArray),
  dueDate: z.string().date('Invalid date string'),
  priority: z.nativeEnum(PriorityType),
  note: z.string().min(2, { message: 'Task note must be at least 2 characters long' }),
  isPending: z.boolean({ message: 'isPending must be a boolean (true / false)' }),
});
