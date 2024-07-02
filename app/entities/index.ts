import { Animated } from 'react-native';
import { User } from 'firebase/auth';

import { categoryArray } from '../store';
import { z } from 'zod';
import { frequencySchema, reminderSchema } from '../validationSchemas';

export type AuthUser = User & {
  username?: string;
};

export type AnimatedInterpolation = Animated.AnimatedInterpolation<string | number>;

export type Filter = 'single' | 'recurring';

export type Category = (typeof categoryArray)[number];

export type Priority = 'Low' | 'Normal' | 'High';

export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export type Frequency = z.infer<typeof frequencySchema>;

export type Reminder = z.infer<typeof reminderSchema>;

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  category: Category;
  dueDate: Date;
  priority: Priority;
  note: string;
  frequency?: Frequency;
  reminders: Reminder[];
  isCarriedOver: boolean;
  isRecurring: boolean;
  checklist: ChecklistItem[];
}

export interface Habit {
  id: string;
  title: string;
  note: string;
  category: Category;
  startDate: Date;
  endDate?: Date;
  priority: Priority;
  frequency: Frequency;
  reminders: Reminder[];
}

export type TabRoute = 'index' | 'habits' | 'tasks' | 'timer' | 'settings';
