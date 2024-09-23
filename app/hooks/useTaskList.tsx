import { MutableRefObject, useMemo } from 'react';
import { useActivityStore, useSearchStore } from '../store';
import { Activity, TaskActiveTab } from '../entities';
import { router } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

const useTaskList = (
  listRef: MutableRefObject<FlashList<string | Activity> | null>,
  activityOptionsRef: MutableRefObject<BottomSheetModalMethods | null>,
  handleSelect: (selectedTask: Activity) => void,
  toggleDeleteModal: () => void
) => {
  const activities = useActivityStore((s) => s.activities);
  const taskFilter = useSearchStore((s) => s.taskFilter);
  const setActivities = useActivityStore((s) => s.setActivities);

  const tasks = useMemo(
    () => activities.filter((activity) => activity.type === taskFilter),
    [activities, taskFilter]
  );

  const navigateToTaskDetailsScreen = (activeTab: TaskActiveTab, taskId: string) => {
    if (!taskId.length) return;

    activityOptionsRef.current?.dismiss();
    router.push({
      pathname: '/taskDetails',
      params: { activeTab, taskId },
    });
  };

  const handleSwipe = (
    direction: 'left' | 'right',
    selectedTask: Activity,
    swipeableRef: MutableRefObject<Swipeable | null>
  ) => {
    handleSelect(selectedTask);

    if (direction === 'left') {
      navigateToTaskDetailsScreen('edit', selectedTask.id);
    } else {
      toggleDeleteModal();
    }
    swipeableRef.current?.close();
  };

  const handleDelete = (id: string) => {
    const updatedActivities = activities.filter((activity) => activity.id !== id);
    setActivities(updatedActivities);
    listRef.current?.prepareForLayoutAnimationRender();
    activityOptionsRef.current?.close();
  };

  return {
    tasks,
    taskFilter,
    navigateToTaskDetailsScreen,
    handleSwipe,
    handleDelete,
  };
};

export default useTaskList;
