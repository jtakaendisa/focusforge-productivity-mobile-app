import { SafeAreaView, StatusBar } from 'react-native';
import { useCallback } from 'react';
import SearchBar from './SearchBar';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { styled } from 'tamagui';
import DefaultHeader from './DefaultHeader';
import {
  useActivityStore,
  useAppStore,
  useHabitStore,
  useTaskStore,
} from '@/app/store';
import { useEffect, useMemo } from 'react';
import {
  toDateGroupedTasks,
  toFormattedDateString,
  toFormattedSections,
} from '@/app/utils';
import { usePathname } from 'expo-router';
import { Activity, TabRoute, Task } from '@/app/entities';
import { TODAYS_DATE } from '@/app/constants';

interface Props {
  title?: string;
}

const CustomHeader = ({ title }: Props) => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useAppStore((s) => s.isSearchBarOpen);
  const habits = useHabitStore((s) => s.habits);
  const tasks = useTaskStore((s) => s.tasks);
  const selectedDate = useTaskStore((s) => s.selectedDate);
  const setHeaderHeight = useAppStore((s) => s.setHeaderHeight);
  const setFilteredActivities = useActivityStore((s) => s.setFilteredActivities);
  const setFilteredHabits = useActivityStore((s) => s.setFilteredHabits);
  const setFilteredSingleTasks = useActivityStore((s) => s.setFilteredSingleTasks);
  const setFilteredRecurringTasks = useActivityStore(
    (s) => s.setFilteredRecurringTasks
  );

  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const defaultHeaderHeight = getDefaultHeaderHeight(frame, false, insets.top);
  const statusBarHeight = StatusBar.currentHeight || 0;
  const headerHeight = defaultHeaderHeight - statusBarHeight;

  const recurringTasks = useMemo(
    () => tasks.filter((task) => task.isRecurring === true),
    [tasks]
  );

  const singleTasks = useMemo(
    () => tasks.filter((task) => task.isRecurring === false),
    [tasks]
  );

  const singleSectionedTasks = useMemo(() => {
    const dateGroupedTasks = toDateGroupedTasks(singleTasks);
    return toFormattedSections(dateGroupedTasks);
  }, [singleTasks]);

  const carryOverTasks = useCallback((tasks: Task[]) => {
    console.log('was called', tasks);
    return tasks.map((task) => {
      if (!task.isRecurring && task.isCarriedOver && !task.isCompleted) {
        const dueDate = new Date(task.dueDate!);
        console.log(task.title, { dueDate }, { TODAYS_DATE });
        if (dueDate < TODAYS_DATE) {
          return { ...task, dueDate: TODAYS_DATE };
        }
      }
      return task;
    });
  }, []);

  const filterActivitiesByDate = useCallback((date: Date, activities: Activity[]) => {
    const filtered = activities.filter((activity) => {
      const activityStartDate = new Date(activity.startDate!);
      const activityEndDate = activity.endDate ? new Date(activity.endDate) : null;

      // Check if the habit is within the date range
      if (activityEndDate && date > activityEndDate) return false;
      if (date < activityStartDate) return false;

      // Check habit frequency
      switch (activity.frequency!.type) {
        case 'daily':
          return true;
        case 'specific':
          return activity.frequency!.isRepeatedOn!.includes(
            date.toLocaleDateString('en-US', { weekday: 'long' })
          );
        case 'repeats':
          const daysDifference = Math.floor(
            (date.getTime() - activityStartDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysDifference % activity.frequency!.isRepeatedEvery! === 0;
        default:
          return false;
      }
    });

    return filtered;
  }, []);

  useEffect(() => {
    if (headerHeight) {
      setHeaderHeight(headerHeight);
    }
  }, [headerHeight, setHeaderHeight]);

  useEffect(() => {
    setFilteredSingleTasks(singleSectionedTasks);
    setFilteredRecurringTasks(recurringTasks);
  }, [singleSectionedTasks, recurringTasks]);

  useEffect(() => {
    if (pathname === 'home') {
      const filteredSingleTasks = carryOverTasks(singleTasks).filter(
        (task) =>
          toFormattedDateString(task.dueDate!) === toFormattedDateString(selectedDate)
      );

      const filteredRecurringActivities = filterActivitiesByDate(selectedDate, [
        ...recurringTasks,
        ...habits,
      ]);

      setFilteredActivities([...filteredSingleTasks, ...filteredRecurringActivities]);
    }
  }, [
    singleTasks,
    recurringTasks,
    habits,
    selectedDate,
    pathname,
    carryOverTasks,
    filterActivitiesByDate,
  ]);

  return (
    <Container height={defaultHeaderHeight} isSearchBarOpen={isSearchBarOpen}>
      {isSearchBarOpen ? (
        <SearchBar
          height={headerHeight}
          habits={habits}
          singleTasks={singleSectionedTasks}
          recurringTasks={recurringTasks}
        />
      ) : (
        <DefaultHeader height={headerHeight} title={title} />
      )}
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  justifyContent: 'flex-end',
  variants: {
    isSearchBarOpen: {
      true: {
        backgroundColor: '$customGray3',
      },
      false: {
        backgroundColor: '$customBlack1',
      },
    },
  } as const,
});

export default CustomHeader;
