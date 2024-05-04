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

export enum PriorityType {
  low = 'Low',
  normal = 'Normal',
  high = 'High',
}

const dummyTodos: Todo[] = [
  {
    id: '27f8a35d-0deb-469b-aa01-5d53f124f195',
    isCompleted: true,
    task: 'Setup todo list structure',
    category: 'Task',
    dueDate: '2024-05-06',
    priority: 'Normal',
    note: '',
    isCarriedOver: false,
    checklist: [],
  },
  {
    id: '96c8d7b7-1d0d-4eac-84c5-5f8a4f12f59e',
    isCompleted: false,
    task: 'Render a list of tasks',
    category: 'Task',
    dueDate: '2024-05-07',
    priority: 'Low',
    note: '',
    isCarriedOver: true,
    checklist: [
      {
        id: '81d0a438-592f-4b0a-b53f-4f35298c6b51',
        task: 'Design UI mockups',
        isCompleted: false,
      },
      {
        id: '0577e874-68e1-48ff-8c51-45f88c0b435f',
        task: 'Implement task component',
        isCompleted: true,
      },
    ],
  },
  {
    id: '8f98a2bc-3197-4b6a-b7e6-0d9c9b6b92a5',
    isCompleted: false,
    task: 'Add a new task',
    category: 'Study',
    dueDate: '2024-05-08',
    priority: 'High',
    note: 'demo note',
    isCarriedOver: false,
    checklist: [
      {
        id: '8a09a7fb-46ab-496c-8b47-6e6fb197fd9d',
        task: 'Write backend API',
        isCompleted: false,
      },
      {
        id: 'b65f5fd1-9970-4d7a-9e6d-1fbbf9ff518d',
        task: 'Implement frontend form',
        isCompleted: true,
      },
      {
        id: 'f58689d1-087d-40dc-bef6-b1f0e3083cb2',
        task: 'Test form submission',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'd9a15f91-2240-4cb1-a7d1-dc6678f78336',
    isCompleted: true,
    task: 'Change the status of a task',
    category: 'Work',
    dueDate: '2024-05-06',
    priority: 'Normal',
    note: 'demo note',
    isCarriedOver: true,
    checklist: [],
  },
  {
    id: '4b6e01d8-c40d-4d06-9b12-8ddba9533d4c',
    isCompleted: true,
    task: 'Separate into 2 tabs, ongoing and complete',
    category: 'Task',
    dueDate: '2024-05-06',
    priority: 'High',
    note: '',
    isCarriedOver: false,
    checklist: [
      {
        id: 'c71599e3-44a3-4f47-9a32-520cb038d7c6',
        task: 'Create ongoing tab component',
        isCompleted: true,
      },
      {
        id: '64f934a1-5b2f-4b14-b422-b0f9fc5db6b7',
        task: 'Create complete tab component',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'db3e15b4-c65a-46b0-8b5b-b22f0e44196d',
    isCompleted: false,
    task: 'Update user profile UI',
    category: 'Task',
    dueDate: '2024-05-09',
    priority: 'Normal',
    note: '',
    isCarriedOver: false,
    checklist: [
      {
        id: '8a09a7fb-46ab-496c-8b47-6e6fb197fd9d',
        task: 'Design UI for profile',
        isCompleted: false,
      },
      {
        id: 'b65f5fd1-9970-4d7a-9e6d-1fbbf9ff518d',
        task: 'Implement profile settings',
        isCompleted: false,
      },
    ],
  },
  {
    id: '09b6843c-7b18-4e40-a2de-6f5f01df32cb',
    isCompleted: false,
    task: 'Review project timeline',
    category: 'Work',
    dueDate: '2024-05-10',
    priority: 'High',
    note: '',
    isCarriedOver: true,
    checklist: [],
  },
  {
    id: 'b74dd667-0f38-4db4-a885-437b36cdde72',
    isCompleted: false,
    task: 'Write article on productivity tips',
    category: 'Study',
    dueDate: '2024-05-09',
    priority: 'Normal',
    note: '',
    isCarriedOver: false,
    checklist: [],
  },
  {
    id: '1b9b1197-85ef-43ac-a221-ecacfcfe3e12',
    isCompleted: false,
    task: 'Prepare for presentation',
    category: 'Work',
    dueDate: '2024-05-08',
    priority: 'High',
    note: 'Gather data and create slides',
    isCarriedOver: false,
    checklist: [],
  },
  {
    id: '2f994749-f2cf-43b6-ba67-0e2c94e0c36d',
    isCompleted: false,
    task: 'Practice guitar chords',
    category: 'Art',
    dueDate: '2024-05-07',
    priority: 'Normal',
    note: 'demo note',
    isCarriedOver: true,
    checklist: [],
  },
  {
    id: '0e7366c2-490e-41bb-93e6-f4f1afed7fb3',
    isCompleted: false,
    task: 'Run 5 miles',
    category: 'Sports',
    dueDate: '2024-05-08',
    priority: 'Normal',
    note: '',
    isCarriedOver: false,
    checklist: [],
  },
  {
    id: 'c4980308-4c71-4e96-8234-ec9fbd264489',
    isCompleted: false,
    task: 'Watch movie with friends',
    category: 'Entertainment',
    dueDate: '2024-05-07',
    priority: 'Normal',
    note: 'Choose a movie and time',
    isCarriedOver: true,
    checklist: [],
  },
  {
    id: 'faae3c8b-4d79-4325-bf16-80f3288a4a67',
    isCompleted: false,
    task: 'Call parents',
    category: 'Social',
    dueDate: '2024-05-06',
    priority: 'Low',
    note: '',
    isCarriedOver: false,
    checklist: [
      {
        id: 'e6d1cb29-19d1-4f68-b7a2-836de51db20a',
        task: 'Ask about their health',
        isCompleted: false,
      },
      {
        id: 'bb3004ff-1b8d-43f1-b7a9-06f74e469200',
        task: 'Discuss upcoming visit',
        isCompleted: false,
      },
    ],
  },
  {
    id: '5d4b8039-48ec-4fc3-835e-65d17e3b86d5',
    isCompleted: false,
    task: 'Review monthly expenses',
    category: 'Finance',
    dueDate: '2024-05-09',
    priority: 'High',
    note: 'Check bills and subscriptions',
    isCarriedOver: false,
    checklist: [],
  },
  {
    id: 'b05f011f-9d57-4b4f-bbb3-384eaf499a71',
    isCompleted: false,
    task: 'Go for a run',
    category: 'Health',
    dueDate: '2024-05-06',
    priority: 'Normal',
    note: '',
    isCarriedOver: false,
    checklist: [
      {
        id: '8917d35e-e09e-4cd3-90d4-74b99d8d5b08',
        task: 'Stretch before and after',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'c36ed8b2-459a-432e-9f2d-f62c65190ed6',
    isCompleted: false,
    task: 'Finish project proposal',
    category: 'Work',
    dueDate: '2024-05-09',
    priority: 'High',
    note: 'Include cost estimates',
    isCarriedOver: false,
    checklist: [
      {
        id: '0a5c8a50-91cc-4932-bb8f-9670497ff6e5',
        task: 'Finalize budget section',
        isCompleted: false,
      },
      {
        id: '8acafcf4-8bbf-4c07-b591-7cf848f32e6b',
        task: 'Review with team members',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'cfab6545-9915-4c7e-8965-34f82618ebd9',
    isCompleted: false,
    task: 'Prepare healthy lunch',
    category: 'Nutrition',
    dueDate: '2024-05-07',
    priority: 'Normal',
    note: '',
    isCarriedOver: false,
    checklist: [],
  },
  {
    id: 'f180d3b2-c572-4d24-b1cf-32ec5f4ebe0a',
    isCompleted: false,
    task: 'Clean living room',
    category: 'Home',
    dueDate: '2024-05-08',
    priority: 'Low',
    note: '',
    isCarriedOver: true,
    checklist: [
      {
        id: '6e68d933-7ef0-4387-9329-0b5b5367e67f',
        task: 'Vacuum carpet',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'd702890e-9ef5-4d45-9e15-7d0017357b62',
    isCompleted: false,
    task: 'Go for a hike',
    category: 'Outdoor',
    dueDate: '2024-05-10',
    priority: 'Normal',
    note: 'Choose a trail',
    isCarriedOver: false,
    checklist: [
      {
        id: 'af20214d-8041-4e86-9856-0d9f1e51c238',
        task: 'Pack water and snacks',
        isCompleted: false,
      },
    ],
  },
];

export const categoryArray = [
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

export { useAuthStore, useTodoStore };
