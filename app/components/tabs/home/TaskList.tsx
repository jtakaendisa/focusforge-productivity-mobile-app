import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';

import { Priority, Task } from '@/app/entities';
import { useTaskStore } from '@/app/store';
import TaskItem from '../tasks/TaskItem';
import ModalContainer from '../modals/ModalContainer';
import DeleteModalModule from '../modals/DeleteModalModule';
import TaskSectionHeader from '../tasks/TaskSectionHeader';
import PriorityModalModule from '../modals/PriorityModalModule';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ActivityOptionsModal from '../habits/ActivityOptionsModal';
import { router } from 'expo-router';
import ChecklistModalModule from '../modals/ChecklistModalModule';

interface Props {
  taskListRef: MutableRefObject<FlashList<Task | (string | Task)> | null>;
  tasks: Task[];
  filteredTasks: Task[] | (string | Task)[];
  isSectioned?: boolean;
  isCheckable?: boolean;
}

const TaskList = ({
  taskListRef,
  tasks,
  filteredTasks,
  isSectioned,
  isCheckable,
}: Props) => {
  const setTasks = useTaskStore((s) => s.setTasks);

  const [currentPriority, setCurrentPriority] = useState<Priority | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalState, setModalState] = useState({
    isDeleteOpen: false,
    isPrioritizeOpen: false,
    isChecklistOpen: false,
  });

  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const { isDeleteOpen, isPrioritizeOpen, isChecklistOpen } = modalState;

  const handlePress = (selectedTask: Task, hasChecklist?: boolean) => {
    const allCompleted = selectedTask.checklist.every((item) => item.isCompleted);

    if (hasChecklist && !allCompleted) {
      setSelectedTask(selectedTask);
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === selectedTask.id) {
        return {
          ...task,
          checklist:
            hasChecklist && task.isCompleted
              ? task.checklist.map((item) => ({ ...item, isCompleted: false }))
              : task.checklist,
          isCompleted: !task.isCompleted,
        };
      } else {
        return task;
      }
    });
    setTasks(updatedTasks);
  };

  const handlePrioritize = (priority: Priority) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === selectedTask?.id) {
        return {
          ...task,
          priority,
        };
      } else {
        return task;
      }
    });
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  const handleDelete = (id: string) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
    taskListRef.current?.prepareForLayoutAnimationRender();

    activityOptionsRef.current?.close();
    setSelectedTask(null);
  };

  const navigateToTaskDetailsScreen = (activeTab: string, taskId: string) => {
    if (!taskId.length) return;

    activityOptionsRef.current?.dismiss();
    router.push({
      pathname: '/taskDetails',
      params: { activeTab, taskId },
    });
  };

  const handlePresentActivityOptionsModal = (task: Task) => {
    setSelectedTask(task);
    activityOptionsRef.current?.present();
  };

  const closeDeleteModal = () => setModalState({ ...modalState, isDeleteOpen: false });

  const closePriorityModal = () =>
    setModalState({ ...modalState, isPrioritizeOpen: false });

  const toggleChecklistModal = () => {
    setModalState({ ...modalState, isChecklistOpen: !isChecklistOpen });
    setSelectedTask(null);
  };

  useEffect(() => {
    if (isPrioritizeOpen) {
      const priority = tasks.find((task) => task.id === selectedTask?.id)?.priority;
      if (priority) {
        setCurrentPriority(priority);
      }
    } else {
      setCurrentPriority(null);
    }
  }, [tasks, isPrioritizeOpen, selectedTask]);

  return (
    <>
      <AnimatedFlashList
        ref={taskListRef}
        data={filteredTasks as (string | Task)[]}
        renderItem={({ item }) => {
          if (typeof item === 'string') {
            return <TaskSectionHeader title={item} />;
          } else {
            return (
              <TaskItem
                task={item}
                onPress={handlePress}
                onSwipe={(selectedTask) => setSelectedTask(selectedTask)}
                openModal={(modalName) =>
                  setModalState({ ...modalState, [modalName]: true })
                }
                isCheckable={isCheckable}
                showOptions={handlePresentActivityOptionsModal}
              />
            );
          }
        }}
        keyExtractor={(item) => {
          return typeof item === 'string' ? item : item.id;
        }}
        getItemType={(item) => {
          return typeof item === 'string' ? 'sectionHeader' : 'row';
        }}
        estimatedItemSize={72}
      />

      <ModalContainer isOpen={isPrioritizeOpen} closeModal={closePriorityModal}>
        {currentPriority && (
          <PriorityModalModule
            currentPriority={currentPriority}
            setPriority={handlePrioritize}
            closeModal={closePriorityModal}
          />
        )}
      </ModalContainer>
      <ModalContainer isOpen={isDeleteOpen} closeModal={closeDeleteModal}>
        {selectedTask && (
          <DeleteModalModule
            taskId={selectedTask.id}
            deleteTask={handleDelete}
            closeModal={closeDeleteModal}
          />
        )}
      </ModalContainer>
      <ModalContainer isOpen={isChecklistOpen} closeModal={toggleChecklistModal}>
        {selectedTask?.checklist && (
          <ChecklistModalModule
            tasks={tasks}
            taskId={selectedTask.id}
            checklist={selectedTask.checklist}
            closeModal={toggleChecklistModal}
          />
        )}
      </ModalContainer>
      <ActivityOptionsModal
        mode="task"
        activityOptionsRef={activityOptionsRef}
        selectedActivity={selectedTask}
        onDelete={handleDelete}
        onNavigate={navigateToTaskDetailsScreen}
      />
    </>
  );
};

export default TaskList;
