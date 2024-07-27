import { create } from 'zustand';
import uuid from 'react-native-uuid';

import { Theme, AuthUser, Activity, Habit, Task, TaskFilter } from '../entities';
import { CURRENT_DATE } from '../constants';

interface AppStore {
  theme: Theme;
  headerHeight: number;
  isSearchBarOpen: boolean;
  setTheme: (theme: Theme) => void;
  setHeaderHeight: (headerHeight: number) => void;
  setIsSearchBarOpen: (isSearchBarOpen: boolean) => void;
}

interface AuthStore {
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
}

interface ActivityStore {
  activities: Activity[];
  taskFilter: TaskFilter;
  selectedDate: Date;
  setActivities: (activities: Activity[]) => void;
  setTaskFilter: (taskFilter: TaskFilter) => void;
  setSelectedDate: (selectedDate: Date) => void;
}

interface TaskStore {
  tasks: Task[];
  selectedDate: Date;
  filter: TaskFilter;
  setTasks: (tasks: Task[]) => void;
  setSelectedDate: (selectedDate: Date) => void;
  setFilter: (filter: TaskFilter) => void;
}

interface HabitStore {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

export const categoryArray = [
  'Task',
  'Quit',
  'Art',
  'Meditation',
  'Study',
  'Sports',
  'Recreation',
  'Social',
  'Finance',
  'Health',
  'Work',
  'Nutrition',
  'Home',
  'Outdoor',
  'Other',
] as const;

const useAppStore = create<AppStore>((set) => ({
  theme: 'dark',
  headerHeight: 0,
  isSearchBarOpen: false,
  setTheme: (theme) => set((state) => ({ ...state, theme })),
  setHeaderHeight: (headerHeight) => set((state) => ({ ...state, headerHeight })),
  setIsSearchBarOpen: (isSearchBarOpen) =>
    set((state) => ({ ...state, isSearchBarOpen })),
}));

const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  setAuthUser: (authUser) => set((state) => ({ ...state, authUser })),
}));

const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  taskFilter: 'single task',
  selectedDate: CURRENT_DATE,
  filteredRecurringTasks: [],
  setActivities: (activities) => set((state) => ({ ...state, activities })),
  setTaskFilter: (taskFilter) => set((state) => ({ ...state, taskFilter })),
  setSelectedDate: (selectedDate) => set((state) => ({ ...state, selectedDate })),
}));

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  selectedDate: CURRENT_DATE,
  filter: 'single task',
  setTasks: (tasks) => set((state) => ({ ...state, tasks })),
  setSelectedDate: (selectedDate) => set((state) => ({ ...state, selectedDate })),
  setFilter: (filter) => set((state) => ({ ...state, filter })),
}));

const useHabitStore = create<HabitStore>((set) => ({
  habits: [],
  setHabits: (habits) => set((state) => ({ ...state, habits })),
}));

export { useAppStore, useAuthStore, useActivityStore, useTaskStore, useHabitStore };
