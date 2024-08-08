import { create } from 'zustand';

import { CURRENT_DATE } from '../constants';
import {
  Activity,
  ActivityFilter,
  AuthUser,
  Category,
  TaskFilter,
  Theme,
} from '../entities';

interface AppStore {
  theme: Theme;
  headerHeight: number;
  setTheme: (theme: Theme) => void;
  setHeaderHeight: (headerHeight: number) => void;
}

interface AuthStore {
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
}

interface ActivityStore {
  activities: Activity[];
  selectedDate: Date;
  setActivities: (activities: Activity[]) => void;
  setSelectedDate: (selectedDate: Date) => void;
}

interface SearchStore {
  isSearchBarOpen: boolean;
  searchTerm: string;
  activityFilter: ActivityFilter;
  taskFilter: TaskFilter;
  selectedCategories: Category[];
  filteredActivities: (string | Activity)[];
  setIsSearchBarOpen: (isSearchBarOpen: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  setActivityFilter: (activityFilter: ActivityFilter) => void;
  setTaskFilter: (taskFilter: TaskFilter) => void;
  setSelectedCategories: (selectedCategories: Category[]) => void;
  setFilteredActivities: (filteredActivities: (string | Activity)[]) => void;
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

const dummyActivities: Activity[] = [
  {
    bestStreak: 0,
    category: 'Health',
    currentStreak: 0,
    frequency: { isRepeatedOn: ['Monday', 'Wednesday', 'Friday'], type: 'specific' },
    id: 'f22eb827-91c1-4a56-9c72-57ca99af4c84',
    isCompleted: false,
    note: 'weight lifting',
    priority: 'Normal',
    reminders: [
      {
        id: '48be65d1-02fe-4362-bd28-ee1b20fe7b1b',
        time: new Date('2024-08-07T05:00:00.000Z'),
        type: 'notification',
      },
    ],
    startDate: new Date('2024-08-07'),
    title: 'Go to the gym',
    type: 'habit',
  },
  {
    bestStreak: 0,
    category: 'Meditation',
    currentStreak: 0,
    frequency: { type: 'daily' },
    id: '8c7ebe95-068c-496f-8397-3cd494bf291f',
    isCompleted: false,
    note: 'box breathing',
    priority: 'Normal',
    startDate: new Date('2024-08-07'),
    title: 'Meditate',
    type: 'habit',
  },
  {
    bestStreak: 0,
    category: 'Study',
    currentStreak: 0,
    endDate: new Date('2024-09-30'),
    frequency: { isRepeatedEvery: 2, type: 'repeats' },
    id: '73e07481-71e4-4786-b3fa-3575244a4672',
    isCompleted: false,
    note: 'sculpting 3D models and lighting effects',
    priority: 'Normal',
    startDate: new Date('2024-08-07'),
    title: 'Practice using Spline',
    type: 'habit',
  },

  {
    category: 'Study',
    endDate: new Date('2024-07-30'),
    frequency: { type: 'once' },
    id: '923efdf0-8194-4722-99f4-960382abedc0',
    isCarriedOver: true,
    isCompleted: false,
    priority: 'Normal',
    title: 'Test ST 1',
    type: 'single task',
  },
  {
    category: 'Recreation',
    checklist: [
      {
        id: '35bc55e9-bb17-4198-a6c6-3aa1957eb056',
        isCompleted: false,
        title: 'test 1',
      },
      {
        id: '06a8125f-245e-4249-a2f5-c8b17ee4b3a0',
        isCompleted: false,
        title: 'test 2',
      },
      {
        id: '10def04a-0c08-4aff-9498-fcd2842cbce5',
        isCompleted: false,
        title: 'test 3',
      },
    ],
    endDate: new Date('2024-07-31'),
    frequency: { type: 'once' },
    id: '2cf47303-c2a0-4b03-9b85-e3932297304b',
    isCarriedOver: true,
    isCompleted: false,
    note: 'lorem ipsum',
    priority: 'Normal',
    reminders: [
      {
        id: '65cac13f-7296-45ba-a34a-951e4fd4ccc3',
        time: new Date('2024-07-30T18:30:00.000Z'),
        type: 'notification',
      },
    ],
    title: 'Test ST 2',
    type: 'single task',
  },
  {
    category: 'Task',
    endDate: new Date('2024-07-31'),
    frequency: { type: 'once' },
    id: '8bfb8d1f-58df-41aa-8828-b21beb7d4c70',
    isCarriedOver: false,
    isCompleted: false,
    priority: 'High',
    title: 'Test ST 3',
    type: 'single task',
  },
  {
    category: 'Nutrition',
    endDate: new Date('2024-07-30'),
    frequency: { type: 'once' },
    id: '8bcb8d9f-58vf-41da-8848-b41beb4d4c70',
    isCarriedOver: true,
    isCompleted: true,
    priority: 'Normal',
    title: 'Test ST 0',
    type: 'single task',
  },
  {
    category: 'Task',
    frequency: { type: 'daily' },
    id: '85700a80-7121-41c9-9d50-65fe9c280a7d',
    isCarriedOver: false,
    isCompleted: false,
    priority: 'Normal',
    startDate: new Date('2024-07-30'),
    title: 'Test RT 1',
    type: 'recurring task',
  },
  {
    category: 'Finance',
    checklist: [
      {
        id: 'e164205c-219a-44fe-9895-827e37fa7df5',
        isCompleted: false,
        title: 'test 1',
      },
      {
        id: '8e582a7b-9dc1-44ee-ae52-42f3ab3fc7ed',
        isCompleted: false,
        title: 'test 2',
      },
    ],
    endDate: new Date('2024-08-08'),
    frequency: { isRepeatedOn: ['Monday', 'Wednesday', 'Friday'], type: 'specific' },
    id: '7ed33048-dc5a-47de-81b2-7ad65949cb2b',
    isCarriedOver: false,
    isCompleted: false,
    note: 'lorem ipsum hadouken',
    priority: 'Low',
    reminders: [
      {
        id: '0c0f70ff-b103-4cb7-8d27-306e02ac7d15',
        time: new Date('2024-07-30T08:28:40.974Z'),
        type: 'notification',
      },
    ],
    startDate: new Date('2024-07-30T08:28:40.974Z'),
    title: 'Test RT 2',
    type: 'recurring task',
  },
  {
    category: 'Work',
    frequency: { isRepeatedEvery: 2, type: 'repeats' },
    id: 'e10bc4b8-3953-4ffb-bede-9b5e3e95f9ef',
    isCarriedOver: false,
    isCompleted: false,
    priority: 'Normal',
    startDate: new Date('2024-07-30'),
    title: 'Test RT 3',
    type: 'recurring task',
  },
];

const useAppStore = create<AppStore>((set) => ({
  theme: 'dark',
  headerHeight: 0,
  setTheme: (theme) => set((state) => ({ ...state, theme })),
  setHeaderHeight: (headerHeight) => set((state) => ({ ...state, headerHeight })),
}));

const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  setAuthUser: (authUser) => set((state) => ({ ...state, authUser })),
}));

const useActivityStore = create<ActivityStore>((set) => ({
  activities: dummyActivities,
  selectedDate: CURRENT_DATE,
  setActivities: (activities) => set((state) => ({ ...state, activities })),
  setSelectedDate: (selectedDate) => set((state) => ({ ...state, selectedDate })),
}));

const useSearchStore = create<SearchStore>((set) => ({
  isSearchBarOpen: false,
  searchTerm: '',
  activityFilter: 'all',
  taskFilter: 'single task',
  selectedCategories: [],
  filteredActivities: [],
  setIsSearchBarOpen: (isSearchBarOpen) =>
    set((state) => ({ ...state, isSearchBarOpen })),
  setSearchTerm: (searchTerm) => set((state) => ({ ...state, searchTerm })),
  setActivityFilter: (activityFilter) => set((state) => ({ ...state, activityFilter })),
  setTaskFilter: (taskFilter) => set((state) => ({ ...state, taskFilter })),
  setSelectedCategories: (selectedCategories) =>
    set((state) => ({ ...state, selectedCategories })),
  setFilteredActivities: (filteredActivities) =>
    set((state) => ({ ...state, filteredActivities })),
}));

export { useActivityStore, useAppStore, useAuthStore, useSearchStore };
