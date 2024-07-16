import { SafeAreaView, StatusBar } from 'react-native';
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
import { toDateGroupedTasks, toFormattedSections } from '@/app/utils';

interface Props {
  title?: string;
}

const CustomHeader = ({ title }: Props) => {
  const isSearchBarOpen = useAppStore((s) => s.isSearchBarOpen);
  const habits = useHabitStore((s) => s.habits);
  const tasks = useTaskStore((s) => s.tasks);
  const setHeaderHeight = useAppStore((s) => s.setHeaderHeight);
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

  const singleSectionedTasks = useMemo(() => {
    const singleTasks = tasks.filter((task) => task.isRecurring === false);
    const dateGroupedTasks = toDateGroupedTasks(singleTasks);
    return toFormattedSections(dateGroupedTasks);
  }, [tasks]);

  const recurringTasks = useMemo(
    () => tasks.filter((task) => task.isRecurring === true),
    [tasks]
  );

  useEffect(() => {
    if (headerHeight) {
      setHeaderHeight(headerHeight);
    }
  }, [headerHeight, setHeaderHeight]);

  useEffect(() => {
    setFilteredHabits(habits);
  }, [habits]);

  useEffect(() => {
    setFilteredSingleTasks(singleSectionedTasks);
    setFilteredRecurringTasks(recurringTasks);
  }, [singleSectionedTasks, recurringTasks]);

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
