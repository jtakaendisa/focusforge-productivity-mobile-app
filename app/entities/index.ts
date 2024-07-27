import { Animated } from 'react-native';
import { User } from 'firebase/auth';

import { categoryArray } from '../store';
import { z } from 'zod';
import { frequencySchema, reminderSchema } from '../validationSchemas';

export type AuthUser = User & {
  username?: string;
};

export type AnimatedInterpolation = Animated.AnimatedInterpolation<string | number>;

export type Theme = 'dark' | 'light';

export type TaskFilter = 'single task' | 'recurring task';

export type Category = (typeof categoryArray)[number];

export type Priority = 'Low' | 'Normal' | 'High';

export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export type Frequency = z.infer<typeof frequencySchema>;

export type Reminder = z.infer<typeof reminderSchema>;

export type IconVariant = 'outline' | 'solid';

export interface IconProps {
  size?: number;
  fill?: string;
  variant?: IconVariant;
}

export type ActivityFilter = 'all' | 'habits' | 'tasks';

export type ActivityType = 'habit' | 'single task' | 'recurring task';

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  category: Category;
  priority: Priority;
  note: string;
  dueDate?: Date;
  startDate?: Date;
  endDate?: Date;
  frequency?: Frequency;
  reminders: Reminder[];
  checklist?: ChecklistItem[];
  isCompleted: boolean;
  isCarriedOver: boolean;
};

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  category: Category;
  dueDate?: Date;
  startDate?: Date;
  endDate?: Date;
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

export type TabRoute = 'home' | 'habits' | 'tasks' | 'timer' | 'settings';
