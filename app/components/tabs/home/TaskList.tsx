import { MutableRefObject, useState } from 'react';
import { FlashList } from '@shopify/flash-list';

import { Todo } from '@/app/entities';
import { useTodoStore } from '@/app/store';
import TaskItem from '../tasks/TaskItem';
import ModalContainer from '../modals/ModalContainer';
import DeleteModalModule from '../modals/DeleteModalModule';

interface Props {
  taskListRef: MutableRefObject<FlashList<Todo> | null>;
  todos: Todo[];
  filteredTasks: Todo[];
}

const TaskList = ({ taskListRef, todos, filteredTasks }: Props) => {
  const setTodos = useTodoStore((s) => s.setTodos);

  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [modalState, setModalState] = useState({
    deleteIsOpen: false,
    prioritizeIsOpen: false,
  });

  const handleTaskPress = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleTaskDeletion = (id: string) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
    taskListRef.current?.prepareForLayoutAnimationRender();
  };

  const { deleteIsOpen, prioritizeIsOpen } = modalState;

  return (
    <>
      <FlashList
        ref={taskListRef}
        data={filteredTasks}
        renderItem={({ item }) => (
          <TaskItem
            todo={item}
            onPress={handleTaskPress}
            onSwipe={(id) => setSelectedTaskId(id)}
            openModal={(modalName) =>
              setModalState({ ...modalState, [modalName]: true })
            }
          />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={20}
      />

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
