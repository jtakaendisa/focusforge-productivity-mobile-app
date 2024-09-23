import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isBefore,
  isEqual,
  isSameDay,
  isWithinInterval,
  parse,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';

import { CompletionDate } from '../entities';

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

export const createUTCDate = (date: Date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return parseISO(`${formattedDate}T00:00:00Z`);
};

export const toFormattedSectionTitle = (date: string) => {
  const currentDate = new Date();
  const yesterday = new Date();
  const tomorrow = new Date();
  yesterday.setDate(currentDate.getDate() - 1);
  tomorrow.setDate(currentDate.getDate() + 1);

  if (date === toFormattedDateString(yesterday)) {
    return 'Yesterday';
  } else if (date === toFormattedDateString(currentDate)) {
    return 'Today';
  } else if (date === toFormattedDateString(tomorrow)) {
    return 'Tomorrow';
  } else {
    return date;
  }
};

export const toCleanedObject = <T extends { [key: string]: any }>(obj: T): T => {
  const cleanedObj = {} as T;
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleanedObj[key] = obj[key];
    }
  }
  return cleanedObj;
};

export const setDateToMidnight = (date: Date) => startOfDay(date);

export const calculateStreaks = (completionDates: CompletionDate[]) => {
  const currentDate = new Date();

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let beginTally = false;
  let foundCurrentStreak = false;

  // Traverse the array from the end to the beginning
  for (let i = completionDates.length - 1; i >= 0; i--) {
    const completionDate = completionDates[i];
    const date = parse(completionDate.date, 'dd MMM yyyy', currentDate);

    // Only consider dates on or before the current date
    if (date > currentDate) {
      continue;
    }

    if (!beginTally) {
      const previousCompletionDate = completionDates[i - 1];

      if (!previousCompletionDate.isCompleted) {
        currentStreak = completionDate.isCompleted ? 1 : 0;
        foundCurrentStreak = true;
      }

      beginTally = true;
    }

    if (completionDate.isCompleted) {
      tempStreak++;

      if (!foundCurrentStreak) {
        currentStreak = tempStreak;
      }

      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;

      if (completionDate.date !== toFormattedDateString(currentDate))
        foundCurrentStreak = true;
    }
  }
  return { currentStreak, bestStreak };
};

export const parseDate = (dateString: string) =>
  parse(dateString, 'dd MMM yyyy', new Date());

export const calculateHabitScore = (completionDates: CompletionDate[]) => {
  const currentDate = new Date();

  // Filter entries up to the current date
  const entriesUpToNow = completionDates
    .map((entry) => ({ ...entry, parsedDate: parseDate(entry.date) }))
    .filter(
      (entry) =>
        isBefore(entry.parsedDate, currentDate) ||
        isEqual(entry.parsedDate, currentDate)
    );

  const totalEntriesUpToNow = entriesUpToNow.length;

  const completedEntriesUpToNow = entriesUpToNow.filter(
    (entry) => entry.isCompleted
  ).length;

  return completedEntriesUpToNow / totalEntriesUpToNow;
};

export const calculateHabitCompletionMetrics = (
  completionDates: CompletionDate[],
  currentDate = new Date()
) => {
  // Parse dates
  const entries = completionDates.map((entry) => ({
    ...entry,
    parsedDate: parseDate(entry.date),
  }));

  // Define date ranges
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);

  const startOfCurrentYear = startOfYear(currentDate);
  const endOfCurrentYear = endOfYear(currentDate);

  // Filter function
  const filterEntries = (startDate: Date, endDate: Date) =>
    entries.filter((entry) =>
      isWithinInterval(entry.parsedDate, { start: startDate, end: endDate })
    );

  // Get metrics
  return {
    week: filterEntries(startOfCurrentWeek, endOfCurrentWeek).filter(
      (entry) => entry.isCompleted
    ).length,
    month: filterEntries(startOfCurrentMonth, endOfCurrentMonth).filter(
      (entry) => entry.isCompleted
    ).length,
    year: filterEntries(startOfCurrentYear, endOfCurrentYear).filter(
      (entry) => entry.isCompleted
    ).length,

    allTime: entries.filter((entry) => entry.isCompleted).length,
  };
};

export const isLastDayOfMonth = (date: Date): boolean => {
  return isSameDay(date, endOfMonth(date));
};
