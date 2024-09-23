import { MutableRefObject, useMemo } from 'react';
import { useActivityStore } from '../store';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Activity, HabitActiveTab } from '../entities';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Swipeable } from 'react-native-gesture-handler';
import { toFormattedDateString } from '../utils';
import useCompletionDates from './useCompletionDates';

const useHabitList = (
  listRef: MutableRefObject<FlashList<Activity> | null>,
  activityOptionsRef: MutableRefObject<BottomSheetModalMethods | null>,
  handleSelect: (selectedHabit: Activity) => void,
  toggleDeleteModal: () => void
) => {
  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);

  const { completionDatesMap, updateCompletionDatesMap } = useCompletionDates();

  const habits = useMemo(
    () => activities.filter((activity) => activity.type === 'habit'),
    [activities]
  );

  const navigateToHabitDetailsScreen = (activeTab: HabitActiveTab, habitId: string) => {
    if (!habitId.length) return;

    activityOptionsRef.current?.dismiss();
    router.push({
      pathname: '/habitDetails',
      params: { activeTab, habitId },
    });
  };

  const handleDelete = (id: string) => {
    const filteredActivities = activities.filter((activity) => activity.id !== id);
    setActivities(filteredActivities);
    listRef.current?.prepareForLayoutAnimationRender();
    activityOptionsRef.current?.close();
  };

  const handleSwipe = (
    direction: 'left' | 'right',
    selectedHabit: Activity,
    swipeableRef: MutableRefObject<Swipeable | null>
  ) => {
    handleSelect(selectedHabit);

    if (direction === 'left') {
      navigateToHabitDetailsScreen('edit', selectedHabit.id);
    } else {
      toggleDeleteModal();
    }
    swipeableRef.current?.close();
  };

  const handleComplete = async (selectedDate: Date, habitId: string) => {
    if (!completionDatesMap) return;

    const updatedCompletionDates = completionDatesMap[habitId].map((entry) =>
      entry.date === toFormattedDateString(selectedDate)
        ? { ...entry, isCompleted: !entry.isCompleted }
        : entry
    );

    const updatedCompletionDatesMap = {
      ...completionDatesMap,
      [habitId]: updatedCompletionDates,
    };
    await updateCompletionDatesMap(updatedCompletionDatesMap);
  };

  return {
    habits,
    completionDatesMap,
    navigateToHabitDetailsScreen,
    handleDelete,
    handleSwipe,
    handleComplete,
  };
};

export default useHabitList;
