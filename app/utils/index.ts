import { format } from 'date-fns';

import { Task } from '../entities';
import { TODAYS_DATE } from '../constants';

export const toTruncatedText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
};

export const toFormattedDateString = (date: Date) => {
  return format(date, 'dd MMM yyyy');
};

export const toFormattedSectionTitle = (date: string) => {
  TODAYS_DATE;
  const yesterday = new Date(TODAYS_DATE);
  yesterday.setDate(TODAYS_DATE.getDate() - 1);
  const tomorrow = new Date(TODAYS_DATE);
  tomorrow.setDate(TODAYS_DATE.getDate() + 1);

  if (date === toFormattedDateString(yesterday)) {
    return 'Yesterday';
  } else if (date === toFormattedDateString(TODAYS_DATE)) {
    return 'Today';
  } else if (date === toFormattedDateString(tomorrow)) {
    return 'Tomorrow';
  } else {
    return date;
  }
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
