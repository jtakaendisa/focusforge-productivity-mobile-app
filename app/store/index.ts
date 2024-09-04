import { create } from 'zustand';

import {
  Activity,
  ActivityFilter,
  AuthUser,
  Category,
  CompletionDatesMap,
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
  completionDatesMap: CompletionDatesMap;
  setActivities: (activities: Activity[]) => void;
  setSelectedDate: (selectedDate: Date) => void;
  setCompletionDatesMap: (completionDatesMap: CompletionDatesMap) => void;
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

const dummyActivities: Activity[] = [
  {
    category: 'Health',
    frequency: { isRepeatedOn: ['Monday', 'Wednesday', 'Friday'], type: 'specific' },
    id: 'a08c61c7-2a3a-45a5-b26d-32e941622cba',
    isCompleted: false,
    note: 'weight lifting',
    priority: 'Normal',
    reminders: [
      {
        id: '7dbea896-3316-4ad2-b800-d870c70e128c',
        time: new Date('2024-08-09T05:00:00.000Z'),
        type: 'notification',
      },
    ],
    startDate: new Date('2024-08-09T08:11:25.039Z'),
    title: 'Go to the gym',
    type: 'habit',
  },
  {
    category: 'Meditation',
    frequency: { type: 'daily' },
    id: '946d5ef3-9e86-47cf-afae-89e4e6a549bf',
    isCompleted: false,
    note: 'box breathing - 20 mins',
    priority: 'Normal',
    reminders: [
      {
        id: 'ae2112f1-e31f-4a8b-8c33-b41e68a92f39',
        time: new Date('2024-08-09T04:00:00.000Z'),
        type: 'alarm',
      },
    ],
    startDate: new Date('2024-08-09T08:11:25.039Z'),
    title: 'Meditate',
    type: 'habit',
  },
  {
    category: 'Study',
    endDate: new Date('2024-09-30T08:44:00.000Z'),
    frequency: { isRepeatedEvery: 2, type: 'repeats' },
    id: '65819642-3902-43a5-a394-0e5f86fa2ed4',
    isCompleted: false,
    note: '3D modeling, lighting effects',
    priority: 'Normal',
    reminders: [
      {
        id: 'ab9ea4af-56d2-4276-8192-2bd60eb15671',
        time: new Date('2024-08-09T06:00:00.000Z'),
        type: 'notification',
      },
    ],
    startDate: new Date('2024-08-09T08:11:25.039Z'),
    title: 'Learn Spline',
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
    category: 'Study',
    endDate: new Date('2024-10-31'),
    frequency: { type: 'daily' },
    id: '395506e0-2051-4d8d-a7d2-6f9d95050de3',
    isCarriedOver: false,
    isCompleted: false,
    note: 'Non-fiction, 1 hr session',
    priority: 'Normal',
    reminders: [
      {
        id: '8fd68936-697f-48b0-bdf7-d40416135215',
        time: new Date('2024-08-16T07:00:00.000Z'),
        type: 'notification',
      },
    ],
    startDate: new Date('2024-08-16'),
    title: 'Read a book',
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
  selectedDate: new Date(),
  completionDatesMap: {},
  setActivities: (activities) => set((state) => ({ ...state, activities })),
  setSelectedDate: (selectedDate) => set((state) => ({ ...state, selectedDate })),
  setCompletionDatesMap: (completionDatesMap) =>
    set((state) => ({ ...state, completionDatesMap })),
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
