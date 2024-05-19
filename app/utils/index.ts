import { format } from 'date-fns';

import { Task } from '../entities';

export const toTruncatedText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
};

export const toFormattedDateString = (date: Date) => {
  return format(date, 'dd MMM yyyy');
};

export const toDateGroupedTasks = (tasks: Task[]) => {
  return tasks.reduce((groups: { [key: string]: Task[] }, task) => {
    const dueDate = toFormattedDateString(task.dueDate);
    if (!groups[dueDate]) {
      groups[dueDate] = [];
    }
    groups[dueDate].push(task);
    return groups;
  }, {});
};

export const toFormattedSections = (tasksByDueDate: { [key: string]: Task[] }) => {
  const sections: (string | Task)[] = [];
  Object.keys(tasksByDueDate).forEach((dueDate) => {
    sections.push(dueDate);
    sections.push(...tasksByDueDate[dueDate]);
  });
  return sections;
};
