import { Animated } from 'react-native';
import { User } from 'firebase/auth';

import { PriorityType, categoryArray } from '../store';

export interface Todo {
  id: number;
  title: string;
  isFinished: boolean;
}

export type AuthUser = User & {
  username?: string;
};

export type AnimatedInterpolation = Animated.AnimatedInterpolation<string | number>;

export type Filter = 'all' | 'open' | 'finished';

export type Category = (typeof categoryArray)[number];

export type Priority = PriorityType.low | PriorityType.normal | PriorityType.high;
