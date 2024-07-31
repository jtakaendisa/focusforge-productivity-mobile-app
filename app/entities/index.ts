import { User } from 'firebase/auth';
import { Animated } from 'react-native';

import { z } from 'zod';
import {
  activitySchema,
  categorySchema,
  checklistItemSchema,
  frequencySchema,
  prioritySchema,
  reminderSchema,
} from '../validationSchemas';

export type AuthUser = User & {
  username?: string;
};

export type AnimatedInterpolation = Animated.AnimatedInterpolation<string | number>;

export type Theme = 'dark' | 'light';

export type TaskFilter = 'single task' | 'recurring task';

export type Category = z.infer<typeof categorySchema>;

export type Priority = z.infer<typeof prioritySchema>;

export type ChecklistItem = z.infer<typeof checklistItemSchema>;

export type Frequency = z.infer<typeof frequencySchema>;

export type Reminder = z.infer<typeof reminderSchema>;

export type IconVariant = 'outline' | 'solid';

export interface IconProps {
  size?: number;
  fill?: string;
  variant?: IconVariant;
}

export type HabitActiveTab = 'calendar' | 'statistics' | 'edit';

export type TaskActiveTab = 'calendar' | 'edit';

export type NewActivityData = z.infer<typeof activitySchema>;

export type ActivityFilter = 'all' | 'habits' | 'tasks';

export type ActivityType = 'habit' | 'single task' | 'recurring task';

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  category: Category;
  priority: Priority;
  frequency: Frequency;
  isCompleted: boolean;
  note?: string;
  startDate?: Date;
  endDate?: Date;
  checklist?: ChecklistItem[];
  reminders?: Reminder[];
  isCarriedOver?: boolean;
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
