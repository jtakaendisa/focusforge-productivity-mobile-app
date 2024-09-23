import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { useRef, useState } from 'react';

import { Activity } from '@/app/entities';
import useActivityList from '@/app/hooks/useActivityList';
import useListModals from '@/app/hooks/useListModals';
import { useActivityStore, useSearchStore } from '@/app/store';
import { styled, View } from 'tamagui';
import ChecklistModalModule from '../modals/ChecklistModalModule';
import DeleteModalModule from '../modals/DeleteModalModule';
import ModalContainer from '../modals/ModalContainer';
import PriorityModalModule from '../modals/PriorityModalModule';
import TaskListItem from '../tasks/TaskListItem';
import ActivityListPlaceholder from './ActivityListPlaceholder';

interface Props {
  isSearchBarOpen: boolean;
}

const ActivityList = ({ isSearchBarOpen }: Props) => {
  const selectedDate = useActivityStore((s) => s.selectedDate);
  const setActivities = useActivityStore((s) => s.setActivities);
  const setFilteredActivities = useSearchStore((s) => s.setFilteredActivities);
  const activityFilter = useSearchStore((s) => s.activityFilter);
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const selectedCategories = useSearchStore((s) => s.selectedCategories);

  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);

  const listRef = useRef<FlashList<Activity> | null>(null);

  const handleSelect = (selectedTask: Activity) => setSelectedTask(selectedTask);

  const {
    isDeleteModalOpen,
    isPriorityModalOpen,
    isChecklistModalOpen,
    toggleDeleteModal,
    togglePriorityModal,
    toggleChecklistModal,
  } = useListModals();

  const {
    activities,
    activitiesDueToday,
    completionDatesMap,
    handlePress,
    handlePrioritize,
    handleSwipe,
    handleDelete,
    getTaskCompletionStatus,
  } = useActivityList(
    listRef,
    selectedTask,
    handleSelect,
    toggleDeleteModal,
    togglePriorityModal,
    toggleChecklistModal
  );

  const isListEmpty = !activitiesDueToday.length;
  const isPressDisabled = selectedDate > new Date();

  // useEffect(() => {
  //   if (isSearchBarOpen) {
  //     setFilteredActivities([
  //       ...memoizedSingleTasksDueToday,
  //       ...memoizedRecurringActivitiesDueToday,
  //     ]);
  //   }
  // }, [
  //   isSearchBarOpen,
  //   memoizedSingleTasksDueToday,
  //   memoizedRecurringActivitiesDueToday,
  // ]);

  // useEffect(() => {
  //   if (!isSearchBarOpen) return;

  //   const activitiesDueToday = [
  //     ...memoizedSingleTasksDueToday,
  //     ...memoizedRecurringActivitiesDueToday,
  //   ];

  //   if (!searchTerm.length) {
  //     setActivitiesDueToday(activitiesDueToday);
  //   } else {
  //     setActivitiesDueToday(
  //       activitiesDueToday.filter((activity) =>
  //         activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   }
  // }, [
  //   isSearchBarOpen,
  //   memoizedSingleTasksDueToday,
  //   memoizedRecurringActivitiesDueToday,
  //   searchTerm,
  // ]);

  // useEffect(() => {
  //   if (!isSearchBarOpen) return;

  //   const activitiesDueToday = [
  //     ...memoizedSingleTasksDueToday,
  //     ...memoizedRecurringActivitiesDueToday,
  //   ];

  //   if (!selectedCategories.length) {
  //     setActivitiesDueToday(activitiesDueToday);
  //   } else {
  //     setActivitiesDueToday(
  //       activitiesDueToday.filter((activity) =>
  //         selectedCategories.includes(activity.category)
  //       )
  //     );
  //   }
  // }, [
  //   isSearchBarOpen,
  //   memoizedSingleTasksDueToday,
  //   memoizedRecurringActivitiesDueToday,
  //   selectedCategories,
  // ]);

  // useEffect(() => {
  //   if (!isSearchBarOpen) return;

  //   const activitiesDueToday = [
  //     ...memoizedSingleTasksDueToday,
  //     ...memoizedRecurringActivitiesDueToday,
  //   ];

  //   switch (activityFilter) {
  //     case 'all':
  //       setActivitiesDueToday(activitiesDueToday);
  //       break;
  //     case 'habits':
  //       setActivitiesDueToday(
  //         activitiesDueToday.filter((activity) => activity.type === 'habit')
  //       );
  //       break;
  //     case 'tasks':
  //       setActivitiesDueToday(
  //         activitiesDueToday.filter(
  //           (activity) =>
  //             activity.type === 'single task' || activity.type === 'recurring task'
  //         )
  //       );
  //       break;
  //   }
  // }, [
  //   isSearchBarOpen,
  //   memoizedSingleTasksDueToday,
  //   memoizedRecurringActivitiesDueToday,
  //   activityFilter,
  // ]);

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
              isCompleted={getTaskCompletionStatus(item)}
              isPressDisabled={isPressDisabled}
              isCheckable
              onPress={handlePress}
              onSwipe={handleSwipe}
            />
          )}
          keyExtractor={(item) => item.id}
          extraData={completionDatesMap}
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
