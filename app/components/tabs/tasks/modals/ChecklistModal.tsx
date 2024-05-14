import { useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Control, Controller } from 'react-hook-form';
import { FlashList } from '@shopify/flash-list';
import { Text, View, styled } from 'tamagui';

import { NewTaskData } from '@/app/newTask';
import ModalContainer, { ModalHeading } from './ModalContainer';
import CreateTodoItem from '../CreateTodoItem';
import TodoItem from '../TodoItem';
import { Todo } from '@/app/entities';

interface Props {
  control: Control<NewTaskData>;
  closeModal: () => void;
}

const ChecklistModal = ({ control, closeModal }: Props) => {
  const todosRef = useRef<Todo[]>([]);
  const updateTodosRef = useRef<((...event: any[]) => void) | null>(null);

  const handleTaskPress = (id: string) => {
    console.log({ id });

    const updatedTodos = todosRef.current.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        };
      }
      return todo;
    });

    console.log({ updatedTodos });

    updateTodosRef.current?.(updatedTodos);
  };

  const handleTaskDelete = (id: string) => {
    const filteredTodos = todosRef.current.filter((todo) => todo.id !== id);
    updateTodosRef.current?.(filteredTodos);
  };

  return (
    <ModalContainer closeModal={closeModal}>
      <ModalHeading>
        <Text>Create sub tasks</Text>
      </ModalHeading>
      <Controller
        control={control}
        name="checklist"
        render={({ field: { onChange, value } }) => {
          todosRef.current = value;
          updateTodosRef.current = onChange;
          return (
            <SubtasksContainer>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <FlashList
                  data={value}
                  renderItem={({ item }) => (
                    <TodoItem
                      todo={item}
                      onPress={handleTaskPress}
                      onDelete={handleTaskDelete}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={ItemSeparator}
                  estimatedItemSize={10}
                  ListHeaderComponent={() => (
                    <CreateTodoItem
                      todos={value}
                      setTodos={(todos) => onChange(todos)}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </GestureHandlerRootView>
            </SubtasksContainer>
          );
        }}
      />
    </ModalContainer>
  );
};

const ItemSeparator = styled(View, {
  height: 6,
});

const SubtasksContainer = styled(View, {
  width: '100%',
  height: '50%',
});

export default ChecklistModal;
