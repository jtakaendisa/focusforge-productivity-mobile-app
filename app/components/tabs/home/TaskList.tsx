import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

import { Activity, Priority, Task } from '@/app/entities';
import { HabitActiveTab } from '@/app/habitDetails';
import { useActivityStore } from '@/app/store';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import ActivityOptionsModal from '../habits/ActivityOptionsModal';
import ChecklistModalModule from '../modals/ChecklistModalModule';
import DeleteModalModule from '../modals/DeleteModalModule';
import ModalContainer from '../modals/ModalContainer';
import PriorityModalModule from '../modals/PriorityModalModule';
import TaskListItem from '../tasks/TaskListItem';
import TaskSectionHeader from '../tasks/TaskSectionHeader';

const TaskList = () => {
  const activities = useActivityStore((s) => s.activities);
  const taskFilter = useActivityStore((s) => s.taskFilter);
  const setActivities = useActivityStore((s) => s.setActivities);

  const [tasks, setTasks] = useState<Activity[]>([]);
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
    setSelectedTask(null);
  };

  const navigateToTaskDetailsScreen = (activeTab: HabitActiveTab, taskId: string) => {
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
    swipeableRef: MutableRefObject<Swipeable | null>,
    isCheckable?: boolean
  ) => {
    setSelectedTask(selectedTask);

    if (direction === 'left') {
      if (isCheckable) {
        togglePriorityModal();
      } else {
        navigateToTaskDetailsScreen('edit', selectedTask.id);
      }
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
    setSelectedTask(null);
  };

  const toggleActivityOptionsModal = (task: Activity) => {
    setSelectedTask(task);
    activityOptionsRef.current?.present();
  };

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  const togglePriorityModal = () => setIsPriorityModalOpen((prev) => !prev);

  const toggleChecklistModal = () => setIsChecklistModalOpen((prev) => !prev);

  useEffect(() => {
    let tasks: Activity[] = [];

    if (taskFilter === 'single task') {
      tasks = singleTasks;
    } else {
      tasks = recurringTasks;
    }
    setTasks(tasks);
  }, [singleTasks, recurringTasks, taskFilter]);

  return (
    <>
      <AnimatedFlashList
        ref={taskListRef}
        data={tasks}
        renderItem={({ item }) =>
          typeof item === 'string' ? (
            <TaskSectionHeader title={item} />
          ) : (
            <TaskListItem
              task={item}
              onTaskComplete={handleTaskComplete}
              onSwipe={handleSwipe}
              isCheckable={false}
              showOptions={toggleActivityOptionsModal}
            />
          )
        }
        keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
        getItemType={(item) => (typeof item === 'string' ? 'sectionHeader' : 'row')}
        estimatedItemSize={72}
        showsVerticalScrollIndicator={false}
      />

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
      <ActivityOptionsModal
        mode="recurring task"
        activityOptionsRef={activityOptionsRef}
        selectedActivity={selectedTask}
        onDelete={handleDelete}
        onNavigate={navigateToTaskDetailsScreen}
      />
    </>
  );
};

export default TaskList;
