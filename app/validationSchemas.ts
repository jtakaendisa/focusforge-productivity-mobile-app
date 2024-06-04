import { z } from 'zod';

import { PriorityType, categoryArray } from './store';

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

const titleSchema = z
  .string()
  .min(2, { message: 'Task description must be at least 2 characters long' })
  .max(80, { message: 'Task description must not exceed 80 characters' });

const subTaskSchema = z.object({
  id: z.string().min(1, { message: 'ID must be at least 1 characters long' }),
  title: titleSchema,
  isCompleted: z.boolean({ message: 'isCompleted must be a boolean (true / false)' }),
});

export const taskSchema = z.object({
  title: titleSchema,
  category: z.enum(categoryArray),
  dueDate: z.date({ message: 'Invalid date string' }),
  priority: z.nativeEnum(PriorityType),
  note: z.string(),
  isCarriedOver: z.boolean({
    message: 'isCarriedOver must be a boolean (true / false)',
  }),
  checklist: z.array(subTaskSchema),
});

const reminderSchema = z.object({
  id: z.string().min(1, { message: 'ID must be at least 1 characters long' }),
  type: z.enum(['notification', 'alarm']),
  time: z.date({ message: 'Invalid time' }),
});

export const habitSchema = z.object({
  title: titleSchema,
  note: z.string(),
  category: z.enum(categoryArray),
  startDate: z.date({ message: 'Invalid date string' }),
  endDate: z.date({ message: 'Invalid date string' }).optional(),
  priority: z.nativeEnum(PriorityType),
  frequency: z.object({
    type: z.enum(['daily', 'specific', 'repeats']),
    isRepeatedOn: z.array(z.string()).optional(),
    isRepeatedEvery: z.number().optional(),
  }),
  reminders: z.array(reminderSchema),
});
