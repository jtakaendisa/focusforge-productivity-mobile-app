import { create } from 'zustand';

import { AuthUser, Filter, Todo } from '../entities';

interface AuthStore {
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
}

interface TodoStore {
  todos: Todo[];
  searchQuery: string;
  filter: Filter;
  setTodos: (todos: Todo[]) => void;
  setSearchQuery: (searchQuery: string) => void;
  setFilter: (filter: Filter) => void;
}

enum PriorityType {
  low = 'Low',
  normal = 'Normal',
  high = 'High',
}

const dummyTodos = [
  {
    id: '0',
    task: 'Setup todo list structure',
    isCompleted: true,
  },
  {
    id: '1',
    task: 'Render a list of tasks',
    isCompleted: false,
  },
  {
    id: '2',
    task: 'Add a new task',
    isCompleted: false,
  },
  {
    id: '3',
    task: 'Change the status of a task',
    isCompleted: false,
  },
  {
    id: '4',
    task: 'Seperate into 2 tabs, ongoing and complete ',
    isCompleted: false,
  },
];

const categoryArray = [
  'Task',
  'Quit a bad habit',
  'Art',
  'Meditation',
  'Study',
  'Sports',
  'Entertainment',
  'Social',
  'Finance',
  'Health',
  'Work',
  'Nutrition',
  'Home',
  'Outdoor',
  'Other',
] as const;

const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  setAuthUser: (authUser) => set((state) => ({ ...state, authUser })),
}));

const useTodoStore = create<TodoStore>((set) => ({
  todos: dummyTodos,
  searchQuery: '',
  filter: 'all',
  setTodos: (todos) => set((state) => ({ ...state, todos })),
  setSearchQuery: (searchQuery) => set((state) => ({ ...state, searchQuery })),
  setFilter: (filter) => set((state) => ({ ...state, filter })),
}));

export { useAuthStore, useTodoStore, categoryArray, PriorityType };
