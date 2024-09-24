import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Activity, CompletionDate, CompletionDatesMap, Frequency } from '../entities';
import { useActivityStore } from '../store';
import { isLastDayOfMonth, toFormattedDateString } from '../utils';
import { addDays, addMonths, endOfMonth } from 'date-fns';

const getCompletionDatesFromStorage = async (): Promise<
  Record<string, CompletionDate[]>
> => {
  try {
    const data = await AsyncStorage.getItem('completionDatesMap');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to retrieve completion dates map:', error);
    return {};
  }
};

const setCompletionDatesInStorage = async (
  completionDatesMap: Record<string, CompletionDate[]>
) => {
  try {
    await AsyncStorage.setItem(
      'completionDatesMap',
      JSON.stringify(completionDatesMap)
    );
  } catch (error) {
    console.error('Failed to save completion dates map:', error);
  }
};

const generateCompletionDates = (
  startDate: Date,
  frequency: Frequency,
  endDate?: Date
) => {
  const dates: CompletionDate[] = [];
  let currentDate = startDate;
  const currentDateLimit = endDate ? endDate : endOfMonth(new Date());

  switch (frequency.type) {
    case 'daily':
      while (currentDate <= currentDateLimit) {
        dates.push({ date: toFormattedDateString(currentDate), isCompleted: false });
        currentDate = addDays(currentDate, 1);
      }
      break;

    case 'specific':
      const daysOfWeek = frequency.isRepeatedOn || [];
      while (currentDate <= currentDateLimit) {
        if (
          daysOfWeek.includes(
            currentDate.toLocaleDateString('en-US', { weekday: 'long' })
          )
        ) {
          dates.push({ date: toFormattedDateString(currentDate), isCompleted: false });
        }
        currentDate = addDays(currentDate, 1);
      }
      break;

    case 'repeats':
      const interval = frequency.isRepeatedEvery || 1;
      while (currentDate <= currentDateLimit) {
        dates.push({ date: toFormattedDateString(currentDate), isCompleted: false });
        currentDate = addDays(currentDate, interval);
      }
      break;
  }

  return dates;
};

const mergeCompletionDates = (
  existingCompletionDates: CompletionDate[],
  newCompletionDates: CompletionDate[]
) => {
  // Create a map from completionDates to preserve the completion status
  const dateMap: { [key: string]: CompletionDate } = {};

  // Add existing dates to the map
  existingCompletionDates.forEach((dateObj) => {
    dateMap[dateObj.date] = dateObj;
  });

  // Add new dates to the map, preserving existing completion status
  newCompletionDates.forEach((dateObj) => {
    if (!dateMap[dateObj.date]) {
      dateMap[dateObj.date] = dateObj;
    }
  });

  // Convert the map back to an array
  return Object.values(dateMap);
};

const getLastUpdateDate = async () => {
  const lastUpdate = await AsyncStorage.getItem('lastCompletionDateUpdate');
  return lastUpdate ? new Date(lastUpdate) : null;
};

const setLastUpdateDate = async (date: Date) => {
  await AsyncStorage.setItem('lastCompletionDateUpdate', date.toISOString());
};

const extendCompletionDates = async (
  activities: Activity[],
  completionDatesMap: CompletionDatesMap
) => {
  const newCompletionDatesMap = { ...completionDatesMap };
  const currentDate = new Date();
  const nextMonthEnd = endOfMonth(addMonths(currentDate, 1));

  activities.forEach((activity) => {
    if (!activity.endDate && activity.type !== 'single task') {
      const existingDates = newCompletionDatesMap[activity.id] || [];
      const newDates = generateCompletionDates(
        currentDate,
        activity.frequency,
        nextMonthEnd
      );
      newCompletionDatesMap[activity.id] = mergeCompletionDates(
        existingDates,
        newDates
      );
    }
  });

  return newCompletionDatesMap;
};

const useCompletionDates = () => {
  const activities = useActivityStore((s) => s.activities);
  const completionDatesMap = useActivityStore((s) => s.completionDatesMap);
  const setCompletionDatesMap = useActivityStore((s) => s.setCompletionDatesMap);

  const [loadedCompletionDates, setLoadedCompletionDates] = useState(false);

  const fetchCompletionDatesMap = useCallback(async () => {
    const data = await getCompletionDatesFromStorage();
    setCompletionDatesMap(data);
  }, []);

  const updateCompletionDatesMap = useCallback(
    async (completionDatesMap: Record<string, CompletionDate[]>) => {
      await setCompletionDatesInStorage(completionDatesMap);
      setCompletionDatesMap(completionDatesMap);
    },
    []
  );

  useEffect(() => {
    fetchCompletionDatesMap();
  }, []);

  useEffect(() => {
    const updateCompletionDates = async (
      activities: Activity[],
      completionDatesMap: CompletionDatesMap
    ) => {
      const lastUpdateDate = await getLastUpdateDate();
      const currentDate = new Date();

      if (
        isLastDayOfMonth(currentDate) &&
        (!lastUpdateDate || lastUpdateDate < currentDate)
      ) {
        const updatedCompletionDatesMap = await extendCompletionDates(
          activities,
          completionDatesMap
        );
        await setCompletionDatesInStorage(updatedCompletionDatesMap);
        await setLastUpdateDate(currentDate);
      }
      setLoadedCompletionDates(true);
    };

    if (activities && completionDatesMap) {
      updateCompletionDates(activities, completionDatesMap);
    }
  }, [activities, completionDatesMap]);

  return {
    loadedCompletionDates,
    completionDatesMap,
    fetchCompletionDatesMap,
    updateCompletionDatesMap,
    generateCompletionDates,
    mergeCompletionDates,
  };
};

export default useCompletionDates;
