import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

import { Activity, Task, TaskActiveTab, TaskFilter } from '@/app/entities';
import { useActivityStore } from '@/app/store';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import ActivityOptionsModal from '../habits/ActivityOptionsModal';
import DeleteModalModule from '../modals/DeleteModalModule';
import ModalContainer from '../modals/ModalContainer';
import TaskListItem from './TaskListItem';
import TaskSectionHeader from './TaskSectionHeader';
import { styled, View } from 'tamagui';
import ActivityListPlaceholder from '../home/ActivityListPlaceholder';
import { toDateGroupedTasks, toFormattedSections } from '@/app/utils';

interface Props {
  taskFilter: TaskFilter;
}

const TaskList = ({ taskFilter }: Props) => {
  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);

  const [tasks, setTasks] = useState<(string | Activity)[]>([]);
  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const listRef = useRef<FlashList<Task | (string | Task)> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

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
    let tasks: (string | Activity)[] = [];

    if (taskFilter === 'single task') {
      tasks = singleTasks;
    } else {
      tasks = recurringTasks;
    }
    setTasks(tasks);
  }, [taskFilter, singleTasks, recurringTasks]);

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
                onSwipe={handleSwipe}
                showOptions={toggleActivityOptionsModal}
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
