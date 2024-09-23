import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { useRef, useState } from 'react';

import { Activity, DateGroupedTasks, TabRoute, TaskFilter } from '@/app/entities';
import useListModals from '@/app/hooks/useListModals';
import useSearchBarFilters from '@/app/hooks/useSearchBarFilters';
import useTaskList from '@/app/hooks/useTaskList';
import { toFormattedDateString } from '@/app/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { parse } from 'date-fns';
import { usePathname } from 'expo-router';
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

const toDateGroupedTasks = (tasks: Activity[]) => {
  const groups: DateGroupedTasks = tasks.reduce((acc: DateGroupedTasks, task) => {
    const dueDate = toFormattedDateString(task.endDate!);
    if (!acc[dueDate]) {
      acc[dueDate] = [];
    }
    acc[dueDate].push(task);
    return acc;
  }, {});

  // Sort the keys (due dates) in ascending order
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const dateA = parse(a, 'dd MMM yyyy', new Date()); // Convert formatted date string to Date object
    const dateB = parse(b, 'dd MMM yyyy', new Date());
    return dateA.getTime() - dateB.getTime();
  });

  // Create a new object with sorted keys
  const sortedGroups: DateGroupedTasks = {};
  sortedKeys.forEach((key) => {
    sortedGroups[key] = groups[key];
  });

  return sortedGroups;
};

const toFormattedSections = (tasksByDueDate: DateGroupedTasks) => {
  const sections: (string | Activity)[] = [];
  Object.keys(tasksByDueDate).forEach((dueDate) => {
    sections.push(dueDate);
    sections.push(...tasksByDueDate[dueDate]);
  });
  return sections;
};

const formatTasks = (taskFilter: TaskFilter, tasks: Activity[]) => {
  if (taskFilter === 'single task') {
    const dateGroupedTasks = toDateGroupedTasks(tasks);
    return toFormattedSections(dateGroupedTasks);
  } else {
    return tasks;
  }
};

const TaskList = ({ isSearchBarOpen }: Props) => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);

  const listRef = useRef<FlashList<string | Activity> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const handleSelect = (selectedTask: Activity) => setSelectedTask(selectedTask);

  const { isDeleteModalOpen, toggleDeleteModal, toggleActivityOptionsModal } =
    useListModals(activityOptionsRef, handleSelect);

  const { tasks, taskFilter, navigateToTaskDetailsScreen, handleDelete, handleSwipe } =
    useTaskList(listRef, activityOptionsRef, handleSelect, toggleDeleteModal);

  const filteredTasks = useSearchBarFilters(
    isSearchBarOpen && pathname === 'tasks',
    tasks
  );

  const formattedTasks = formatTasks(
    taskFilter,
    isSearchBarOpen ? filteredTasks : tasks
  );

  const isPressDisabled = taskFilter === 'single task' ? true : false;

  const isListEmpty = !tasks.length;

  return (
    <Container isContentCentered={isListEmpty}>
      {isListEmpty ? (
        <ActivityListPlaceholder />
      ) : (
        <AnimatedFlashList
          ref={listRef}
          data={formattedTasks}
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
