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
import ActivityOptionsModal from '../../habits/ActivityOptionsModal';
import { router } from 'expo-router';

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
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalState, setModalState] = useState({
    isDeleteOpen: false,
    isPrioritizeOpen: false,
  });

  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const { isDeleteOpen, isPrioritizeOpen } = modalState;

  const handlePress = (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
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
      if (task.id === selectedTaskId) {
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

  const handleDelete = (id?: string) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
    setSelectedTask(null);
    taskListRef.current?.prepareForLayoutAnimationRender();
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

  useEffect(() => {
    if (isPrioritizeOpen) {
      const priority = tasks.find((task) => task.id === selectedTaskId)?.priority;
      if (priority) {
        setCurrentPriority(priority);
      }
    } else {
      setCurrentPriority(null);
    }
  }, [tasks, isPrioritizeOpen, selectedTaskId]);

  return (
    <>
      {isSectioned ? (
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
                  onSwipe={(id) => setSelectedTaskId(id)}
                  openModal={(modalName) =>
                    setModalState({ ...modalState, [modalName]: true })
                  }
                  isCheckable={isCheckable}
                />
              );
            }
          }}
          keyExtractor={(item, index) => index.toString()}
          getItemType={(item) => {
            return typeof item === 'string' ? 'sectionHeader' : 'row';
          }}
          estimatedItemSize={72}
        />
      ) : (
        <AnimatedFlashList
          ref={taskListRef}
          data={filteredTasks as Task[]}
          renderItem={({ item }) => (
            <TaskItem
              isRecurring
              isCheckable={isCheckable}
              task={item as Task}
              onPress={handlePress}
              onSwipe={(id) => setSelectedTaskId(id)}
              openModal={(modalName) =>
                setModalState({ ...modalState, [modalName]: true })
              }
              showOptions={handlePresentActivityOptionsModal}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={72}
        />
      )}

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
        <DeleteModalModule
          taskId={selectedTaskId}
          deleteTask={handleDelete}
          closeModal={closeDeleteModal}
        />
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
