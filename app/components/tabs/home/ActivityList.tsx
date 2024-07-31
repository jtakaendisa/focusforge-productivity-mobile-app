import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { MutableRefObject, useMemo, useRef, useState } from 'react';

import { Activity, Priority, Task } from '@/app/entities';
import { useActivityStore } from '@/app/store';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Swipeable } from 'react-native-gesture-handler';
import ChecklistModalModule from '../modals/ChecklistModalModule';
import DeleteModalModule from '../modals/DeleteModalModule';
import ModalContainer from '../modals/ModalContainer';
import PriorityModalModule from '../modals/PriorityModalModule';
import TaskListItem from '../tasks/TaskListItem';
import { styled, View } from 'tamagui';
import ActivityListPlaceholder from './ActivityListPlaceholder';

const ActivityList = () => {
  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);

  const [todos, setTodos] = useState([]);
  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  const taskListRef = useRef<FlashList<Task | (string | Task)> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const singleTasks = useMemo(
    () => activities.filter((activity) => activity.type === 'single task'),
    [activities]
  );
  const recurringTasks = useMemo(
    () => activities.filter((activity) => activity.type === 'recurring task'),
    [activities]
  );

  const isTodosEmpty = !todos.length;

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
    taskListRef.current?.prepareForLayoutAnimationRender();
    activityOptionsRef.current?.close();
  };

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  const togglePriorityModal = () => setIsPriorityModalOpen((prev) => !prev);

  const toggleChecklistModal = () => setIsChecklistModalOpen((prev) => !prev);

  return (
    <Container isContentCentered={isTodosEmpty}>
      {isTodosEmpty ? (
        <ActivityListPlaceholder />
      ) : (
        <AnimatedFlashList
          ref={taskListRef}
          data={todos}
          renderItem={({ item }) => (
            <TaskListItem
              task={item}
              onTaskComplete={handleTaskComplete}
              onSwipe={handleSwipe}
              isCheckable
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
