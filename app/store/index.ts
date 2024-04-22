import { create } from 'zustand';

import { AuthUser, Todo } from '../entities';

interface AuthStore {
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
}

interface TodoStore {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
}

const dummyTodos = [
  {
    id: 0,
    title: 'Setup todo list structure',
    isFinished: true,
  },
  {
    id: 1,
    title: 'Render a list of tasks',
    isFinished: false,
  },
  {
    id: 2,
    title: 'Add a new task',
    isFinished: false,
  },
  {
    id: 3,
    title: 'Change the status of a task',
    isFinished: false,
  },
  {
    id: 4,
    title: 'Seperate into 2 tabs, ongoing and complete ',
    isFinished: false,
  },
  {
    id: 5,
    title: 'Setup todo list structure',
    isFinished: true,
  },
  {
    id: 6,
    title: 'Render a list of tasks',
    isFinished: false,
  },
  {
    id: 7,
    title: 'Add a new task',
    isFinished: false,
  },
  {
    id: 8,
    title: 'Change the status of a task',
    isFinished: false,
  },
  {
    id: 9,
    title: 'Seperate into 2 tabs, ongoing and complete ',
    isFinished: false,
  },
  {
    id: 10,
    title: 'Setup todo list structure',
    isFinished: true,
  },
  {
    id: 11,
    title: 'Render a list of tasks',
    isFinished: false,
  },
  {
    id: 12,
    title: 'Add a new task',
    isFinished: false,
  },
  {
    id: 13,
    title: 'Change the status of a task',
    isFinished: false,
  },
  {
    id: 14,
    title: 'Seperate into 2 tabs, ongoing and complete ',
    isFinished: false,
  },
  {
    id: 15,
    title: 'Setup todo list structure',
    isFinished: true,
  },
  {
    id: 16,
    title: 'Render a list of tasks',
    isFinished: false,
  },
  {
    id: 17,
    title: 'Add a new task',
    isFinished: false,
  },
  {
    id: 18,
    title: 'Change the status of a task',
    isFinished: false,
  },
  {
    id: 19,
    title: 'Seperate into 2 tabs, ongoing and complete ',
    isFinished: false,
  },
];

const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  setAuthUser: (authUser) => set((state) => ({ ...state, authUser })),
}));

const useTodoStore = create<TodoStore>((set) => ({
  todos: dummyTodos,
  setTodos: (todos) => set((state) => ({ ...state, todos })),
  addTodo: (todo) => set((state) => ({ ...state, todos: [...state.todos, todo] })),
}));

export { useAuthStore, useTodoStore };
