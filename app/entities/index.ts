import { Animated } from 'react-native';
import { User } from 'firebase/auth';

import { categoryArray } from '../store';

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

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  category: Category;
  dueDate: Date;
  priority: Priority;
  note: string;
  isCarriedOver: boolean;
  isRecurring: boolean;
  checklist: ChecklistItem[];
}

export interface Frequency {
  type: 'daily' | 'specific' | 'repeats';
  isRepeatedOn?: string[];
  isRepeatedEvery?: number;
}

export interface Reminder {
  id: string;
  type: 'notification' | 'alarm';
  time: Date;
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

export type TabRoute = '' | 'habits' | 'tasks' | 'timer' | 'settings';
