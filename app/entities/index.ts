import { Animated } from 'react-native';
import { User } from 'firebase/auth';

import { categoryArray } from '../store';

export type AuthUser = User & {
  username?: string;
};

export type AnimatedInterpolation = Animated.AnimatedInterpolation<string | number>;

export type Filter = 'all' | 'open' | 'completed';

export type Category = (typeof categoryArray)[number];

export type Priority = 'Low' | 'Normal' | 'High';

type ChecklistItem = {
  id: string;
  task: string;
  isCompleted: boolean;
};

export interface Todo {
  id: string;
  task: string;
  isCompleted: boolean;
  category: Category;
  dueDate: string;
  priority: Priority;
  note: string;
  isCarriedOver: boolean;
  checklist: ChecklistItem[];
}
