import { Animated } from 'react-native';
import { User } from 'firebase/auth';

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
