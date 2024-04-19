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
