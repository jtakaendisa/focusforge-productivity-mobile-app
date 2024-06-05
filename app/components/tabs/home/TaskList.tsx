import { MutableRefObject, useEffect, useState } from 'react';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';

import { Priority, Task } from '@/app/entities';
import { useTaskStore } from '@/app/store';
import TaskItem from '../tasks/TaskItem';
import ModalContainer from '../modals/ModalContainer';
import DeleteModalModule from '../modals/DeleteModalModule';
import TaskSectionHeader from '../tasks/TaskSectionHeader';
import PriorityModalModule from '../modals/PriorityModalModule';

interface Props {
  taskListRef: MutableRefObject<FlashList<Task | (string | Task)> | null>;
  tasks: Task[];
  filteredTasks: Task[] | (string | Task)[];
  isSectioned?: boolean;
  isSwipeable?: boolean;
}

const TaskList = ({
  taskListRef,
  tasks,
  filteredTasks,
  isSectioned,
  isSwipeable,
}: Props) => {
  const setTasks = useTaskStore((s) => s.setTasks);

  const [currentPriority, setCurrentPriority] = useState<Priority | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [modalState, setModalState] = useState({
    isDeleteOpen: false,
    isPrioritizeOpen: false,
  });

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
  };

  const handleDelete = (id: string) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
    taskListRef.current?.prepareForLayoutAnimationRender();
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
                  isSwipeable={isSwipeable}
                  task={item}
                  onPress={handlePress}
                  onSwipe={(id) => setSelectedTaskId(id)}
                  openModal={(modalName) =>
                    setModalState({ ...modalState, [modalName]: true })
                  }
                />
              );
            }
          }}
          keyExtractor={(item: string | Task, index) => index.toString()}
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
              isSwipeable={isSwipeable}
              task={item as Task}
              onPress={handlePress}
              onSwipe={(id) => setSelectedTaskId(id)}
              openModal={(modalName) =>
                setModalState({ ...modalState, [modalName]: true })
              }
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
    </>
  );
};

export default TaskList;
