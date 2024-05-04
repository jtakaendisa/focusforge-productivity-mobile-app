import { TextInput } from 'react-native';
import { View, Text, styled } from 'tamagui';

// TodoItem

const TaskContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  padding: 6,
});

const Title = styled(Text, {
  fontSize: 16,
  variants: {
    isCompleted: {
      true: {
        color: '#898a8f',
        textDecorationLine: 'line-through',
      },
      false: {
        color: '#303137',
        textDecorationLine: 'none',
      },
    } as const,
  },
});

// CreateTodoItem
const Input = styled(TextInput, {
  flex: 1,
  // @ts-ignore
  fontSize: 16,
});

export { TaskContainer, Title, Input };
