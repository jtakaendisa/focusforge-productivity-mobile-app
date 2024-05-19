import { MutableRefObject, useState } from 'react';
import { FlashList } from '@shopify/flash-list';

import { Task } from '@/app/entities';
import { useTaskStore } from '@/app/store';
import TaskItem from '../tasks/TaskItem';
import ModalContainer from '../modals/ModalContainer';
import DeleteModalModule from '../modals/DeleteModalModule';
import { Text } from 'tamagui';
import TaskSectionHeader from '../tasks/TaskSectionHeader';

interface Props {
  taskListRef: MutableRefObject<FlashList<Task | (string | Task)> | null>;
  tasks: Task[];
  filteredTasks: Task[] | (string | Task)[];
  isSectioned?: boolean;
}

const TaskList = ({ taskListRef, tasks, filteredTasks, isSectioned }: Props) => {
  const setTasks = useTaskStore((s) => s.setTasks);

  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [modalState, setModalState] = useState({
    deleteIsOpen: false,
    prioritizeIsOpen: false,
  });

  const handleTaskPress = (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          isCompleted: !task.isCompleted,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleTaskDeletion = (id: string) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
    taskListRef.current?.prepareForLayoutAnimationRender();
  };

  const { deleteIsOpen, prioritizeIsOpen } = modalState;

  return (
    <>
      {isSectioned ? (
        <FlashList
          ref={taskListRef}
          data={filteredTasks as (string | Task)[]}
          renderItem={({ item }) => {
            if (typeof item === 'string') {
              return <TaskSectionHeader title={item} />;
            } else {
              return (
                <TaskItem
                  task={item}
                  onPress={handleTaskPress}
                  onSwipe={(id) => setSelectedTaskId(id)}
                  openModal={(modalName) =>
                    setModalState({ ...modalState, [modalName]: true })
                  }
                />
              );
            }
          }}
          keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
          getItemType={(item) => {
            return typeof item === 'string' ? 'sectionHeader' : 'row';
          }}
          estimatedItemSize={60}
        />
      ) : (
        <FlashList
          ref={taskListRef}
          data={filteredTasks as Task[]}
          renderItem={({ item }) => (
            <TaskItem
              task={item as Task}
              onPress={handleTaskPress}
              onSwipe={(id) => setSelectedTaskId(id)}
              openModal={(modalName) =>
                setModalState({ ...modalState, [modalName]: true })
              }
            />
          )}
          keyExtractor={(item) => (item as Task).id}
          estimatedItemSize={20}
        />
      )}

      {prioritizeIsOpen && (
        <ModalContainer
          isOpen={prioritizeIsOpen}
          closeModal={() => setModalState({ ...modalState, prioritizeIsOpen: false })}
        >
          <></>
        </ModalContainer>
      )}
      {deleteIsOpen && (
        <ModalContainer
          isOpen={deleteIsOpen}
          closeModal={() => setModalState({ ...modalState, deleteIsOpen: false })}
        >
          <DeleteModalModule
            taskId={selectedTaskId}
            deleteTask={handleTaskDeletion}
            closeModal={() => setModalState({ ...modalState, deleteIsOpen: false })}
          />
        </ModalContainer>
      )}
    </>
  );
};

export default TaskList;
