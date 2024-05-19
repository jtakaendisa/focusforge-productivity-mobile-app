import { z } from 'zod';

import { PriorityType, categoryArray } from './store';

const emailSchema = z.string().email({ message: 'Invalid email address' });

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(50, { message: 'Password must not exceed 50 characters' });

const taskDescriptionSchema = z
  .string()
  .min(2, { message: 'Task description must be at least 2 characters long' })
  .max(80, { message: 'Task description must not exceed 80 characters' });

const subTaskSchema = z.object({
  id: z.string().min(1, { message: 'ID must be at least 1 characters long' }),
  title: taskDescriptionSchema,
  isCompleted: z.boolean({ message: 'isCompleted must be a boolean (true / false)' }),
});

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
  title: taskDescriptionSchema,
  category: z.enum(categoryArray),
  dueDate: z.string().date('Invalid date string'),
  priority: z.nativeEnum(PriorityType),
  note: z.string().min(2, { message: 'Task note must be at least 2 characters long' }),
  isCarriedOver: z.boolean({
    message: 'isCarriedOver must be a boolean (true / false)',
  }),
  checklist: z.array(subTaskSchema),
});
