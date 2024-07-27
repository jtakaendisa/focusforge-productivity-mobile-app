import { format, parse } from 'date-fns';

import { Task } from '../entities';
import { CURRENT_DATE } from '../constants';

interface DateGroupedTasks {
  [key: string]: Task[];
}

export const toTruncatedText = (text: string, maxLength: number, altMode?: boolean) => {
  if (text.length <= maxLength) {
    return text.trim();
  }
  if (altMode) {
    return text.slice(0, maxLength).trim();
  }
  return text.slice(0, maxLength).trim() + '...';
};

export const toFormattedDateString = (date: Date) => {
  return format(date, 'dd MMM yyyy');
};

export const toFormattedTimeString = (date: Date) => {
  return format(date, 'HH:mm');
};

export const toFormattedSectionTitle = (date: string) => {
  const yesterday = new Date(CURRENT_DATE);
  yesterday.setDate(CURRENT_DATE.getDate() - 1);
  const tomorrow = new Date(CURRENT_DATE);
  tomorrow.setDate(CURRENT_DATE.getDate() + 1);

  if (date === toFormattedDateString(yesterday)) {
    return 'Yesterday';
  } else if (date === toFormattedDateString(CURRENT_DATE)) {
    return 'Today';
  } else if (date === toFormattedDateString(tomorrow)) {
    return 'Tomorrow';
  } else {
    return date;
  }
};

export const toDateGroupedTasks = (tasks: Task[]) => {
  const groups: DateGroupedTasks = tasks.reduce((acc: DateGroupedTasks, task) => {
    const dueDate = toFormattedDateString(task.dueDate!);
    if (!acc[dueDate]) {
      acc[dueDate] = [];
    }
    acc[dueDate].push(task);
    return acc;
  }, {});

  // Sort the keys (due dates) in ascending order
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const dateA = parse(a, 'dd MMM yyyy', new Date()); // Convert formatted date string to Date object
    const dateB = parse(b, 'dd MMM yyyy', new Date());
    return dateA.getTime() - dateB.getTime();
  });

  // Create a new object with sorted keys
  const sortedGroups: DateGroupedTasks = {};
  sortedKeys.forEach((key) => {
    sortedGroups[key] = groups[key];
  });

  return sortedGroups;
};

export const toFormattedSections = (tasksByDueDate: { [key: string]: Task[] }) => {
  const sections: (string | Task)[] = [];
  Object.keys(tasksByDueDate).forEach((dueDate) => {
    sections.push(dueDate);
    sections.push(...tasksByDueDate[dueDate]);
  });
  return sections;
};
