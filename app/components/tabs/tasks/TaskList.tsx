import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { useRef, useState } from 'react';

import { Activity } from '@/app/entities';
import useListModals from '@/app/hooks/useListModals';
import useTaskList from '@/app/hooks/useTaskList';
import { useSearchStore } from '@/app/store';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { styled, View } from 'tamagui';
import ActivityOptionsModal from '../habits/ActivityOptionsModal';
import ActivityListPlaceholder from '../home/ActivityListPlaceholder';
import DeleteModalModule from '../modals/DeleteModalModule';
import ModalContainer from '../modals/ModalContainer';
import TaskListItem from './TaskListItem';
import TaskSectionHeader from './TaskSectionHeader';

interface Props {
  isSearchBarOpen: boolean;
}

const TaskList = ({ isSearchBarOpen }: Props) => {
  const setFilteredActivities = useSearchStore((s) => s.setFilteredActivities);

  const searchTerm = useSearchStore((s) => s.searchTerm);
  const selectedCategories = useSearchStore((s) => s.selectedCategories);

  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);

  const listRef = useRef<FlashList<string | Activity> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const handleSelect = (selectedTask: Activity) => setSelectedTask(selectedTask);

  const { isDeleteModalOpen, toggleDeleteModal, toggleActivityOptionsModal } =
    useListModals(activityOptionsRef, handleSelect);

  const { tasks, taskFilter, navigateToTaskDetailsScreen, handleDelete, handleSwipe } =
    useTaskList(listRef, activityOptionsRef, handleSelect, toggleDeleteModal);

  const isPressDisabled = taskFilter === 'single task' ? true : false;

  const isListEmpty = !tasks.length;

  // useEffect(() => {
  //   if (isSearchBarOpen) {
  //     const tasks = taskFilter === 'single task' ? singleTasks : recurringTasks;
  //     setFilteredActivities(tasks);
  //   }
  // }, [isSearchBarOpen, taskFilter, singleTasks, recurringTasks]);

  // useEffect(() => {
  //   if (!isSearchBarOpen) return;

  //   const tasks = taskFilter === 'single task' ? singleTasks : recurringTasks;

  //   if (!searchTerm.length) {
  //     setTasks(tasks);
  //   } else {
  //     const filteredTasks = tasks.filter(
  //       (task) =>
  //         typeof task !== 'string' &&
  //         task.title.toLowerCase().includes(searchTerm.toLowerCase())
  //     );

  //     if (taskFilter === 'single task') {
  //       const dateGroupedTasks = toDateGroupedTasks(filteredTasks as Activity[]);
  //       const formattedTasks = toFormattedSections(dateGroupedTasks);
  //       setTasks(formattedTasks);
  //     } else {
  //       setTasks(filteredTasks);
  //     }
  //   }
  // }, [isSearchBarOpen, taskFilter, searchTerm]);

  // useEffect(() => {
  //   if (!isSearchBarOpen) return;

  //   const tasks = taskFilter === 'single task' ? singleTasks : recurringTasks;

  //   if (!selectedCategories.length) {
  //     setTasks(tasks);
  //   } else {
  //     const filteredTasks = tasks.filter(
  //       (task) => typeof task !== 'string' && selectedCategories.includes(task.category)
  //     );

  //     if (taskFilter === 'single task') {
  //       const dateGroupedTasks = toDateGroupedTasks(filteredTasks as Activity[]);
  //       const formattedTasks = toFormattedSections(dateGroupedTasks);
  //       setTasks(formattedTasks);
  //     } else {
  //       setTasks(filteredTasks);
  //     }
  //   }
  // }, [isSearchBarOpen, taskFilter, selectedCategories]);

  return (
    <Container isContentCentered={isListEmpty}>
      {isListEmpty ? (
        <ActivityListPlaceholder />
      ) : (
        <AnimatedFlashList
          ref={listRef}
          data={tasks}
          renderItem={({ item }) =>
            typeof item === 'string' ? (
              <TaskSectionHeader title={item} />
            ) : (
              <TaskListItem
                task={item}
                isPressDisabled={isPressDisabled}
                onSwipe={handleSwipe}
                onShowOptions={toggleActivityOptionsModal}
              />
            )
          }
          keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
          getItemType={(item) => (typeof item === 'string' ? 'sectionHeader' : 'row')}
          estimatedItemSize={72}
          showsVerticalScrollIndicator={false}
        />
      )}

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

      <ActivityOptionsModal
        mode="recurring task"
        activityOptionsRef={activityOptionsRef}
        selectedActivity={selectedTask}
        onDelete={handleDelete}
        onNavigate={navigateToTaskDetailsScreen}
      />
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

export default TaskList;
