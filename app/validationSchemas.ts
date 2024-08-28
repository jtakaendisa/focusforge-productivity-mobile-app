import { z } from 'zod';
import { categories } from './constants';

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

export const categorySchema = z.enum(categories);

export const checklistItemSchema = z.object({
  id: z.string().min(1, { message: 'ID must be at least 1 characters long' }),
  title: titleSchema,
  isCompleted: z.boolean({ message: 'isCompleted must be a boolean (true / false)' }),
});

export const checklistSchema = z.array(checklistItemSchema);

export const reminderSchema = z.object({
  id: z.string().min(1, { message: 'ID must be at least 1 characters long' }),
  type: z.enum(['notification', 'alarm']),
  time: z.date({ message: 'Invalid time' }),
});

export const prioritySchema = z.enum(['Low', 'Normal', 'High']);

export const frequencySchema = z.object({
  type: z.enum(['once', 'daily', 'specific', 'repeats']),
  isRepeatedOn: z.array(z.string()).optional(),
  isRepeatedEvery: z.number().optional(),
});

export const activitySchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Task description must be at least 2 characters long' })
    .max(80, { message: 'Task description must not exceed 80 characters' }),
  category: categorySchema,
  note: z.string().optional(),
  startDate: z.date({ message: 'Invalid date entered' }).optional(),
  endDate: z.date({ message: 'Invalid date entered' }).optional(),
  priority: prioritySchema,
  frequency: frequencySchema,
  checklist: checklistSchema.optional(),
  reminders: z.array(reminderSchema).optional(),
  isCarriedOver: z
    .boolean({
      message: 'Pending Task must either be true or false',
    })
    .optional(),
});
