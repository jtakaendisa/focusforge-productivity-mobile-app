import { Animated } from 'react-native';
import { User } from 'firebase/auth';

import { PriorityType, categoryArray } from '../store';

export interface Todo {
  id: string;
  task: string;
  isCompleted: boolean;
}

export type AuthUser = User & {
  username?: string;
};

export type AnimatedInterpolation = Animated.AnimatedInterpolation<string | number>;

export type Filter = 'all' | 'open' | 'completed';

export type Category = (typeof categoryArray)[number];

export type Priority = PriorityType.low | PriorityType.normal | PriorityType.high;
