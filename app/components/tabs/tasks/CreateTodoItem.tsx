import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

import { Task } from '@/app/entities';
import { Input, TaskContainer } from './styled';

interface Props {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const CreateTaskItem = ({ tasks, setTasks }: Props) => {
  const [newTask, setNewTask] = useState('');

  const handleTodoSubmit = () => {
    if (!newTask.length) return;

    const newFormattedTask = {
      id: uuid.v4() as string,
      title: newTask,
      isCompleted: false,
    };
    const updatedTasks = [...tasks, newFormattedTask];

    setTasks(updatedTasks);
    setNewTask('');
  };

  return (
    <TaskContainer>
      <MaterialCommunityIcons
        name={'checkbox-blank-circle-outline'}
        size={24}
        color="dimgray"
      />
      <Input
        placeholder="Create Todo..."
        value={newTask}
        onChangeText={setNewTask}
        onEndEditing={handleTodoSubmit}
      />
    </TaskContainer>
  );
};

export default CreateTaskItem;
