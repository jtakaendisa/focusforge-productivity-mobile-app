import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

import { Activity, TaskActiveTab, TaskFilter } from '@/app/entities';
import { useActivityStore, useSearchStore } from '@/app/store';
import { toDateGroupedTasks, toFormattedSections } from '@/app/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
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
  const activities = useActivityStore((s) => s.activities);
  const taskFilter = useSearchStore((s) => s.taskFilter);
  const setActivities = useActivityStore((s) => s.setActivities);
  const setFilteredActivities = useSearchStore((s) => s.setFilteredActivities);

  const searchTerm = useSearchStore((s) => s.searchTerm);
  const selectedCategories = useSearchStore((s) => s.selectedCategories);

  const [tasks, setTasks] = useState<(string | Activity)[]>([]);
  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const listRef = useRef<FlashList<string | Activity> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const isPressDisabled = taskFilter === 'single task' ? true : false;

  const singleTasks = useMemo(() => {
    const filteredTasks = activities.filter(
      (activity) => activity.type === 'single task'
    );
    const dateGroupedTasks = toDateGroupedTasks(filteredTasks);
    const formattedTasks = toFormattedSections(dateGroupedTasks);
    return formattedTasks;
  }, [activities]);

  const recurringTasks = useMemo(
    () => activities.filter((activity) => activity.type === 'recurring task'),
    [activities]
  );

  const isListEmpty = !tasks.length;

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
    setSelectedTask(selectedTask);

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

  const toggleActivityOptionsModal = (task: Activity) => {
    setSelectedTask(task);
    activityOptionsRef.current?.present();
  };

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  useEffect(() => {
    const tasks = taskFilter === 'single task' ? singleTasks : recurringTasks;
    setTasks(tasks);
  }, [taskFilter, singleTasks, recurringTasks]);

  useEffect(() => {
    if (isSearchBarOpen) {
      const tasks = taskFilter === 'single task' ? singleTasks : recurringTasks;
      setFilteredActivities(tasks);
    }
  }, [isSearchBarOpen, taskFilter, singleTasks, recurringTasks]);

  useEffect(() => {
    if (!isSearchBarOpen) return;

    const tasks = taskFilter === 'single task' ? singleTasks : recurringTasks;

    if (!searchTerm.length) {
      setTasks(tasks);
    } else {
      const filteredTasks = tasks.filter(
        (task) =>
          typeof task !== 'string' &&
          task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (taskFilter === 'single task') {
        const dateGroupedTasks = toDateGroupedTasks(filteredTasks as Activity[]);
        const formattedTasks = toFormattedSections(dateGroupedTasks);
        setTasks(formattedTasks);
      } else {
        setTasks(filteredTasks);
      }
    }
  }, [isSearchBarOpen, taskFilter, searchTerm]);

  useEffect(() => {
    if (!isSearchBarOpen) return;

    const tasks = taskFilter === 'single task' ? singleTasks : recurringTasks;

    if (!selectedCategories.length) {
      setTasks(tasks);
    } else {
      const filteredTasks = tasks.filter(
        (task) => typeof task !== 'string' && selectedCategories.includes(task.category)
      );

      if (taskFilter === 'single task') {
        const dateGroupedTasks = toDateGroupedTasks(filteredTasks as Activity[]);
        const formattedTasks = toFormattedSections(dateGroupedTasks);
        setTasks(formattedTasks);
      } else {
        setTasks(filteredTasks);
      }
    }
  }, [isSearchBarOpen, taskFilter, selectedCategories]);

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
