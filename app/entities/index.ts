import { Animated } from 'react-native';
import { User } from 'firebase/auth';

export type AuthUser = User & {
  username?: string;
};

export interface Todo {
  id: number;
  title: string;
  isFinished: boolean;
}

export type AnimatedInterpolation = Animated.AnimatedInterpolation<string | number>;
