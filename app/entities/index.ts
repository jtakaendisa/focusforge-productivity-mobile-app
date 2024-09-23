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

export type IconVariant = 'outline' | 'solid';

export interface IconProps {
  size?: number;
  fill?: string;
  variant?: IconVariant;
}

export type TaskFilter = 'single task' | 'recurring task';

export type Category = z.infer<typeof categorySchema>;

export type Priority = z.infer<typeof prioritySchema>;

export type ChecklistItem = z.infer<typeof checklistItemSchema>;

export type Frequency = z.infer<typeof frequencySchema>;

export type Reminder = z.infer<typeof reminderSchema>;

export type NewActivityData = z.infer<typeof activitySchema>;

export type TabRoute = 'home' | 'habits' | 'tasks' | 'timer' | 'settings';

export type SearchRoute = 'home' | 'habits' | 'tasks';

export type HabitActiveTab = 'calendar' | 'statistics' | 'edit';

export type TaskActiveTab = 'calendar' | 'edit';

export type ActivityFilter = 'all' | 'habits' | 'tasks';

export type BarGraphFilter = 'month' | 'year';

export type ActivityType = 'habit' | 'single task' | 'recurring task';

export interface Activity {
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
}

export interface DateGroupedTasks {
  [key: string]: Activity[];
}

export interface CompletionDate {
  date: string;
  isCompleted: boolean;
}

export interface CompletionDatesMap {
  [activityId: string]: CompletionDate[];
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
}
