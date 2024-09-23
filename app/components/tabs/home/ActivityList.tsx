import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { useRef, useState } from 'react';

import { Activity, TabRoute } from '@/app/entities';
import useActivityList from '@/app/hooks/useActivityList';
import useListModals from '@/app/hooks/useListModals';
import useSearchBarFilters from '@/app/hooks/useSearchBarFilters';
import { useActivityStore } from '@/app/store';
import { usePathname } from 'expo-router';
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
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const selectedDate = useActivityStore((s) => s.selectedDate);

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

  const filteredActivitiesDueToday = useSearchBarFilters(
    isSearchBarOpen && pathname === 'home',
    activitiesDueToday
  );

  const isListEmpty = !activitiesDueToday.length;
  const isPressDisabled = selectedDate > new Date();

  return (
    <Container isContentCentered={isListEmpty}>
      {isListEmpty ? (
        <ActivityListPlaceholder />
      ) : (
        <AnimatedFlashList
          ref={listRef}
          data={isSearchBarOpen ? filteredActivitiesDueToday : activitiesDueToday}
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
