import { MutableRefObject, useEffect, useMemo, useState } from 'react';
import { Activity, CompletionDatesMap, Priority } from '../entities';
import { useActivityStore } from '../store';
import { setDateToMidnight, toFormattedDateString } from '../utils';
import { FlashList } from '@shopify/flash-list';
import useCompletionDates from './useCompletionDates';
import useListModals from './useListModals';
import { Swipeable } from 'react-native-gesture-handler';

const carryOverTasks = (activities: Activity[]) =>
  activities.map((activity) =>
    activity.type === 'single task' &&
    activity.isCarriedOver &&
    !activity.isCompleted &&
    new Date(activity.endDate!) < new Date()
      ? { ...activity, endDate: new Date() }
      : activity
  );

const filterRecurringActivityByDate = (activity: Activity, date: Date) => {
  const startDate = setDateToMidnight(activity.startDate!);
  const endDate = activity.endDate ? setDateToMidnight(activity.endDate) : null;

  // Check if the activity is within the date range
  if (endDate && date > endDate) return false;
  if (date < startDate) return false;

  // Check activity frequency
  switch (activity.frequency.type) {
    case 'daily':
      return true; // Always true for daily recurring tasks
    case 'specific':
      return activity.frequency.isRepeatedOn!.includes(
        date.toLocaleDateString('en-US', { weekday: 'long' })
      ); // True if the day matches the specified repeat days
    case 'repeats':
      const daysDifference = Math.floor(
        (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDifference % activity.frequency.isRepeatedEvery! === 0; // Check if the task repeats on the given day
    default:
      return false;
  }
};

const getIsCompleted = (
  activity: Activity,
  completionDatesMap: CompletionDatesMap,
  selectedDate: Date
) => {
  if (activity.type === 'single task') {
    return activity.isCompleted;
  } else {
    const completionDates = completionDatesMap[activity.id];
    return (
      completionDates?.find((cd) => cd.date === toFormattedDateString(selectedDate))
        ?.isCompleted || false
    );
  }
};

const useActivityList = (
  listRef: MutableRefObject<FlashList<Activity> | null>,
  selectedTask: Activity | null,
  handleSelect: (selectedTask: Activity) => void,
  toggleDeleteModal: () => void,
  togglePriorityModal: () => void,
  toggleChecklistModal: () => void
) => {
  const selectedDate = useActivityStore((s) => s.selectedDate);
  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);

  const [carriedOverPendingTasks, setCarriedOverPendingTasks] = useState(false);

  const { completionDatesMap, updateCompletionDatesMap } = useCompletionDates();

  const activitiesDueToday = useMemo(() => {
    if (!carriedOverPendingTasks) return [];

    const { singleActivities, recurringActivities } = activities.reduce<{
      singleActivities: Activity[];
      recurringActivities: Activity[];
    }>(
      (acc, activity) => {
        if (activity.type === 'single task') {
          if (
            toFormattedDateString(activity.endDate!) ===
            toFormattedDateString(selectedDate)
          ) {
            acc.singleActivities.push(activity);
          }
        } else {
          if (filterRecurringActivityByDate(activity, selectedDate)) {
            acc.recurringActivities.push(activity);
          }
        }
        return acc;
      },
      { singleActivities: [], recurringActivities: [] }
    );

    return [...singleActivities, ...recurringActivities];
  }, [carriedOverPendingTasks, activities, selectedDate]);

  const completeSingleTask = (selectedTask: Activity) => {
    const hasChecklist = !!selectedTask.checklist?.length;

    if (hasChecklist) {
      const allChecklistItemsCompleted = selectedTask.checklist?.every(
        (item) => item.isCompleted
      );
      if (!allChecklistItemsCompleted) {
        handleSelect(selectedTask);
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

  const completeRecurringActivity = async (selectedActivity: Activity) => {
    const { id } = selectedActivity;

    const completionDates = completionDatesMap[id];

    const updatedCompletionDates = completionDates.map((item) =>
      item.date === toFormattedDateString(selectedDate)
        ? { ...item, isCompleted: !item.isCompleted }
        : item
    );

    const updatedCompletionDatesMap = {
      ...completionDatesMap,
      [id]: updatedCompletionDates,
    };

    updateCompletionDatesMap(updatedCompletionDatesMap);
  };

  const handlePress = (selectedActivity: Activity) => {
    if (selectedActivity.type === 'single task') {
      completeSingleTask(selectedActivity);
    } else {
      completeRecurringActivity(selectedActivity);
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
    handleSelect(selectedTask);

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
  };

  const getTaskCompletionStatus = (task: Activity) =>
    getIsCompleted(task, completionDatesMap, selectedDate);

  useEffect(() => {
    const updateActivityDueDates = () => {
      const updatedActivities = carryOverTasks(activities);
      setActivities(updatedActivities);
      setCarriedOverPendingTasks(true);
    };
    updateActivityDueDates();
  }, []);

  return {
    activities,
    activitiesDueToday,
    completionDatesMap,
    handlePress,
    handlePrioritize,
    handleSwipe,
    handleDelete,
    getTaskCompletionStatus,
  };
};

export default useActivityList;
