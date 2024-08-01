import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

import { CURRENT_DATE } from '@/app/constants';
import { Activity, Priority } from '@/app/entities';
import { useActivityStore, useSearchStore } from '@/app/store';
import { toFormattedDateString } from '@/app/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Swipeable } from 'react-native-gesture-handler';
import { styled, View } from 'tamagui';
import ChecklistModalModule from '../modals/ChecklistModalModule';
import DeleteModalModule from '../modals/DeleteModalModule';
import ModalContainer from '../modals/ModalContainer';
import PriorityModalModule from '../modals/PriorityModalModule';
import TaskListItem from '../tasks/TaskListItem';
import ActivityListPlaceholder from './ActivityListPlaceholder';

const carryOverTasks = (activities: Activity[]) =>
  activities.map((activity) =>
    activity.type === 'single task' &&
    activity.isCarriedOver &&
    !activity.isCompleted &&
    new Date(activity.endDate!) < CURRENT_DATE
      ? { ...activity, endDate: CURRENT_DATE }
      : activity
  );

const filterRecurringActivitiesByDate = (
  recurringActivities: Activity[],
  date: Date
) => {
  const filtered = recurringActivities.filter((activity) => {
    const startDate = new Date(activity.startDate!);
    const endDate = activity.endDate ? new Date(activity.endDate) : null;

    // Check if the activity is within the date range
    if (endDate && date > endDate) return false;
    if (date < startDate) return false;

    // Check activity frequency
    switch (activity.frequency.type) {
      case 'daily':
        return true;
      case 'specific':
        return activity.frequency.isRepeatedOn!.includes(
          date.toLocaleDateString('en-US', { weekday: 'long' })
        );
      case 'repeats':
        const daysDifference = Math.floor(
          (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDifference % activity.frequency!.isRepeatedEvery! === 0;
      default:
        return false;
    }
  });

  return filtered;
};

const ActivityList = () => {
  const selectedDate = useActivityStore((s) => s.selectedDate);
  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);
  const setFilteredActivities = useSearchStore((s) => s.setFilteredActivities);

  const [activitiesDueToday, setActivitiesDueToday] = useState<Activity[]>([]);
  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);
  const [carriedOverPendingTasks, setCarriedOverPendingTasks] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  const listRef = useRef<FlashList<Activity> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const memoizedSingleTasksDueToday = useMemo(() => {
    if (!carriedOverPendingTasks) return [];

    return activities.filter(
      (activity) =>
        activity.type === 'single task' &&
        toFormattedDateString(activity.endDate!) === toFormattedDateString(selectedDate)
    );
  }, [carriedOverPendingTasks, activities, selectedDate]);

  const memoizedRecurringActivitiesDueToday = useMemo(() => {
    const recurringActivities = activities.filter(
      (activity) => activity.type === 'recurring task' || activity.type === 'habit'
    );
    return filterRecurringActivitiesByDate(recurringActivities, selectedDate);
  }, [activities, selectedDate]);

  const isListEmpty = !activitiesDueToday.length;
  const isTaskCompletionDisabled = selectedDate > CURRENT_DATE;

  const handleTaskComplete = (selectedTask: Activity) => {
    const hasChecklist = !!selectedTask.checklist?.length;
    if (hasChecklist) {
      const allChecklistItemsCompleted = selectedTask.checklist?.every(
        (item) => item.isCompleted
      );
      if (!allChecklistItemsCompleted) {
        setSelectedTask(selectedTask);
        toggleChecklistModal();
      } else {
        const updatedActivities = activities.map((activity) =>
          activity.id === selectedTask.id
            ? {
                ...activity,
                checklist: activity.checklist!.map((item) => ({
                  ...item,
                  isCompleted: false,
                })),
                isCompleted: false,
              }
            : activity
        );
        setActivities(updatedActivities);
      }
    } else {
      const updatedActivities = activities.map((activity) =>
        activity.id === selectedTask.id
          ? {
              ...activity,
              isCompleted: !activity.isCompleted,
            }
          : activity
      );
      setActivities(updatedActivities);
    }
  };

  const handlePrioritize = (priority: Priority) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === selectedTask?.id ? { ...activity, priority } : activity
    );
    setActivities(updatedActivities);
  };

  const handleSwipe = (
    direction: 'left' | 'right',
    selectedTask: Activity,
    swipeableRef: MutableRefObject<Swipeable | null>
  ) => {
    setSelectedTask(selectedTask);

    if (direction === 'left') {
      togglePriorityModal();
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

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  const togglePriorityModal = () => setIsPriorityModalOpen((prev) => !prev);

  const toggleChecklistModal = () => setIsChecklistModalOpen((prev) => !prev);

  useEffect(() => {
    const updatedActivities = carryOverTasks(activities);
    setActivities(updatedActivities);
    setCarriedOverPendingTasks(true);
  }, []);

  useEffect(() => {
    const activitiesDueToday = [
      ...memoizedSingleTasksDueToday,
      ...memoizedRecurringActivitiesDueToday,
    ];
    setActivitiesDueToday(activitiesDueToday);
    setFilteredActivities(activitiesDueToday);
  }, [memoizedSingleTasksDueToday, memoizedRecurringActivitiesDueToday]);

  return (
    <Container isContentCentered={isListEmpty}>
      {isListEmpty ? (
        <ActivityListPlaceholder />
      ) : (
        <AnimatedFlashList
          ref={listRef}
          data={activitiesDueToday}
          renderItem={({ item }) => (
            <TaskListItem
              task={item}
              onTaskComplete={handleTaskComplete}
              onSwipe={handleSwipe}
              isCheckable
              isTaskCompletionDisabled={isTaskCompletionDisabled}
            />
          )}
          keyExtractor={(item) => item.id}
          estimatedItemSize={72}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ModalContainer isOpen={isPriorityModalOpen} closeModal={togglePriorityModal}>
        {selectedTask && (
          <PriorityModalModule
            initialPriority={selectedTask.priority}
            onPrioritize={handlePrioritize}
            closeModal={togglePriorityModal}
          />
        )}
      </ModalContainer>
      <ModalContainer isOpen={isDeleteModalOpen} closeModal={toggleDeleteModal}>
        {selectedTask && (
          <DeleteModalModule
            activityId={selectedTask.id}
            variant="task"
            onDelete={handleDelete}
            closeModal={toggleDeleteModal}
          />
        )}
      </ModalContainer>
      <ModalContainer isOpen={isChecklistModalOpen} closeModal={toggleChecklistModal}>
        {selectedTask?.checklist && (
          <ChecklistModalModule
            activities={activities}
            taskId={selectedTask.id}
            checklist={selectedTask.checklist}
            closeModal={toggleChecklistModal}
          />
        )}
      </ModalContainer>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  variants: {
    isContentCentered: {
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  } as const,
});

export default ActivityList;
