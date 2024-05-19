import { useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Control, Controller } from 'react-hook-form';
import { FlashList } from '@shopify/flash-list';
import { Text, View, styled } from 'tamagui';

import { NewTaskData } from '@/app/newTask';
import CreateTaskItem from '../tasks/CreateTodoItem';
import TaskItem from '../tasks/TaskItem';
import { Task } from '@/app/entities';
import ModalContainer from './ModalContainer';

interface Props {
  control: Control<NewTaskData>;
  closeModal: () => void;
}

const ChecklistModal = ({ control, closeModal }: Props) => {
  const tasksRef = useRef<Task[]>([]);
  const updateTasksRef = useRef<((...event: any[]) => void) | null>(null);

  const handleTaskPress = (id: string) => {
    console.log({ id });

    const updatedTasks = tasksRef.current.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          isCompleted: !task.isCompleted,
        };
      }
      return task;
    });

    updateTasksRef.current?.(updatedTasks);
  };

  const handleTaskDelete = (id: string) => {
    const filteredTasks = tasksRef.current.filter((task) => task.id !== id);
    updateTasksRef.current?.(filteredTasks);
  };

  return (
    <ModalContainer closeModal={closeModal}>
      <Text>
        <Text>Create sub tasks</Text>
      </Text>
      <Controller
        control={control}
        name="checklist"
        render={({ field: { onChange, value } }) => {
          tasksRef.current = value;
          updateTasksRef.current = onChange;
          return (
            <SubtasksContainer>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <FlashList
                  data={value}
                  renderItem={({ item }) => (
                    <TaskItem
                      task={item}
                      onPress={handleTaskPress}
                      onDelete={handleTaskDelete}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={ItemSeparator}
                  estimatedItemSize={10}
                  ListHeaderComponent={() => (
                    <CreateTaskItem
                      tasks={value}
                      setTasks={(tasks) => onChange(tasks)}
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
